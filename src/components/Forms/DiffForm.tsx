import React, { Component } from "react";
import "./Forms.css"
import Problem from "../../models/Problem";


interface DiffFormProps{
  problem:Problem
}
class DiffForm extends Component<DiffFormProps> {





  render() {

    return (
      <div>
        <h1>Diff Text Editor</h1>
        <textarea
          id="diff"
          className="form diff"
          value={this.props.problem.modifiedText}
          readOnly
        />
      </div>
    );
  }
}

export default DiffForm;
