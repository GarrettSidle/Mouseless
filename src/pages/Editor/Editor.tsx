import { Component } from "react";

import "./Editor.css";
import ValueDisplay from "../../components/ValueDisplay/ValueDisplay";
import ColorMap from "../../models/ColorMap";
import Problem from "../../models/Problem";
import * as Diff from "diff"





const problems: Problem[] = [
  {
    originalText: "interface TimerState {\n   time: number;\n   isRunning: boolean;\n}",
    modifiedText: "interface TimerState {\n   time: number;\n}",
    currentText: "interface TimerState {\n   time: number;\n   isRunning: boolean;\n}"
  },
  {
    originalText: "1",
    modifiedText: "1",
    currentText: "1"
  },
  {
    originalText: "2",
    modifiedText: "2",
    currentText: "1"
  },
  {
    originalText: "3",
    modifiedText: "3",
    currentText: "1"
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

  resetProblem() {
    this.setState((prevState) => ({
      problem: {
        ...prevState.problem,
        currentText: this.state.problem.originalText,
      },
    }))
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

  // Method to generate the diff output
  renderDiff = () => {
    const { currentText, modifiedText } = this.state.problem;
    const diffResult = Diff.diffWords(currentText, modifiedText);  // Get character-level diff

    return diffResult.map((part, index) => {
      // Determine the style based on the change type
      const style = {
        backgroundColor: part.added ? "lightgreen" : part.removed ? "salmon" : "transparent",
        color: part.removed ? "black" : part.added ? "Black" : "#edf8ff"
      };

      return (
        <span key={index} style={style}>
          {part.value}
        </span>
      );
    });
  };

  handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {

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
          <div className="form-editor">
            <div>
              <textarea
                id="editor"
                className="form"
                value={this.state.problem.currentText}
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
              />
            </div>
          </div>
          <div className="form-diff">
            <div className="form diff" >
              {this.renderDiff()}
            </div>
          </div>
        </div>
        <div className="editor-buttons">
          <button onClick={() => { this.resetProblem() }}>Reset</button>
          <button onClick={() => { this.skipProblem() }}>Skip</button>
        </div>
      </div>
    );
  }


}
export default Editor;
