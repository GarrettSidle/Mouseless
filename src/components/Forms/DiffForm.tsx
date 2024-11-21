import React, { Component } from "react";
import "./Forms.css"

interface DiffFormState {
  content: string;
}

interface DiffFormProps{
  content:string
}
class DiffForm extends Component<DiffFormProps, DiffFormState> {
  constructor(props: DiffFormProps) {
    super(props);
    this.state = {
      content: this.props.content,
    };
  }




  render() {
    const { content } = this.state;

    return (
      <div>
        <h1>Diff Text Editor</h1>
        <textarea
          id="diff"
          className="form diff"
          value={content}
          readOnly
        />
      </div>
    );
  }
}

export default DiffForm;
