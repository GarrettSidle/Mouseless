import { Component } from "react";

import "./Editor.css";
import ValueDisplay from "../../components/ValueDisplay/ValueDisplay";
import Statistics from "../../components/Statistics/Statistics";
import MonacoEditor, { DiffEditor } from "@monaco-editor/react";

// Import data and types
import {
  EditorFormState,
  timerColorMap,
  speedColorMap,
  completionColorMap,
  strokesColorMap,
} from "./EditorData";

// Import utilities
import { calculateSpeed, calculateCompletion } from "./EditorCalculations";
import { EditorProblemManager } from "./EditorProblemManager";
import { MonacoEditorManager } from "./MonacoEditorLogic";
import { DiffEditorManager } from "./DiffEditorLogic";
import { postRequest } from "../../utils/api";
import { getSessionId } from "../../utils/cookies";

export class Editor extends Component<{}, EditorFormState> {
  private problemManager = new EditorProblemManager();
  private monacoEditorManager = new MonacoEditorManager();
  private diffEditorManager = new DiffEditorManager();
  private timer: NodeJS.Timeout | null = null;
  private skipCooldownTimer: NodeJS.Timeout | null = null;
  private _isMounted: boolean = true;
  private timerStartTime: number = 0; // Track when timer started for precise timing

  constructor(props: {}) {
    super(props);
    this.state = {
      minutes: 0,
      seconds: 0,
      isRunning: false,
      elapsedSeconds: 0,
      problem: null,
      wordsPerMin: 0,
      completionPerc: 0,
      hideStats: true,
      strokes: 0,
      showDiffEditor: true,
      isLoading: true,
      error: null,
      skipCooldown: false,
    };
  }

  skipProblem = async () => {
    // Prevent skipping if on cooldown
    if (this.state.skipCooldown) return;

    // Set cooldown
    this.setState({ skipCooldown: true });

    // Clear any existing cooldown timer
    if (this.skipCooldownTimer) {
      clearTimeout(this.skipCooldownTimer);
    }

    // Set cooldown timer to clear after 1 second
    this.skipCooldownTimer = setTimeout(() => {
      if (this._isMounted) {
        this.setState({ skipCooldown: false });
      }
      this.skipCooldownTimer = null;
    }, 1000);

    // Clear any existing timer first
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    // Hide and dispose DiffEditor before changing problem
    this.setState(
      { showDiffEditor: false, isLoading: true, error: null },
      () => {
        // Dispose DiffEditor after hiding
        this.diffEditorManager.dispose();
        // Small delay to ensure disposal completes, then fetch new problem
        setTimeout(async () => {
          try {
            const newProblem = await this.problemManager.getRandomProblem();
            if (this._isMounted) {
              this.timerStartTime = 0;
              this.setState(
                {
                  problem: newProblem,
                  elapsedSeconds: 0,
                  seconds: 0,
                  minutes: 0,
                  hideStats: true,
                  isRunning: false,
                  showDiffEditor: true,
                  strokes: 0,
                  isLoading: false,
                  error: null,
                },
                () => {
                  // Restart timer after state has been updated
                  this.updateCalculations();
                  this.startTimer();
                }
              );
            }
          } catch (error) {
            if (this._isMounted) {
              this.setState({
                isLoading: false,
                error:
                  error instanceof Error
                    ? error.message
                    : "Failed to load problem",
                showDiffEditor: true,
              });
            }
          }
        }, 50);
      }
    );
  };

  // Helper function to calculate bin index for histogram data
  // First bar (bin 0) covers 0 to bin_width/2, subsequent bars cover bin_width intervals
  calculateHistogramPosition = (value: number, binWidth: number): number => {
    // Calculate bin index using same formula as backend
    const halfWidth = binWidth / 2.0;
    let binIndex: number;

    if (value <= halfWidth) {
      binIndex = 0;
    } else {
      // For values > half_width, calculate bin index
      binIndex = Math.round((value - halfWidth) / binWidth) + 1;
    }

    // Return -1 if bin index is >= 25 (beyond max bars)
    if (binIndex >= 25) return -1;

    // Return bin index (0-indexed)
    return binIndex >= 0 ? binIndex : -1;
  };

  completeProblem = async () => {
    if (!this._isMounted || !this.state.problem) return;
    this.pauseTimer();

    // Calculate precise elapsed time including fractional seconds
    const preciseElapsedSeconds =
      this.timerStartTime > 0
        ? (Date.now() - this.timerStartTime) / 1000
        : this.state.elapsedSeconds;

    // Capture values for API submission before state updates
    const elapsedSeconds = preciseElapsedSeconds;
    const strokes = this.state.strokes;
    const ccpm = calculateSpeed(
      this.state.problem.currentText,
      this.state.problem.originalText,
      elapsedSeconds
    );

    // Update stats before showing completion page
    this.updateCalculations();

    // Submit attempt to API (always attempt if we have a problem ID)
    if (this.state.problem.id) {
      try {
        // Session ID will be automatically included in headers via getAuthHeaders() in api.ts
        // if user is signed in
        const response = await postRequest({
          endpoint: "/api/attempts",
          data: {
            problem_id: this.state.problem.id,
            time_seconds: elapsedSeconds,
            key_strokes: strokes,
            ccpm: ccpm,
          },
        });
        // Response can be null if user is not logged in (204 No Content)
        // Silently handle success - no need to show user
      } catch (error) {
        // Silently handle errors - don't interrupt the completion flow
        console.error("Failed to submit attempt:", error);
      }
    }

    // Use setTimeout to ensure state updates are applied before showing stats
    setTimeout(() => {
      if (this._isMounted) {
        this.setState({ hideStats: false });
      }
    }, 0);
  };

  resetProblem = () => {
    if (!this.state.problem) return;

    // Clear any existing timer first
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    // Hide and dispose DiffEditor before resetting
    this.setState({ showDiffEditor: false }, () => {
      // Dispose DiffEditor after hiding
      this.diffEditorManager.dispose();
      // Small delay to ensure disposal completes, then reset problem and show editor
      setTimeout(() => {
        const resetProblem = this.problemManager.resetProblem(
          this.state.problem!
        );
        this.timerStartTime = 0;
        this.setState(
          {
            problem: resetProblem,
            elapsedSeconds: 0,
            seconds: 0,
            minutes: 0,
            hideStats: true,
            isRunning: false,
            showDiffEditor: true,
            strokes: 0,
          },
          () => {
            // Restart timer after state has been updated
            this.updateCalculations();
            this.startTimer();
          }
        );
      }, 50);
    });
  };

  // Start the timer
  startTimer = () => {
    if (!this.state.isRunning && this._isMounted) {
      // Record start time for precise timing
      // Always start from current time (elapsedSeconds should be 0 when starting)
      this.timerStartTime = Date.now();

      this.timer = setInterval(() => {
        // Check if component is still mounted before updating state
        if (!this._isMounted) {
          if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
          }
          return;
        }

        // Calculate precise elapsed time from start time
        const preciseElapsedSeconds = (Date.now() - this.timerStartTime) / 1000;

        this.setState(
          (prevState) => {
            const newSeconds = Math.floor(preciseElapsedSeconds) % 60;
            const newMinutes = Math.floor(preciseElapsedSeconds / 60);

            return {
              seconds: newSeconds,
              minutes: newMinutes,
              elapsedSeconds: preciseElapsedSeconds,
            };
          },
          () => {
            // Update calculations after state update
            if (this.state.problem) {
              this.updateCalculations();

              // Check for completion
              if (
                this.problemManager.checkCompletion(
                  this.state.problem.currentText,
                  this.state.problem.modifiedText
                )
              ) {
                this.completeProblem();
              }
            }
          }
        );
      }, 100); // Update every 100ms for smooth fractional second display
      this.setState({ isRunning: true });
      this.monacoEditorManager.setRunning(true);
    }
  };

  // Update calculations (speed and completion)
  updateCalculations = () => {
    if (!this.state.problem) return;

    const speed = calculateSpeed(
      this.state.problem.currentText,
      this.state.problem.originalText,
      this.state.elapsedSeconds
    );
    const completion = calculateCompletion(
      this.state.problem.currentText,
      this.state.problem.originalText,
      this.state.problem.modifiedText
    );
    this.setState({
      wordsPerMin: speed,
      completionPerc: completion,
    });
  };

  // Reset the timer
  resetTimer = () => {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.timerStartTime = 0;
    this.setState({ seconds: 0, isRunning: false });
    this.monacoEditorManager.setRunning(false);
  };

  pauseTimer = () => {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.setState({ isRunning: false });
    this.monacoEditorManager.setRunning(false);
  };

  componentDidMount() {
    this._isMounted = true;
    // Fetch initial problem from API (this will set isLoading: true)
    this.loadProblem();

    // Add keyboard event listener for hotkeys
    window.addEventListener("keydown", this.handleKeyPress);
  }

  // Load a problem from the API
  loadProblem = async () => {
    this.setState({ isLoading: true, error: null });
    try {
      const problem = await this.problemManager.getRandomProblem();
      if (this._isMounted) {
        this.timerStartTime = 0;
        this.setState(
          {
            problem,
            isLoading: false,
            error: null,
            elapsedSeconds: 0,
            seconds: 0,
            minutes: 0,
            strokes: 0,
          },
          () => {
            // Calculate initial stats and start timer
            this.updateCalculations();
            this.startTimer();
          }
        );
      }
      this.resetProblem();
    } catch (error) {
      if (this._isMounted) {
        this.setState({
          isLoading: false,
          error:
            error instanceof Error ? error.message : "Failed to load problem",
        });
      }
    }
  };

  // Clear the timer interval when the component unmounts
  componentWillUnmount() {
    this._isMounted = false;
    // Clear timer
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    // Clear cooldown timer
    if (this.skipCooldownTimer) {
      clearTimeout(this.skipCooldownTimer);
      this.skipCooldownTimer = null;
    }
    // Clean up editors
    this.diffEditorManager.cleanup();
    this.monacoEditorManager.cleanup();
    // Remove keyboard event listener
    window.removeEventListener("keydown", this.handleKeyPress);
    // Reset timer start time (state will be reset when component re-mounts)
    this.timerStartTime = 0;
  }

  // Handle DiffEditor mount
  handleDiffEditorDidMount = (editor: any) => {
    this.diffEditorManager.handleDiffEditorDidMount(editor);
  };

  // Handle Monaco Editor mount
  handleMonacoEditorDidMount = (editor: any) => {
    this.monacoEditorManager.handleEditorDidMount(editor, () => {
      // Increment strokes counter
      this.setState((prevState) => ({
        strokes: prevState.strokes + 1,
      }));
    });
  };

  handleKeyPress = (event: KeyboardEvent) => {
    // Ctrl+R for reset (or Cmd+R on Mac)
    if ((event.ctrlKey || event.metaKey) && event.key === "r") {
      event.preventDefault();
      this.resetProblem();
    }
    // Ctrl+S for skip (or Cmd+S on Mac)
    if ((event.ctrlKey || event.metaKey) && event.key === "s") {
      event.preventDefault();
      // Only skip if not on cooldown and not loading
      if (!this.state.skipCooldown && !this.state.isLoading) {
        this.skipProblem();
      }
    }
  };

  handleChange = (value: string | undefined) => {
    if (!this.state.problem) return;

    const newText = value || "";
    this.setState(
      (prevState) => ({
        problem: prevState.problem
          ? { ...prevState.problem, currentText: newText }
          : null,
      }),
      () => {
        // Check for completion after state has been updated
        if (
          this.state.problem &&
          this.problemManager.checkCompletion(
            newText,
            this.state.problem.modifiedText
          )
        ) {
          this.completeProblem();
        }
      }
    );
  };

  public render() {
    // Show loading state
    if (this.state.isLoading) {
      return (
        <div className={`editor page`}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div style={{ fontSize: "18px", color: "#edf8ff" }}>
              Loading problem...
            </div>
          </div>
        </div>
      );
    }

    // Show error state
    if (this.state.error || !this.state.problem) {
      return (
        <div className={`editor page`}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                color: "#e57373",
                marginBottom: "1rem",
              }}
            >
              {this.state.error || "Failed to load problem"}
            </div>
            <button
              className="reset-button"
              onClick={this.loadProblem}
              style={{ marginTop: "1rem" }}
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className={`editor page`}>
        <div className={this.state.hideStats ? "hidden" : ""}>
          <Statistics
            problem={this.state.problem}
            userPositionTime={this.calculateHistogramPosition(
              this.state.elapsedSeconds,
              2.5 // Time bin width
            )}
            userPositionStrokes={this.calculateHistogramPosition(
              this.state.strokes,
              5.0 // Strokes bin width
            )}
            userPositionCCPM={this.calculateHistogramPosition(
              this.state.wordsPerMin,
              100.0 // CCPM bin width
            )}
            currentTime={this.state.elapsedSeconds}
            currentStrokes={this.state.strokes}
            currentCCPM={this.state.wordsPerMin}
            resetProblem={this.resetProblem}
            skipProblem={this.skipProblem}
            isLoggedIn={getSessionId() !== null}
          />
        </div>
        <div className="value-displays">
          <ValueDisplay
            viewable={`${this.state.minutes
              .toString()
              .padStart(2, "0")}:${this.state.seconds
              .toString()
              .padStart(2, "0")}`}
            value={this.state.elapsedSeconds}
            title="Time"
            colorMap={timerColorMap}
          />
          <ValueDisplay
            value={this.state.wordsPerMin}
            title="Speed"
            unit="CCPM"
            colorMap={speedColorMap}
          />
          <ValueDisplay
            value={this.state.completionPerc}
            title="Completion"
            unit="%"
            colorMap={completionColorMap}
          />
          <ValueDisplay
            value={this.state.strokes}
            title="Key Strokes"
            colorMap={strokesColorMap}
          />
        </div>
        <div className="editor-buttons">
          <button
            className="reset-button"
            onClick={() => {
              this.resetProblem();
            }}
            title="Reset (Ctrl+R)"
          >
            Reset
          </button>
          <button
            className="skip-button"
            onClick={() => {
              this.skipProblem();
            }}
            disabled={this.state.skipCooldown || this.state.isLoading}
            title={this.state.skipCooldown ? "Please wait..." : "Skip (Ctrl+S)"}
            style={{
              opacity:
                this.state.skipCooldown || this.state.isLoading ? 0.5 : 1,
              cursor:
                this.state.skipCooldown || this.state.isLoading
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            Skip
          </button>
        </div>
        <div className="form-container">
          <div className="form-editor">
            <div className="form monaco-editor-wrapper">
              <MonacoEditor
                height="80vh"
                language="typescript"
                theme="vs-dark"
                value={this.state.problem.currentText}
                onChange={this.handleChange}
                onMount={this.handleMonacoEditorDidMount}
                beforeMount={(monaco: any) => {
                  // Disable all diagnostics for all languages before editor mounts
                  this.monacoEditorManager.disableAllLanguageDiagnostics(
                    monaco
                  );
                }}
                options={{
                  minimap: { enabled: false },
                  fontSize: 18,
                  fontFamily: "Consolas, Monaco, 'Courier New', monospace",
                  lineHeight: 25.6,
                  padding: { top: 24, bottom: 24 },
                  wordWrap: "on",
                  automaticLayout: true,
                  tabSize: 2,
                  insertSpaces: true,
                  renderWhitespace: "all",
                  roundedSelection: false,
                  scrollbar: {
                    verticalScrollbarSize: 8,
                    horizontalScrollbarSize: 8,
                  },
                }}
              />
            </div>
          </div>
          <div className="form-diff">
            <div className="form monaco-editor-wrapper">
              {this._isMounted && this.state.showDiffEditor && (
                <DiffEditor
                  key={this.state.problem.problemId}
                  height="80vh"
                  language="typescript"
                  theme="vs-dark"
                  original={this.state.problem.currentText}
                  modified={this.state.problem.modifiedText}
                  onMount={this.handleDiffEditorDidMount}
                  beforeMount={(monaco: any) => {
                    // Disable all diagnostics before editor mounts
                    this.diffEditorManager.disableAllLanguageDiagnostics(
                      monaco
                    );
                  }}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 18,
                    fontFamily: "Consolas, Monaco, 'Courier New', monospace",
                    lineHeight: 25.6,
                    padding: { top: 24, bottom: 24 },
                    wordWrap: "on",
                    automaticLayout: true,
                    readOnly: true,
                    scrollbar: {
                      verticalScrollbarSize: 8,
                      horizontalScrollbarSize: 8,
                    },
                    renderSideBySide: true,
                    ignoreTrimWhitespace: false,
                    renderIndicators: true,
                    originalEditable: false,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Editor;
