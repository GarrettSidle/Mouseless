import { Component } from "react";

import "./Editor.css";
import ValueDisplay from "../../components/ValueDisplay/ValueDisplay";
import EditorForm from "../../components/Forms/EditorForm";
import DiffForm from "../../components/Forms/DiffForm";

const colorMap = {
  goodCutoff: 75,
  neutralCutoff: 50,
};

export class Editor extends Component<{}> {


  public render() {
    return (
      <div className="editor">
        <h1>This is a test</h1>
        <div className="value-displays">
          <ValueDisplay value={50} title="Time" unit="" colorMap={colorMap} />
          <ValueDisplay value={76} title="Speed" unit="%" colorMap={colorMap} />
          <ValueDisplay value={49} title="Completion" unit="%" colorMap={colorMap} />
        </div>
        <div className="form-container">
          <div className="form-editor"><EditorForm/></div>
          <div className="form-diff"><DiffForm/></div>
        </div>
      </div>
    );
  }


}
export default Editor;
