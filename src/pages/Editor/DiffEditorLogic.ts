/**
 * Logic for managing Diff Editor instance
 */

export class DiffEditorManager {
  private diffEditorRef: any = null;

  /**
   * Handle DiffEditor mount
   */
  handleDiffEditorDidMount = (editor: any) => {
    this.diffEditorRef = editor;
    this.disableEditorDiagnostics(editor);
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
    } catch (error) {
      // Ignore errors
    }
  };

  /**
   * Get editor reference
   */
  getEditor = () => {
    return this.diffEditorRef;
  };

  /**
   * Dispose the editor
   */
  dispose = () => {
    if (this.diffEditorRef) {
      try {
        this.diffEditorRef.dispose();
      } catch (error) {
        // Ignore disposal errors
      }
      this.diffEditorRef = null;
    }
  };

  /**
   * Cleanup resources
   */
  cleanup = () => {
    this.dispose();
  };
}

