import React, { Component } from "react";
import "./Forms.css"

interface DiffFormState {
  content: string;
}

class DiffForm extends Component<{}, DiffFormState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      content: "Diff here...",
    };
  }




  render() {
    const { content } = this.state;

    return (
      <div>
        <h1>Simple Text Editor</h1>
        <textarea
          id="editor"
          className="form"
          value={content}
          readOnly
        />
      </div>
    );
  }
}

export default DiffForm;
