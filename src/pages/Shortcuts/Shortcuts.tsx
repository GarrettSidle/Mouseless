import { Component } from "react";
import "./Shortcuts.css";
import shortcutsData from "../../data/shortcuts.json";
import MonacoEditor from "@monaco-editor/react";

interface AnimationStep {
  code: string;
  cursorPosition?: { lineNumber: number; column: number };
  selection?: {
    startLineNumber: number;
    startColumn: number;
    endLineNumber: number;
    endColumn: number;
  };
  delay: number;
}

interface Shortcut {
  id: string;
  name: string;
  keys: string[];
  description: string;
  category: string;
  hasDemo: boolean;
  still: string;
  gif: string;
  initialCode?: string;
  animationSteps?: AnimationStep[];
}

interface ShortcutsState {
  hoveredShortcut: string | null;
  activeShortcut: string | null;
  isAnimating: boolean;
  animationStep: number;
}

export class Shortcuts extends Component<{}, ShortcutsState> {
  private animationTimeouts: NodeJS.Timeout[] = [];
  private editorRefs: { [key: string]: any } = {};
  private resetTimeouts: { [key: string]: NodeJS.Timeout } = {};
  private videoRefs: { [key: string]: HTMLVideoElement | null } = {};
  private videoLoopTimeouts: { [key: string]: NodeJS.Timeout } = {};

  constructor(props: {}) {
    super(props);
    this.state = {
      hoveredShortcut: null,
      activeShortcut: null,
      isAnimating: false,
      animationStep: 0,
    };
  }

  componentWillUnmount() {
    this.animationTimeouts.forEach((timeout) => clearTimeout(timeout));
    Object.values(this.resetTimeouts).forEach((timeout) =>
      clearTimeout(timeout)
    );
    Object.values(this.videoLoopTimeouts).forEach((timeout) =>
      clearTimeout(timeout)
    );
    // Pause all videos
    Object.values(this.videoRefs).forEach((video) => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });
  }

  handleMouseEnter = (shortcut: Shortcut) => {
    this.setState({ hoveredShortcut: shortcut.id });

    // If shortcut has a demo, start it
    if (shortcut.hasDemo && shortcut.animationSteps) {
      this.startAnimation(shortcut);
    } else {
      // If it's a video, start playing it
      this.playVideo(shortcut.id);
    }
  };

  handleMouseLeave = () => {
    this.setState({ hoveredShortcut: null });
    this.stopAnimation();

    // Stop all videos
    Object.keys(this.videoRefs).forEach((shortcutId) => {
      this.stopVideo(shortcutId);
    });

    // Reset all editors to their initial state
    const shortcuts = shortcutsData as Shortcut[];
    Object.keys(this.editorRefs).forEach((shortcutId) => {
      const editor = this.editorRefs[shortcutId];
      if (editor) {
        const shortcut = shortcuts.find((s) => s.id === shortcutId);
        if (shortcut && shortcut.initialCode) {
          editor.setValue(shortcut.initialCode);
          editor.setPosition({ lineNumber: 1, column: 1 });
          editor.setSelection({
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: 1,
            endColumn: 1,
          });
        }
      }
    });
  };

  handleEditorDidMount = (editor: any, shortcutId: string) => {
    this.editorRefs[shortcutId] = editor;

    // Disable diagnostics
    const model = editor.getModel();
    if (model) {
      const monaco = (window as any).monaco;
      if (monaco && monaco.editor) {
        monaco.editor.setModelMarkers(model, "owner", []);
      }
    }
  };

  startAnimation = (shortcut: Shortcut) => {
    if (!shortcut.animationSteps || !shortcut.initialCode) return;

    if (this.state.isAnimating && this.state.activeShortcut === shortcut.id) {
      return;
    }

    // Clear any existing timeouts
    this.animationTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.animationTimeouts = [];

    // Clear any existing reset timeout for this shortcut
    if (this.resetTimeouts[shortcut.id]) {
      clearTimeout(this.resetTimeouts[shortcut.id]);
      delete this.resetTimeouts[shortcut.id];
    }

    this.setState({
      activeShortcut: shortcut.id,
      animationStep: 0,
      isAnimating: true,
    });

    // Small delay to ensure editor is ready
    const initTimeout = setTimeout(() => {
      const editor = this.editorRefs[shortcut.id];
      if (!editor) {
        this.setState({ isAnimating: false });
        return;
      }

      // Reset to initial code
      editor.setValue(shortcut.initialCode);
      editor.setPosition({ lineNumber: 1, column: 1 });
      editor.setSelection({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 1,
      });

      let currentDelay = 0;
      const steps = shortcut.animationSteps || [];
      steps.forEach((step, index) => {
        const timeout = setTimeout(() => {
          if (step.code !== undefined) {
            editor.setValue(step.code);
          }

          if (step.cursorPosition) {
            editor.setPosition(step.cursorPosition);
            editor.revealLineInCenter(step.cursorPosition.lineNumber);
          }

          if (step.selection) {
            editor.setSelection(step.selection);
            editor.revealRangeInCenter({
              startLineNumber: step.selection.startLineNumber,
              startColumn: step.selection.startColumn,
              endLineNumber: step.selection.endLineNumber,
              endColumn: step.selection.endColumn,
            });
          }

          if (index === steps.length - 1) {
            // Animation completed, reset after 3 seconds
            const resetTimeout = setTimeout(() => {
              if (this.state.activeShortcut === shortcut.id) {
                editor.setValue(shortcut.initialCode!);
                editor.setPosition({ lineNumber: 1, column: 1 });
                editor.setSelection({
                  startLineNumber: 1,
                  startColumn: 1,
                  endLineNumber: 1,
                  endColumn: 1,
                });
                // Restart animation
                setTimeout(() => {
                  if (this.state.hoveredShortcut === shortcut.id) {
                    this.startAnimation(shortcut);
                  }
                }, 500);
              }
            }, 3000);

            this.resetTimeouts[shortcut.id] = resetTimeout;

            setTimeout(() => {
              this.setState({ isAnimating: false });
            }, 500);
          }
        }, currentDelay);

        this.animationTimeouts.push(timeout);
        currentDelay += step.delay;
      });
    }, 100);

    this.animationTimeouts.push(initTimeout);
  };

  stopAnimation = () => {
    this.animationTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.animationTimeouts = [];
    Object.values(this.resetTimeouts).forEach((timeout) =>
      clearTimeout(timeout)
    );
    this.resetTimeouts = {};
    this.setState({ isAnimating: false, activeShortcut: null });
  };

  renderKeyBadge = (key: string) => {
    return (
      <span key={key} className="key-badge">
        {key}
      </span>
    );
  };

  getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      Navigation: "#4A9EFF",
      Search: "#FF6B6B",
      Editing: "#51CF66",
      Selection: "#FFD93D",
      Formatting: "#A78BFA",
      Refactoring: "#F472B6",
      View: "#60A5FA",
    };
    return colors[category] || "#94A3B8";
  };

  getVideoPath = (shortcutId: string): string => {
    // Map shortcut IDs to MP4 filenames
    const videoMap: { [key: string]: string } = {
      "goto-line": "GoToLine.mp4",
      find: "Find.mp4",
      replace: "Replace.mp4",
      multicursor: "AddCursor.mp4",
      "goto-symbol": "GoToSymbol.mp4",
      undo: "Undo.mp4",
      redo: "Redo.mp4",
      "line-start": "LineStart.mp4",
      "line-end": "LineEnd.mp4",
      "move-by-word": "MoveByWord.mp4",
      "top-of-file": "TopOfFile.mp4",
      "bottom-of-file": "BottomOfFile.mp4",
      "go-to-definition": "GoToDefinition.mp4",
      "peek-definition": "PeekDefinition.mp4",
      rename: "RenameSymbol.mp4",
    };
    const filename = videoMap[shortcutId] || "temp.gif";
    return `/Shortcut_demos/${filename}`;
  };

  handleVideoRef = (shortcutId: string, video: HTMLVideoElement | null) => {
    this.videoRefs[shortcutId] = video;
    if (video) {
      // Set up event listener for when video ends
      video.addEventListener("ended", () => {
        if (this.state.hoveredShortcut === shortcutId) {
          // Wait 0.25 seconds then play again
          const timeout = setTimeout(() => {
            if (this.state.hoveredShortcut === shortcutId && video) {
              video.currentTime = 0;
              video.play();
            }
          }, 250);
          this.videoLoopTimeouts[shortcutId] = timeout;
        }
      });
    }
  };

  playVideo = (shortcutId: string) => {
    const video = this.videoRefs[shortcutId];
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {
        // Ignore play errors
      });
    }
  };

  stopVideo = (shortcutId: string) => {
    const video = this.videoRefs[shortcutId];
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    // Clear any pending loop timeout
    if (this.videoLoopTimeouts[shortcutId]) {
      clearTimeout(this.videoLoopTimeouts[shortcutId]);
      delete this.videoLoopTimeouts[shortcutId];
    }
  };

  render() {
    const shortcuts = shortcutsData as Shortcut[];
    const categories = Array.from(new Set(shortcuts.map((s) => s.category)));

    return (
      <div className="shortcuts-page">
        <div className="shortcuts-header">
          <h1>Keyboard Shortcuts</h1>
          <p className="subtitle">
            Master these VSCode shortcuts to code efficiently without a mouse
          </p>
        </div>

        <div className="shortcuts-container">
          {categories.map((category) => (
            <div key={category} className="shortcuts-category">
              <h2
                className="category-title"
                style={
                  {
                    "--category-color": this.getCategoryColor(category),
                  } as React.CSSProperties
                }
              >
                {category}
              </h2>
              <div className="shortcuts-grid">
                {shortcuts
                  .filter((s) => s.category === category)
                  .map((shortcut) => (
                    <div
                      key={shortcut.id}
                      className="shortcut-card"
                      onMouseEnter={() => this.handleMouseEnter(shortcut)}
                      onMouseLeave={this.handleMouseLeave}
                    >
                      <div className="shortcut-header">
                        <div className="shortcut-info">
                          <h3 className="shortcut-name">{shortcut.name}</h3>
                          <p className="shortcut-description">
                            {shortcut.description}
                          </p>
                        </div>
                        <div className="shortcut-keys">
                          {shortcut.keys.map((key, index) => (
                            <span key={index}>
                              {this.renderKeyBadge(key)}
                              {index < shortcut.keys.length - 1 && (
                                <span className="key-separator">+</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="shortcut-demo">
                        {shortcut.hasDemo ? (
                          <div className="editor-container">
                            <MonacoEditor
                              height="200px"
                              language="typescript"
                              theme="vs-dark"
                              value={shortcut.initialCode || ""}
                              onMount={(editor) =>
                                this.handleEditorDidMount(editor, shortcut.id)
                              }
                              beforeMount={(monaco) => {
                                try {
                                  const tsDefaults = (
                                    monaco.languages.typescript as any
                                  ).typescriptDefaults;
                                  if (tsDefaults) {
                                    tsDefaults.setDiagnosticsOptions({
                                      noSemanticValidation: true,
                                      noSyntaxValidation: true,
                                      noSuggestionDiagnostics: true,
                                    });
                                  }
                                } catch (e) {
                                  // Ignore
                                }
                              }}
                              options={{
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                fontSize: 14,
                                fontFamily:
                                  "Consolas, Monaco, 'Courier New', monospace",
                                lineHeight: 20,
                                padding: { top: 12, bottom: 12 },
                                wordWrap: "on",
                                automaticLayout: true,
                                tabSize: 2,
                                insertSpaces: true,
                                readOnly: true,
                                renderWhitespace: "boundary",
                                roundedSelection: false,
                                scrollbar: {
                                  verticalScrollbarSize: 6,
                                  horizontalScrollbarSize: 6,
                                },
                                renderValidationDecorations: "off",
                                quickSuggestions: false,
                                parameterHints: { enabled: false },
                                suggestOnTriggerCharacters: false,
                                acceptSuggestionOnEnter: "off",
                                tabCompletion: "off",
                                wordBasedSuggestions: "off",
                              }}
                            />
                          </div>
                        ) : (
                          <div className="gif-container">
                            <video
                              ref={(video) =>
                                this.handleVideoRef(shortcut.id, video)
                              }
                              src={this.getVideoPath(shortcut.id)}
                              className="shortcut-video"
                              preload="metadata"
                              muted
                              playsInline
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Shortcuts;
