import { Component } from "react";

import "./Editor.css";
import ValueDisplay from "../../components/ValueDisplay/ValueDisplay";
import EditorForm from "../../components/Forms/EditorForm";
import DiffForm from "../../components/Forms/DiffForm";

interface EditorFormState {
  isRunning: boolean;
  minutes: number;
  seconds: number;
  elapsedSeconds: number;
}


const colorMap = {
  goodCutoff: 75,
  neutralCutoff: 50,
};

export class Editor extends Component<{}, EditorFormState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      minutes: 0,
      seconds: 0,
      isRunning: false,   // Tracks if the timer is running
      elapsedSeconds: 0
    };
    this.startTimer()
  }

  private timer: NodeJS.Timeout | null = null;  // Timer interval reference

  // Start the timer
  startTimer = () => {
    if (!this.state.isRunning) {
      this.timer = setInterval(() => {
        this.setState((prevState) => ({ seconds: prevState.seconds + 1, elapsedSeconds: prevState.elapsedSeconds + 1 }));
        if (this.state.seconds >= 60) {
          this.setState((prevState) => ({ minutes: prevState.minutes + 1, seconds: 0 }));
        }
      }, 1000);
      this.setState({ isRunning: true });
    }
  };

  // Pause the timer
  pauseTimer = () => {
    if (this.timer) {
      clearInterval(this.timer);
      this.setState({ isRunning: false });
    }
  };

  // Reset the timer
  resetTimer = () => {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.setState({ seconds: 0, isRunning: false });
  };

  // Clear the timer interval when the component unmounts
  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private temp1:string = "interface TimerState {\ntime: number;\nisRunning: boolean;\n}"
  private temp2:string = "interface TimerState {\ntime: number;\n}"

  public render() {
    return (
      <div className="editor">
        <h1>This is a test</h1>
        <div className="value-displays">
          <ValueDisplay
            viewable={`${this.state.minutes.toString().padStart(2, '0')}:${this.state.seconds.toString().padStart(2, '0')}`}
            value={this.state.elapsedSeconds}
            title="Time"
            unit=""
            colorMap={colorMap} />
          <ValueDisplay viewable="50" value={76} title="Speed" unit="%" colorMap={colorMap} />
          <ValueDisplay viewable="50" value={49} title="Completion" unit="%" colorMap={colorMap} />
        </div>
        <div className="form-container">
          <div className="form-editor"><EditorForm content={this.temp2}/></div>
          <div className="form-diff"><DiffForm content={this.temp1}/></div>
        </div>
        <div className="editor-buttons">
          <button>Reset</button>
          <button>Skip</button>
        </div>
      </div>
    );
  }


}
export default Editor;
