import React, { Component } from "react";

interface EditorFormState {
  content: string;
}

interface EditorFormProps{
  content:string
}
class EditorForm extends Component<EditorFormProps, EditorFormState> {
  constructor(props: EditorFormProps) {
    super(props);
    this.state = {
      content: this.props.content,
    };
  }


  handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const { content } = this.state;

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
    const { content } = this.state;

    const before = content.slice(0, selectionStart);
    const selected = content.slice(selectionStart, selectionEnd);
    const after = content.slice(selectionEnd);

    this.setState({
      content: before + prefix + selected + suffix + after,
    });
  };

  handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ content: event.target.value });
  };

  render() {
    const { content } = this.state;

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
