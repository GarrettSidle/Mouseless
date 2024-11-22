import React, { Component } from "react";
import Problem from "../../models/Problem";

interface EditorFormState {
  problem: Problem
}

interface EditorFormProps {
  problem: Problem
}
class EditorForm extends Component<EditorFormProps, EditorFormState> {
  constructor(props: EditorFormProps) {
    super(props);
    this.state = {
      problem: this.props.problem
    };
  }


  handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {

    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case "b": // Bold
          event.preventDefault();
          this.applyFormatting("**");
          break;
        case "i": // Italics
          event.preventDefault();
          this.applyFormatting("_");
          break;
        case "u": // Underline
          event.preventDefault();
          this.applyFormatting("<u>", "</u>");
          break;
        default:
          break;
      }
    }
  };

  applyFormatting = (prefix: string, suffix: string = "") => {
    const textarea = document.getElementById("editor") as HTMLTextAreaElement;
    const { selectionStart, selectionEnd } = textarea;
    const content = this.state.problem.currentText;

    const before = content.slice(0, selectionStart);
    const selected = content.slice(selectionStart, selectionEnd);
    const after = content.slice(selectionEnd);

    this.setState((prevState) => ({
      problem: { ...prevState.problem, currentText: before + prefix + selected + suffix + after }
    }));
  }

  handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState((prevState) => ({
      problem: { ...prevState.problem, currentText: event.target.value }
    }));
  };

  render() {
    const content = this.state.problem.currentText;

    return (
      <div>
        <h1>Simple Text Editor</h1>
        <textarea
          id="editor"
          className="form"
          value={content}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
        />
      </div>
    );
  }
}

export default EditorForm;
