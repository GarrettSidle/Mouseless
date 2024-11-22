import React, { Component } from "react";
import "./Forms.css"
import Problem from "../../models/Problem";
import * as Diff from "diff"


interface DiffFormProps {
  problem: Problem
  onCurrentTextChange: (newText: string) => void; 
}


class DiffForm extends Component<DiffFormProps> {


// Method to generate the diff output
renderDiff = () => {
  const { currentText, modifiedText } = this.props.problem;
  const diffResult = Diff.diffWords(currentText, modifiedText);  // Get character-level diff

  return diffResult.map((part, index) => {
    // Determine the style based on the change type
    const style = {
      backgroundColor: part.added ? "lightgreen" : part.removed ? "salmon" : "transparent",
      textDecoration: part.removed ? "line-through" : "none",
    };

    return (
      <span key={index} style={style}>
        {part.value}
      </span>
    );
  });
};


  render() {

    return (

      <div>
        <h1>Diff Text Editor</h1>
        <div className="form diff" >
          {this.renderDiff()} 
        </div>
      </div>
    );
  }
}

export default DiffForm;
