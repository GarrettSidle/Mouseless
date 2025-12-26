/**
 * Logic for managing Monaco Editor instance
 */

export class MonacoEditorManager {
  private editorRef: any = null;
  private keystrokeDisposer: (() => void) | null = null;
  private onKeystroke: (() => void) | null = null;
  private isRunning: boolean = false;

  /**
   * Handle editor mount
   */
  handleEditorDidMount = (editor: any, onKeystroke?: () => void) => {
    this.editorRef = editor;
    this.onKeystroke = onKeystroke || null;
    this.disableEditorDiagnostics(editor);
    this.setupKeystrokeTracking(editor);
  };

  /**
   * Setup keystroke tracking for the editor
   */
  private setupKeystrokeTracking = (editor: any) => {
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
      if (!this.isRunning) {
        return;
      }

      // Check if the editor has focus
      if (!editorDomNode.contains(event.target as Node)) {
        return;
      }

      // Skip modifier keys when pressed alone
      const isModifierKey =
        event.key === "Control" ||
        event.key === "Alt" ||
        event.key === "Shift" ||
        event.key === "Meta" ||
        event.key === "OS";

      if (isModifierKey) {
        return;
      }

      // Increment strokes counter
      if (this.onKeystroke) {
        this.onKeystroke();
      }
    };

    // Add event listener to the editor's DOM node
    editorDomNode.addEventListener("keydown", handleKeyDown);

    // Store disposer function
    this.keystrokeDisposer = () => {
      editorDomNode.removeEventListener("keydown", handleKeyDown);
    };
  };

  /**
   * Set whether the timer is running (affects keystroke counting)
   */
  setRunning = (running: boolean) => {
    this.isRunning = running;
  };

  /**
   * Disable all diagnostics/validation in Monaco Editor
   */
  private disableEditorDiagnostics = (editor: any) => {
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

  /**
   * Disable all diagnostics/validation in Monaco Editor for all languages
   */
  disableAllLanguageDiagnostics = (monaco: any) => {
    if (!monaco || !monaco.languages) return;

    try {
      // Disable TypeScript/JavaScript diagnostics
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

  /**
   * Get editor reference
   */
  getEditor = () => {
    return this.editorRef;
  };

  /**
   * Cleanup resources
   */
  cleanup = () => {
    if (this.keystrokeDisposer) {
      this.keystrokeDisposer();
      this.keystrokeDisposer = null;
    }
    this.editorRef = null;
    this.onKeystroke = null;
  };
}

