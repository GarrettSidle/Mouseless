import { Component } from "react";

import "./Editor.css";
import ValueDisplay from "../../components/ValueDisplay/ValueDisplay";
import Statistics from "../../components/Statistics/Statistics";
import MonacoEditor, { DiffEditor } from "@monaco-editor/react";

// Import data and types
import {
  problems,
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

export class Editor extends Component<{}, EditorFormState> {
  private problemManager = new EditorProblemManager();
  private monacoEditorManager = new MonacoEditorManager();
  private diffEditorManager = new DiffEditorManager();
  private timer: NodeJS.Timeout | null = null;
  private _isMounted: boolean = true;

  constructor(props: {}) {
    super(props);
    this.state = {
      minutes: 0,
      seconds: 0,
      isRunning: false,
      elapsedSeconds: 0,
      problem: problems[0],
      wordsPerMin: 0,
      completionPerc: 0,
      hideStats: true,
      strokes: 0,
      showDiffEditor: true,
    };
    this.startTimer();
  }

  skipProblem = () => {
    // Clear any existing timer first
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    // Hide and dispose DiffEditor before changing problem
    this.setState({ showDiffEditor: false }, () => {
      // Dispose DiffEditor after hiding
      this.diffEditorManager.dispose();
      // Small delay to ensure disposal completes, then update problem and show editor
      setTimeout(() => {
        const newProblem = this.problemManager.getRandomProblem();
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

  completeProblem = () => {
    if (!this._isMounted) return;
    this.pauseTimer();
    // Update stats before showing completion page
    this.updateCalculations();
    // Use setTimeout to ensure state updates are applied before showing stats
    setTimeout(() => {
      if (this._isMounted) {
        this.setState({ hideStats: false });
      }
    }, 0);
  };

  resetProblem = () => {
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
          this.state.problem
        );
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
      this.timer = setInterval(() => {
        // Check if component is still mounted before updating state
        if (!this._isMounted) {
          if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
          }
          return;
        }

        this.setState(
          (prevState) => {
            const newSeconds = prevState.seconds + 1;
            const newMinutes =
              newSeconds >= 60 ? prevState.minutes + 1 : prevState.minutes;
            const finalSeconds = newSeconds >= 60 ? 0 : newSeconds;

            return {
              seconds: finalSeconds,
              minutes: newMinutes,
              elapsedSeconds: prevState.elapsedSeconds + 1,
            };
          },
          () => {
            // Update calculations after state update
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
        );
      }, 1000);
      this.setState({ isRunning: true });
      this.monacoEditorManager.setRunning(true);
    }
  };

  // Update calculations (speed and completion)
  updateCalculations = () => {
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
    // Calculate initial stats
    this.updateCalculations();
    // Ensure timer is running (in case it didn't start in constructor)
    if (!this.state.isRunning && !this.timer) {
      this.startTimer();
    }
    // Add keyboard event listener for hotkeys
    window.addEventListener("keydown", this.handleKeyPress);
  }

  // Clear the timer interval when the component unmounts
  componentWillUnmount() {
    this._isMounted = false;
    // Clear timer
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    // Clean up editors
    this.diffEditorManager.cleanup();
    this.monacoEditorManager.cleanup();
    // Remove keyboard event listener
    window.removeEventListener("keydown", this.handleKeyPress);
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
      this.skipProblem();
    }
  };

  handleChange = (value: string | undefined) => {
    const newText = value || "";
    this.setState(
      (prevState) => ({
        problem: { ...prevState.problem, currentText: newText },
      }),
      () => {
        // Check for completion after state has been updated
        if (
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
    return (
      <div className={`editor page`}>
        <div className={this.state.hideStats ? "hidden" : ""}>
          <Statistics
            problem={this.state.problem}
            userPositionTime={140}
            userPositionStrokes={5}
            userPositionCCPM={120}
            resetProblem={this.resetProblem}
            skipProblem={this.skipProblem}
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
            title="Skip (Ctrl+S)"
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
