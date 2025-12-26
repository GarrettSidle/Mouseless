import { Component } from "react";

import "./Editor.css";
import ValueDisplay from "../../components/ValueDisplay/ValueDisplay";
import ColorMap from "../../models/ColorMap";
import Problem from "../../models/Problem";
import * as Diff from "diff";
import Statistics from "../../components/Statistics/Statistics";
import MonacoEditor, { DiffEditor } from "@monaco-editor/react";
import { getRequest, postRequest } from "../../utils/api";
import { getSessionId } from "../../utils/cookies";

// Default empty problem for initial state
const defaultProblem: Problem = {
  originalText: "",
  modifiedText: "",
  currentText: "",
  problemId: "",
  problemStats: {
    timeStats: [],
    CCPMStats: [],
    keyStroksStats: [],
  },
};

// Interface for API response
interface ProblemResponse {
  id: number;
  name: string;
  original_text: string;
  modified_text: string;
  problem_id: string;
  best_time?: number | null;
  best_key_strokes?: number | null;
  best_ccpm?: number | null;
}

// Interface for attempt submission
interface AttemptRequest {
  problem_id: number;
  time_seconds: number;
  key_strokes: number;
  ccpm: number;
}

interface EditorFormState {
  isRunning: boolean;
  minutes: number;
  seconds: number;
  elapsedSeconds: number;
  problem: Problem;
  wordsPerMin: number;
  completionPerc: number;
  strokes: number;
  hideStats: boolean;
  showDiffEditor: boolean;
}

const timerColorMap: ColorMap = {
  upperCutoff: 30,
  centerCutoff: 15,
  isInverted: true,
};
const speedColorMap: ColorMap = {
  upperCutoff: 75,
  centerCutoff: 50,
  isInverted: false,
};
const completionColorMap: ColorMap = {
  upperCutoff: 75,
  centerCutoff: 50,
  isInverted: false,
};
const strokesColorMap: ColorMap = {
  upperCutoff: 30,
  centerCutoff: 15,
  isInverted: true,
};

export class Editor extends Component<{}, EditorFormState> {
  private currentProblemId: number | null = null; // Store the current problem ID from backend
  private editorKey: number = 0; // Counter to force editor remount when needed

  constructor(props: {}) {
    super(props);
    this.state = {
      minutes: 0,
      seconds: 0,
      isRunning: false, // Tracks if the timer is running
      elapsedSeconds: 0,
      problem: defaultProblem,
      wordsPerMin: 0,
      completionPerc: 0,
      hideStats: true,
      strokes: 0,
      showDiffEditor: true,
    };
  }

  private timer: NodeJS.Timeout | null = null; // Timer interval reference
  private _isMounted: boolean = true; // Track if component is mounted (start as true)
  private diffEditorRef: any = null; // Reference to DiffEditor instance
  private monacoEditorRef: any = null; // Reference to Monaco Editor instance
  private keystrokeDisposer: (() => void) | null = null; // Disposer for keystroke listener

  // Convert API response to Problem format
  private convertApiResponseToProblem(apiResponse: ProblemResponse): Problem {
    return {
      originalText: apiResponse.original_text,
      modifiedText: apiResponse.modified_text,
      currentText: apiResponse.original_text, // Start with original text
      problemId: apiResponse.problem_id,
      problemStats: {
        // TODO: These stats will need to come from backend in future
        // For now, using empty arrays to avoid errors
        timeStats: [],
        CCPMStats: [],
        keyStroksStats: [],
      },
    };
  }

  // Fetch a random problem from the backend
  private fetchRandomProblem = async () => {
    try {
      const response = await getRequest<ProblemResponse>({
        endpoint: "/api/problems/random",
      });
      this.currentProblemId = response.id;
      const problem = this.convertApiResponseToProblem(response);
      if (this._isMounted) {
        // Increment key to force editor remount with new problem
        this.editorKey += 1;
        this.diffEditorRef = null; // Clear ref for new editor instance
        this.setState({ problem }, () => {
          this.calculateSpeed();
          this.calculateCompletion();
        });
      }
    } catch (error) {
      console.error("Error fetching problem:", error);
      // Could show an error message to the user here
    }
  };

  // Submit attempt to backend (only if logged in)
  private submitAttempt = async () => {
    const sessionId = getSessionId();
    if (!sessionId || !this.currentProblemId) {
      // Not logged in or no problem loaded, skip submission
      return;
    }

    // Calculate CCPM directly to ensure we have the latest value
    let changedCharCount = 0;
    const diffResult = Diff.diffChars(
      this.state.problem.currentText,
      this.state.problem.originalText
    );
    for (let i = 0; i < diffResult.length; i++) {
      if (diffResult[i].added || diffResult[i].removed) {
        changedCharCount += diffResult[i]?.count ?? 0;
      }
    }
    const ccpm =
      this.state.elapsedSeconds > 0
        ? Math.round(changedCharCount / (this.state.elapsedSeconds / 60))
        : 0;

    try {
      const attemptData: AttemptRequest = {
        problem_id: this.currentProblemId,
        time_seconds: this.state.elapsedSeconds,
        key_strokes: this.state.strokes,
        ccpm: ccpm,
      };

      await postRequest<{ id: number }>({
        endpoint: "/api/attempts",
        data: attemptData as unknown as Record<string, unknown>,
      });
      console.log("Attempt submitted successfully");
    } catch (error) {
      console.error("Error submitting attempt:", error);
      // Don't show error to user, just log it
    }
  };

  skipProblem = async () => {
    // Clear any existing timer first
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    // Clear the editor ref and hide editor to allow clean unmount
    this.diffEditorRef = null;
    this.setState({ showDiffEditor: false }, async () => {
      // Wait for React to finish unmounting the editor
      await new Promise((resolve) => setTimeout(resolve, 100));
      // Reset state and fetch new problem
      this.setState(
        {
          elapsedSeconds: 0,
          seconds: 0,
          minutes: 0,
          hideStats: true,
          isRunning: false,
          strokes: 0,
          showDiffEditor: true,
        },
        async () => {
          // Fetch new problem from API
          await this.fetchRandomProblem();
          // Restart timer after problem is loaded
          this.startTimer();
        }
      );
    });
  };

  completeProblem() {
    if (!this._isMounted) return;
    this.pauseTimer();
    // Update stats before showing completion page
    this.calculateSpeed();
    this.calculateCompletion();
    // Submit attempt to backend (only if logged in)
    this.submitAttempt();
    // Use setTimeout to ensure state updates are applied before showing stats
    setTimeout(() => {
      if (this._isMounted) {
        this.setState({ hideStats: false });
      }
    }, 0);
  }

  resetProblem = () => {
    // Clear any existing timer first
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    // Clear the editor ref - React will handle remounting via key prop
    this.diffEditorRef = null;
    // Reset problem state
    // The key prop on DiffEditor will ensure React remounts it properly
    this.setState(
      (prevState) => ({
        problem: {
          ...prevState.problem,
          currentText: this.state.problem.originalText,
        },
        elapsedSeconds: 0,
        seconds: 0,
        minutes: 0,
        hideStats: true,
        isRunning: false,
        strokes: 0,
      }),
      () => {
        // Restart timer after state has been updated
        this.calculateSpeed();
        this.calculateCompletion();
        this.startTimer();
      }
    );
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

        this.setState((prevState) => ({
          seconds: prevState.seconds + 1,
          elapsedSeconds: prevState.elapsedSeconds + 1,
        }));
        if (this.state.seconds >= 60) {
          this.setState((prevState) => ({
            minutes: prevState.minutes + 1,
            seconds: 0,
          }));
        }

        this.calculateSpeed();
        this.calculateCompletion();

        // Compare normalized text (ignoring whitespace differences)
        const normalizedCurrent = this.normalizeWhitespace(
          this.state.problem.currentText
        );
        const normalizedTarget = this.normalizeWhitespace(
          this.state.problem.modifiedText
        );
        if (normalizedCurrent === normalizedTarget) {
          this.completeProblem();
        }
      }, 1000);
      this.setState({ isRunning: true });
    }
  };

  calculateSpeed() {
    let changedCharCount = 0;
    const diffResult = Diff.diffChars(
      this.state.problem.currentText,
      this.state.problem.originalText
    );

    // Loop through the diffResult array
    for (let i = 0; i < diffResult.length; i++) {
      // Check if the element is added or removed
      if (diffResult[i].added || diffResult[i].removed) {
        changedCharCount += diffResult[i]?.count ?? 0;
      }
    }

    var wordsPerMin = Math.round(
      changedCharCount / (this.state.elapsedSeconds / 60)
    );
    if (Number.isNaN(wordsPerMin)) {
      wordsPerMin = 0;
    }

    this.setState({ wordsPerMin: wordsPerMin });
  }
  // Helper function to normalize whitespace for comparison
  normalizeWhitespace = (text: string): string => {
    // Replace all whitespace characters (spaces, tabs, newlines) with a single space
    // Then trim the result
    return text.replace(/\s+/g, " ").trim();
  };

  calculateCompletion() {
    let charChangesRamaining = 0;
    let totalChanges = 0;
    console.log(
      this.state.problem.currentText,
      this.state.problem.modifiedText
    );
    var diffResult = Diff.diffChars(
      this.state.problem.currentText,
      this.state.problem.modifiedText
    );
    // Loop through the diffResult array
    for (let i = 0; i < diffResult.length; i++) {
      // Check if the element is added or removed
      if (diffResult[i].added || diffResult[i].removed) {
        charChangesRamaining += diffResult[i]?.count ?? 0;
      }
    }

    var diffResult = Diff.diffChars(
      this.state.problem.originalText,
      this.state.problem.modifiedText
    );
    // Loop through the diffResult array
    for (let i = 0; i < diffResult.length; i++) {
      // Check if the element is added or removed
      if (diffResult[i].added || diffResult[i].removed) {
        totalChanges += diffResult[i]?.count ?? 0;
      }
    }

    // Calculate completion percentage, ensuring it never goes below 0%
    const calculatedPerc =
      totalChanges > 0
        ? 100 - Math.round((charChangesRamaining / totalChanges) * 100)
        : 100;

    this.setState({
      completionPerc: Math.max(0, calculatedPerc),
    });
  }

  // Reset the timer
  resetTimer = () => {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.setState({ seconds: 0, isRunning: false });
  };
  pauseTimer = () => {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.setState({ isRunning: false });
  };

  componentDidMount() {
    this._isMounted = true;
    // Fetch initial problem from backend
    this.fetchRandomProblem().then(() => {
      // Start timer after problem is loaded
      if (!this.state.isRunning && !this.timer) {
        this.startTimer();
      }
    });
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
    // Dispose DiffEditor if it exists
    if (this.diffEditorRef) {
      try {
        this.diffEditorRef.dispose();
      } catch (error) {
        // Ignore disposal errors as editor may already be disposed
        console.warn("DiffEditor disposal warning:", error);
      }
      this.diffEditorRef = null;
    }
    // Clean up keystroke tracking
    if (this.keystrokeDisposer) {
      this.keystrokeDisposer();
      this.keystrokeDisposer = null;
    }
    // Remove keyboard event listener
    window.removeEventListener("keydown", this.handleKeyPress);
  }

  // Handle DiffEditor mount
  handleDiffEditorDidMount = (editor: any) => {
    this.diffEditorRef = editor;
    this.disableEditorDiagnostics(editor);
  };

  // Handle Monaco Editor mount
  handleMonacoEditorDidMount = (editor: any) => {
    this.monacoEditorRef = editor;
    this.disableEditorDiagnostics(editor);
    this.setupKeystrokeTracking(editor);
  };

  // Setup keystroke tracking for the editor
  setupKeystrokeTracking = (editor: any) => {
    // Clean up any existing listener
    if (this.keystrokeDisposer) {
      this.keystrokeDisposer();
      this.keystrokeDisposer = null;
    }

    // Get the editor's DOM element
    const editorDomNode = editor.getDomNode();
    if (!editorDomNode) return;

    // Create a handler for keydown events
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only count keystrokes when the timer is running
      if (!this.state.isRunning) {
        return;
      }

      // Check if the editor has focus (the event target should be within the editor)
      if (!editorDomNode.contains(event.target as Node)) {
        return;
      }

      // Skip modifier keys when pressed alone (Ctrl, Alt, Shift, Meta)
      // These should only count when combined with another key
      const isModifierKey =
        event.key === "Control" ||
        event.key === "Alt" ||
        event.key === "Shift" ||
        event.key === "Meta" ||
        event.key === "OS";

      // If it's a modifier key alone (no other key being pressed), don't count it
      // When you press Ctrl+X, the event for X will have ctrlKey=true, but key will be "x", not "Control"
      // So we skip events where the key itself is a modifier key
      if (isModifierKey) {
        return;
      }

      // Increment strokes counter for all other key presses
      // This includes regular keys, and key combinations (like Ctrl+X counts as 1 stroke)
      this.setState((prevState) => ({
        strokes: prevState.strokes + 1,
      }));
    };

    // Add event listener to the editor's DOM node
    editorDomNode.addEventListener("keydown", handleKeyDown);

    // Store disposer function
    this.keystrokeDisposer = () => {
      editorDomNode.removeEventListener("keydown", handleKeyDown);
    };
  };

  // Disable all diagnostics/validation in Monaco Editor for all languages
  disableAllLanguageDiagnostics = (monaco: any) => {
    if (!monaco || !monaco.languages) return;

    try {
      // Disable TypeScript/JavaScript diagnostics (these have full support)
      if (monaco.languages.typescript) {
        const tsDefaults = (monaco.languages.typescript as any)
          .typescriptDefaults;
        const jsDefaults = (monaco.languages.typescript as any)
          .javascriptDefaults;

        if (tsDefaults) {
          tsDefaults.setDiagnosticsOptions({
            noSemanticValidation: true,
            noSyntaxValidation: true,
            noSuggestionDiagnostics: true,
          });
        }

        if (jsDefaults) {
          jsDefaults.setDiagnosticsOptions({
            noSemanticValidation: true,
            noSyntaxValidation: true,
            noSuggestionDiagnostics: true,
          });
        }
      }

      // Set up a global marker filter to hide all validation markers
      // This works for all languages, not just TypeScript/JavaScript
      if (monaco.editor && monaco.editor.setModelMarkers) {
        // Store original function if not already stored
        if (!(monaco.editor as any)._originalSetModelMarkers) {
          (monaco.editor as any)._originalSetModelMarkers =
            monaco.editor.setModelMarkers;

          // Override setModelMarkers to filter out validation markers
          monaco.editor.setModelMarkers = function (
            model: any,
            owner: string,
            markers: any[]
          ) {
            // Filter out all validation-related markers
            const filteredMarkers = markers.filter((marker: any) => {
              // Block all validation/diagnostic markers
              const isValidationMarker =
                owner === "typescript" ||
                owner === "javascript" ||
                owner === "eslint" ||
                owner === "tslint" ||
                (marker.source &&
                  (marker.source.includes("validation") ||
                    marker.source.includes("diagnostic") ||
                    marker.source.includes("semantic") ||
                    marker.source.includes("syntax")));

              return !isValidationMarker;
            });

            // Call original function with filtered markers
            return (monaco.editor as any)._originalSetModelMarkers.call(
              this,
              model,
              owner,
              filteredMarkers
            );
          };
        }
      }
    } catch (error) {
      // Ignore errors
    }
  };

  // Disable all diagnostics/validation in Monaco Editor
  disableEditorDiagnostics = (editor: any) => {
    if (!editor) return;

    try {
      // Get Monaco instance
      const monaco = (window as any).monaco;
      if (!monaco) return;

      // Disable diagnostics for all languages
      this.disableAllLanguageDiagnostics(monaco);

      // Also disable model markers (squiggly lines) for the current editor
      const model = editor.getModel();
      if (model && monaco.editor) {
        monaco.editor.setModelMarkers(model, "owner", []);
      }
    } catch (error) {
      // Ignore errors if Monaco API is not available
      console.warn("Could not disable diagnostics:", error);
    }
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
        const normalizedCurrent = this.normalizeWhitespace(newText);
        const normalizedTarget = this.normalizeWhitespace(
          this.state.problem.modifiedText
        );
        if (normalizedCurrent === normalizedTarget) {
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
                  this.disableAllLanguageDiagnostics(monaco);
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
                  key={`editor-${this.editorKey}-${this.state.problem.problemId}`}
                  height="80vh"
                  language="typescript"
                  theme="vs-dark"
                  original={this.state.problem.currentText}
                  modified={this.state.problem.modifiedText}
                  onMount={this.handleDiffEditorDidMount}
                  beforeMount={(monaco: any) => {
                    // Disable all diagnostics before editor mounts
                    try {
                      const tsDefaults =
                        monaco.languages?.typescript?.typescriptDefaults;
                      const jsDefaults =
                        monaco.languages?.typescript?.javascriptDefaults;

                      if (tsDefaults) {
                        tsDefaults.setDiagnosticsOptions({
                          noSemanticValidation: true,
                          noSyntaxValidation: true,
                          noSuggestionDiagnostics: true,
                        });
                      }

                      if (jsDefaults) {
                        jsDefaults.setDiagnosticsOptions({
                          noSemanticValidation: true,
                          noSyntaxValidation: true,
                          noSuggestionDiagnostics: true,
                        });
                      }
                    } catch (error) {
                      // Ignore errors
                    }
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
