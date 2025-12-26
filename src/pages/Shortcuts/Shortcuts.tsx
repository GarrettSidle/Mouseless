import { Component } from "react";
import "./Shortcuts.css";
import MonacoEditor from "@monaco-editor/react";

interface Shortcut {
  id: string;
  name: string;
  keys: string[];
  description: string;
  category: string;
  initialCode: string;
  finalCode: string;
  animationSteps: AnimationStep[];
}

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

interface ShortcutsState {
  activeShortcut: string | null;
  animationStep: number;
  isAnimating: boolean;
}

const shortcuts: Shortcut[] = [
  {
    id: "goto-line",
    name: "Go to Line",
    keys: ["Ctrl", "G"],
    description: "Jump to a specific line number",
    category: "Navigation",
    initialCode:
      "function example() {\n  const x = 1;\n  const y = 2;\n  const z = 3;\n  return x + y + z;\n}",
    finalCode:
      "function example() {\n  const x = 1;\n  const y = 2;\n  const z = 3;\n  return x + y + z;\n}",
    animationSteps: [
      {
        code: "function example() {\n  const x = 1;\n  const y = 2;\n  const z = 3;\n  return x + y + z;\n}",
        cursorPosition: { lineNumber: 1, column: 1 },
        delay: 500,
      },
      {
        code: "function example() {\n  const x = 1;\n  const y = 2;\n  const z = 3;\n  return x + y + z;\n}",
        cursorPosition: { lineNumber: 3, column: 1 },
        delay: 1000,
      },
    ],
  },
  {
    id: "find",
    name: "Find",
    keys: ["Ctrl", "F"],
    description: "Search for text in the current file",
    category: "Search",
    initialCode:
      "const user = {\n  name: 'John',\n  age: 30,\n  name: 'Jane'\n};",
    finalCode:
      "const user = {\n  name: 'John',\n  age: 30,\n  name: 'Jane'\n};",
    animationSteps: [
      {
        code: "const user = {\n  name: 'John',\n  age: 30,\n  name: 'Jane'\n};",
        cursorPosition: { lineNumber: 1, column: 1 },
        delay: 500,
      },
      {
        code: "const user = {\n  name: 'John',\n  age: 30,\n  name: 'Jane'\n};",
        selection: {
          startLineNumber: 2,
          startColumn: 3,
          endLineNumber: 2,
          endColumn: 7,
        },
        delay: 1000,
      },
      {
        code: "const user = {\n  name: 'John',\n  age: 30,\n  name: 'Jane'\n};",
        selection: {
          startLineNumber: 4,
          startColumn: 3,
          endLineNumber: 4,
          endColumn: 7,
        },
        delay: 1500,
      },
    ],
  },
  {
    id: "replace",
    name: "Find and Replace",
    keys: ["Ctrl", "H"],
    description: "Find and replace text in the current file",
    category: "Search",
    initialCode:
      "function calculate() {\n  let sum = 0;\n  let sum = 5;\n  return sum;\n}",
    finalCode:
      "function calculate() {\n  let total = 0;\n  let total = 5;\n  return total;\n}",
    animationSteps: [
      {
        code: "function calculate() {\n  let sum = 0;\n  let sum = 5;\n  return sum;\n}",
        cursorPosition: { lineNumber: 1, column: 1 },
        delay: 500,
      },
      {
        code: "function calculate() {\n  let total = 0;\n  let sum = 5;\n  return sum;\n}",
        cursorPosition: { lineNumber: 2, column: 10 },
        delay: 1000,
      },
      {
        code: "function calculate() {\n  let total = 0;\n  let total = 5;\n  return sum;\n}",
        cursorPosition: { lineNumber: 3, column: 10 },
        delay: 1500,
      },
      {
        code: "function calculate() {\n  let total = 0;\n  let total = 5;\n  return total;\n}",
        cursorPosition: { lineNumber: 4, column: 10 },
        delay: 2000,
      },
    ],
  },
  {
    id: "multicursor",
    name: "Add Cursor",
    keys: ["Alt", "Click"],
    description: "Add multiple cursors (Alt+Click or Ctrl+Alt+Up/Down)",
    category: "Editing",
    initialCode: "const items = [\n  'apple',\n  'banana',\n  'cherry'\n];",
    finalCode: "const items = [\n  'apple',\n  'banana',\n  'cherry'\n];",
    animationSteps: [
      {
        code: "const items = [\n  'apple',\n  'banana',\n  'cherry'\n];",
        cursorPosition: { lineNumber: 2, column: 3 },
        delay: 500,
      },
      {
        code: "const items = [\n  'apple',\n  'banana',\n  'cherry'\n];",
        cursorPosition: { lineNumber: 2, column: 3 },
        delay: 1000,
      },
    ],
  },
  {
    id: "select-line",
    name: "Select Line",
    keys: ["Ctrl", "L"],
    description: "Select the entire current line",
    category: "Selection",
    initialCode: "function test() {\n  const value = 42;\n  return value;\n}",
    finalCode: "function test() {\n  const value = 42;\n  return value;\n}",
    animationSteps: [
      {
        code: "function test() {\n  const value = 42;\n  return value;\n}",
        cursorPosition: { lineNumber: 2, column: 10 },
        delay: 500,
      },
      {
        code: "function test() {\n  const value = 42;\n  return value;\n}",
        selection: {
          startLineNumber: 2,
          startColumn: 1,
          endLineNumber: 2,
          endColumn: 20,
        },
        delay: 1000,
      },
    ],
  },
  {
    id: "duplicate-line",
    name: "Duplicate Line",
    keys: ["Shift", "Alt", "Down"],
    description: "Duplicate the current line below",
    category: "Editing",
    initialCode: "function example() {\n  const x = 10;\n  return x;\n}",
    finalCode:
      "function example() {\n  const x = 10;\n  const x = 10;\n  return x;\n}",
    animationSteps: [
      {
        code: "function example() {\n  const x = 10;\n  return x;\n}",
        cursorPosition: { lineNumber: 2, column: 1 },
        delay: 500,
      },
      {
        code: "function example() {\n  const x = 10;\n  const x = 10;\n  return x;\n}",
        cursorPosition: { lineNumber: 3, column: 1 },
        delay: 1500,
      },
    ],
  },
  {
    id: "move-line",
    name: "Move Line",
    keys: ["Alt", "Up/Down"],
    description: "Move the current line up or down",
    category: "Editing",
    initialCode: "const a = 1;\nconst b = 2;\nconst c = 3;",
    finalCode: "const b = 2;\nconst a = 1;\nconst c = 3;",
    animationSteps: [
      {
        code: "const a = 1;\nconst b = 2;\nconst c = 3;",
        cursorPosition: { lineNumber: 1, column: 1 },
        delay: 500,
      },
      {
        code: "const b = 2;\nconst a = 1;\nconst c = 3;",
        cursorPosition: { lineNumber: 2, column: 1 },
        delay: 1500,
      },
    ],
  },
  {
    id: "delete-line",
    name: "Delete Line",
    keys: ["Ctrl", "Shift", "K"],
    description: "Delete the entire current line",
    category: "Editing",
    initialCode:
      "function test() {\n  const temp = 5;\n  const result = 10;\n  return result;\n}",
    finalCode: "function test() {\n  const result = 10;\n  return result;\n}",
    animationSteps: [
      {
        code: "function test() {\n  const temp = 5;\n  const result = 10;\n  return result;\n}",
        cursorPosition: { lineNumber: 2, column: 1 },
        delay: 500,
      },
      {
        code: "function test() {\n  const result = 10;\n  return result;\n}",
        cursorPosition: { lineNumber: 2, column: 1 },
        delay: 1500,
      },
    ],
  },
  {
    id: "comment",
    name: "Toggle Comment",
    keys: ["Ctrl", "/"],
    description: "Comment or uncomment the current line/selection",
    category: "Editing",
    initialCode:
      "function example() {\n  const x = 1;\n  const y = 2;\n  return x + y;\n}",
    finalCode:
      "function example() {\n  // const x = 1;\n  const y = 2;\n  return x + y;\n}",
    animationSteps: [
      {
        code: "function example() {\n  const x = 1;\n  const y = 2;\n  return x + y;\n}",
        cursorPosition: { lineNumber: 2, column: 1 },
        delay: 500,
      },
      {
        code: "function example() {\n  // const x = 1;\n  const y = 2;\n  return x + y;\n}",
        cursorPosition: { lineNumber: 2, column: 1 },
        delay: 1500,
      },
    ],
  },
  {
    id: "format",
    name: "Format Document",
    keys: ["Shift", "Alt", "F"],
    description: "Format the entire document",
    category: "Formatting",
    initialCode: "function test(){const x=1;const y=2;return x+y;}",
    finalCode:
      "function test() {\n  const x = 1;\n  const y = 2;\n  return x + y;\n}",
    animationSteps: [
      {
        code: "function test(){const x=1;const y=2;return x+y;}",
        cursorPosition: { lineNumber: 1, column: 1 },
        delay: 500,
      },
      {
        code: "function test() {\n  const x = 1;\n  const y = 2;\n  return x + y;\n}",
        cursorPosition: { lineNumber: 1, column: 1 },
        delay: 1500,
      },
    ],
  },
  {
    id: "goto-symbol",
    name: "Go to Symbol",
    keys: ["Ctrl", "Shift", "O"],
    description: "Navigate to a symbol (function, class, etc.) in the file",
    category: "Navigation",
    initialCode:
      "function first() {}\nfunction second() {}\nfunction third() {}",
    finalCode: "function first() {}\nfunction second() {}\nfunction third() {}",
    animationSteps: [
      {
        code: "function first() {}\nfunction second() {}\nfunction third() {}",
        cursorPosition: { lineNumber: 1, column: 1 },
        delay: 500,
      },
      {
        code: "function first() {}\nfunction second() {}\nfunction third() {}",
        cursorPosition: { lineNumber: 3, column: 1 },
        delay: 1500,
      },
    ],
  },
  {
    id: "rename",
    name: "Rename Symbol",
    keys: ["F2"],
    description: "Rename a symbol and all its references",
    category: "Refactoring",
    initialCode:
      "function calculate() {\n  const value = 10;\n  return value + value;\n}",
    finalCode:
      "function calculate() {\n  const total = 10;\n  return total + total;\n}",
    animationSteps: [
      {
        code: "function calculate() {\n  const value = 10;\n  return value + value;\n}",
        cursorPosition: { lineNumber: 2, column: 9 },
        delay: 500,
      },
      {
        code: "function calculate() {\n  const total = 10;\n  return total + total;\n}",
        cursorPosition: { lineNumber: 2, column: 9 },
        delay: 1500,
      },
    ],
  },
  {
    id: "indent",
    name: "Indent/Outdent",
    keys: ["Tab", "/", "Shift+Tab"],
    description: "Indent or outdent the current line/selection",
    category: "Formatting",
    initialCode: "function test() {\nconst x = 1;\nreturn x;\n}",
    finalCode: "function test() {\n  const x = 1;\n  return x;\n}",
    animationSteps: [
      {
        code: "function test() {\nconst x = 1;\nreturn x;\n}",
        cursorPosition: { lineNumber: 2, column: 1 },
        delay: 500,
      },
      {
        code: "function test() {\n  const x = 1;\n  return x;\n}",
        cursorPosition: { lineNumber: 2, column: 3 },
        delay: 1500,
      },
    ],
  },
  {
    id: "select-all-occurrences",
    name: "Select All Occurrences",
    keys: ["Ctrl", "Shift", "L"],
    description: "Select all occurrences of the current word",
    category: "Selection",
    initialCode: "const value = 1;\nconst value = 2;\nconst value = 3;",
    finalCode: "const value = 1;\nconst value = 2;\nconst value = 3;",
    animationSteps: [
      {
        code: "const value = 1;\nconst value = 2;\nconst value = 3;",
        cursorPosition: { lineNumber: 1, column: 7 },
        delay: 500,
      },
      {
        code: "const value = 1;\nconst value = 2;\nconst value = 3;",
        selection: {
          startLineNumber: 1,
          startColumn: 7,
          endLineNumber: 1,
          endColumn: 12,
        },
        delay: 1000,
      },
      {
        code: "const value = 1;\nconst value = 2;\nconst value = 3;",
        selection: {
          startLineNumber: 1,
          startColumn: 7,
          endLineNumber: 3,
          endColumn: 12,
        },
        delay: 1500,
      },
    ],
  },
  {
    id: "toggle-word-wrap",
    name: "Toggle Word Wrap",
    keys: ["Alt", "Z"],
    description: "Toggle word wrap on/off",
    category: "View",
    initialCode:
      "const veryLongLine = 'This is a very long line that might wrap when word wrap is enabled';",
    finalCode:
      "const veryLongLine = 'This is a very long line that might wrap when word wrap is enabled';",
    animationSteps: [
      {
        code: "const veryLongLine = 'This is a very long line that might wrap when word wrap is enabled';",
        cursorPosition: { lineNumber: 1, column: 1 },
        delay: 500,
      },
      {
        code: "const veryLongLine = 'This is a very long line that might wrap when word wrap is enabled';",
        cursorPosition: { lineNumber: 1, column: 1 },
        delay: 1500,
      },
    ],
  },
  {
    id: "split-editor",
    name: "Split Editor",
    keys: ["Ctrl", "\\"],
    description: "Split the editor into multiple panes",
    category: "View",
    initialCode:
      "// Left pane\nconst left = 'code';\n\n// Right pane\nconst right = 'code';",
    finalCode:
      "// Left pane\nconst left = 'code';\n\n// Right pane\nconst right = 'code';",
    animationSteps: [
      {
        code: "// Left pane\nconst left = 'code';\n\n// Right pane\nconst right = 'code';",
        cursorPosition: { lineNumber: 1, column: 1 },
        delay: 500,
      },
      {
        code: "// Left pane\nconst left = 'code';\n\n// Right pane\nconst right = 'code';",
        cursorPosition: { lineNumber: 1, column: 1 },
        delay: 1500,
      },
    ],
  },
];

export class Shortcuts extends Component<{}, ShortcutsState> {
  private animationTimeouts: NodeJS.Timeout[] = [];
  private editorRefs: { [key: string]: any } = {};

  constructor(props: {}) {
    super(props);
    this.state = {
      activeShortcut: null,
      animationStep: 0,
      isAnimating: false,
    };
  }

  componentWillUnmount() {
    this.animationTimeouts.forEach((timeout) => clearTimeout(timeout));
  }

  handleEditorDidMount = (editor: any, shortcutId: string) => {
    this.editorRefs[shortcutId] = editor;
  };

  startAnimation = (shortcut: Shortcut) => {
    if (this.state.isAnimating && this.state.activeShortcut === shortcut.id) {
      return;
    }

    // Clear any existing timeouts
    this.animationTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.animationTimeouts = [];

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
      shortcut.animationSteps.forEach((step, index) => {
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

          if (index === shortcut.animationSteps.length - 1) {
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

  render() {
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
                      className={`shortcut-card ${
                        this.state.activeShortcut === shortcut.id
                          ? "active"
                          : ""
                      }`}
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
                        <button
                          className="demo-button"
                          onClick={() => this.startAnimation(shortcut)}
                          disabled={
                            this.state.isAnimating &&
                            this.state.activeShortcut === shortcut.id
                          }
                        >
                          {this.state.isAnimating &&
                          this.state.activeShortcut === shortcut.id
                            ? "Animating..."
                            : "▶ Play Demo"}
                        </button>
                        <div className="editor-container">
                          <MonacoEditor
                            height="200px"
                            language="typescript"
                            theme="vs-dark"
                            value={shortcut.initialCode}
                            onMount={(editor) =>
                              this.handleEditorDidMount(editor, shortcut.id)
                            }
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
                            }}
                          />
                        </div>
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
