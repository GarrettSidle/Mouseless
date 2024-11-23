import { Component } from "react";

import "./Editor.css";
import ValueDisplay from "../../components/ValueDisplay/ValueDisplay";
import EditorForm from "../../components/Forms/EditorForm";
import DiffForm from "../../components/Forms/DiffForm";
import ColorMap from "../../models/ColorMap";
import Problem from "../../models/Problem";





const problems: Problem[] = [
  {
    originalText: "interface TimerState {\n   time: number;\n   isRunning: boolean;\n}",
    modifiedText: "interface TimerState {\n   time: number;\n}",
    currentText : "interface TimerState {\n   time: number;\n   isRunning: boolean;\n}"
  },
  {
    originalText: "1",
    modifiedText: "1",
    currentText : ""
  },
  {
    originalText: "2",
    modifiedText: "2",
    currentText : ""
  },
  {
    originalText: "3",
    modifiedText: "3",
    currentText : ""
  },
]



interface EditorFormState {
  isRunning: boolean;
  minutes: number;
  seconds: number;
  elapsedSeconds: number;
  problem: Problem;
}


const timerColorMap: ColorMap = {
  upperCutoff: 30,
  centerCutoff: 15,
  isInverted: true,
};
const speedColorMap: ColorMap = {
  upperCutoff: 75,
  centerCutoff: 50,
  isInverted: false,
};
const completionColorMap: ColorMap = {
  upperCutoff: 75,
  centerCutoff: 50,
  isInverted: false,
};

export class Editor extends Component<{}, EditorFormState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      minutes: 0,
      seconds: 0,
      isRunning: false,   // Tracks if the timer is running
      elapsedSeconds: 0,
      problem: problems[0]
    };
    this.startTimer()
  }

  private timer: NodeJS.Timeout | null = null;  // Timer interval reference

  skipProblem() {
    var index = Math.floor(Math.random() * (problems.length))
    this.setState({ problem: problems[index] })
  }

  // Start the timer
  startTimer = () => {
    if (!this.state.isRunning) {
      this.timer = setInterval(() => {
        this.setState((prevState) => ({
          seconds: prevState.seconds + 1,
          elapsedSeconds: prevState.elapsedSeconds + 1
        }));
        if (this.state.seconds >= 60) {
          this.setState((prevState) => ({
            minutes: prevState.minutes + 1,
            seconds: 0
          }));
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

  handleCurrentTextChange = (newText: string) => {
    this.setState((prevState) => ({
      problem: {
        ...prevState.problem,
        currentText: newText, 
      },
    }));
  };

  updateCurrentText = (newText: string) => {
    this.setState((prevState) => ({
      problem: { ...prevState.problem, currentText: newText }
    }));
  };


  public render() {
    return (
      <div className="editor page">
        <div className="value-displays">
          <ValueDisplay
            viewable={`${this.state.minutes.toString().padStart(2, '0')}:${this.state.seconds.toString().padStart(2, '0')}`}
            value={this.state.elapsedSeconds}
            title="Time"
            colorMap={timerColorMap} />
          <ValueDisplay value={76} title="Speed" unit="WPM" colorMap={speedColorMap} />
          <ValueDisplay value={49} title="Completion" unit="%" colorMap={completionColorMap} />
        </div>
        <div className="form-container">
          <div className="form-editor"><EditorForm onCurrentTextChange = {this.updateCurrentText} problem={this.state.problem} /></div>
          <div className="form-diff"><DiffForm onCurrentTextChange={this.handleCurrentTextChange} problem={this.state.problem} /></div>
        </div>
        <div className="editor-buttons">
          <button onClick={() => { }}>Reset</button>
          <button onClick={() => { this.skipProblem() }}>Skip</button>
        </div>
      </div>
    );
  }


}
export default Editor;
