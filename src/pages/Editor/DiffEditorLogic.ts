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
    // Use setTimeout to ensure the editor is fully initialized before disabling diagnostics
    setTimeout(() => {
      if (this.diffEditorRef === editor) {
        this.disableEditorDiagnostics(editor);
      }
    }, 100);
  };

  /**
   * Disable all diagnostics/validation in Monaco Editor
   * Note: Diagnostics are already disabled at the language level in beforeMount,
   * so we don't need to set model markers here. This avoids errors with model access.
   */
  private disableEditorDiagnostics = (editor: any) => {
    if (!editor) return;

    try {
      // Get Monaco instance
      const monaco = (window as any).monaco;
      if (!monaco) return;

      // Disable diagnostics for all languages
      // This is the main way to disable diagnostics and is already called in beforeMount
      // We call it here again as a safety measure in case the editor was created before beforeMount ran
      this.disableAllLanguageDiagnostics(monaco);

      // Note: We intentionally don't call setModelMarkers here because:
      // 1. Diagnostics are already disabled at the language level
      // 2. Accessing models on DiffEditor can cause errors if models aren't fully initialized
      // 3. The beforeMount hook already handles disabling diagnostics globally
    } catch (error) {
      // Silently ignore errors - diagnostics disabling is best-effort
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
        // Check if editor still exists and has dispose method
        if (this.diffEditorRef && typeof this.diffEditorRef.dispose === "function") {
          this.diffEditorRef.dispose();
        }
      } catch (error) {
        // Ignore disposal errors - editor may already be disposed
      } finally {
        this.diffEditorRef = null;
      }
    }
  };

  /**
   * Cleanup resources
   */
  cleanup = () => {
    this.dispose();
  };
}

