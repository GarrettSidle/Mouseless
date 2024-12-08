import { Component } from "react";

import "./Editor.css";
import ValueDisplay from "../../components/ValueDisplay/ValueDisplay";
import ColorMap from "../../models/ColorMap";
import Problem from "../../models/Problem";
import * as Diff from "diff"
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Statistics from "../../components/Statistics/Statistics";




const problems: Problem[] = [
  {
    originalText: "interface TimerState {\n   time: number;\n   isRunning: boolean;\n}",
    modifiedText: "interface TimerState {\n   time: number;\n}",
    currentText: "interface TimerState {\n   time: number;\n   isRunning: boolean;\n}",
    problemId: "01234",
    problemStats: {
      timeStats: [1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24, 18, 12, 7, 4, 2, 1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24, 18, 12, 7, 4, 2, 1],
      CCPMStats: [1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24, 18, 12, 7, 4, 2, 1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24, 18, 12, 7, 4, 2, 1],
      keyStroksStats: [1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24, 18, 12, 7, 4, 2, 1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24, 18, 12, 7, 4, 2, 1],
    }
  },
  {
    originalText: "1",
    modifiedText: "12",
    currentText: "1",
    problemId: "01234",
    problemStats: {
      timeStats: [1, 2, 4, 8, 8, 4, 2, 1],
      CCPMStats: [1, 2, 4, 8, 8, 4, 2, 1],
      keyStroksStats: [1, 2, 4, 8, 8, 4, 2, 1]
    }
  },
  {
    originalText: "1",
    modifiedText: "2",
    currentText: "1",
    problemId: "01234",
    problemStats: {
      timeStats: [1, 2, 4, 8, 8, 4, 2, 1],
      CCPMStats: [1, 2, 4, 8, 8, 4, 2, 1],
      keyStroksStats: [1, 2, 4, 8, 8, 4, 2, 1]
    }
  },
  {
    originalText: "3",
    modifiedText: "355",
    currentText: "3",
    problemId: "01234",
    problemStats: {
      timeStats: [1, 2, 4, 8, 8, 4, 2, 1],
      CCPMStats: [1, 2, 4, 8, 8, 4, 2, 1],
      keyStroksStats: [1, 2, 4, 8, 8, 4, 2, 1]
    }
  },
]



interface EditorFormState {
  isRunning: boolean;
  minutes: number;
  seconds: number;
  elapsedSeconds: number;
  problem: Problem;
  wordsPerMin: number;
  completionPerc: number; 
  strokes: number;
  hideStats: boolean;
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
const strokesColorMap: ColorMap = {
  upperCutoff: 30,
  centerCutoff: 15,
  isInverted: true,
}


export class Editor extends Component<{}, EditorFormState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      minutes: 0,
      seconds: 0,
      isRunning: false,   // Tracks if the timer is running
      elapsedSeconds: 0,
      problem: problems[0],
      wordsPerMin: 0,
      completionPerc: 0,
      hideStats: true,
      strokes : 0
    };
    this.startTimer()
  }

  private timer: NodeJS.Timeout | null = null;  // Timer interval reference

  skipProblem = () => {
    var isStatsHidden = !this.state.isRunning
    var index = Math.floor(Math.random() * problems.length);
    this.setState({
      problem: problems[index],
      elapsedSeconds: 0,
      seconds: 0,
      minutes: 0,
      hideStats : true
    });
    this.calculateSpeed()
    this.calculateCompletion()
    // if (!this.state.isRunning) {
    //   this.startTimer()
    // }
  };

  completeProblem() {
    this.pauseTimer();
    this.setState({ hideStats: false })
  }

  resetProblem = () => {
    var isStatsHidden = !this.state.isRunning
    this.setState((prevState) => ({
      problem: {
        ...prevState.problem,
        currentText: this.state.problem.originalText,
      },
      elapsedSeconds: 0,
      seconds: 0,
      minutes: 0,
      hideStats : true
    }))
    this.calculateSpeed()
    this.calculateCompletion()


    // if (!this.state.isRunning) {
    //   this.startTimer()
    // }

  }



  // Start the timer
  startTimer = () => {
    if (!this.state.isRunning) {
      this.timer = setInterval(() => {
        this.setState((prevState) => ({
          seconds: prevState.seconds + 1,
          elapsedSeconds: prevState.elapsedSeconds + 1,
        }));
        if (this.state.seconds >= 60) {
          this.setState((prevState) => ({
            minutes: prevState.minutes + 1,
            seconds: 0
          }));
        }

        this.calculateSpeed();
        this.calculateCompletion()

        if (this.state.problem.currentText == this.state.problem.modifiedText) {
          this.completeProblem()
        }

      }, 1000);
      this.setState({ isRunning: true });
    }
  };

  calculateSpeed() {
    let changedCharCount = 0;
    const diffResult = Diff.diffChars(this.state.problem.currentText, this.state.problem.originalText);

    // Loop through the diffResult array
    for (let i = 0; i < diffResult.length; i++) {
      // Check if the element is added or removed
      if (diffResult[i].added || diffResult[i].removed) {
        changedCharCount += diffResult[i]?.count ?? 0;
      }
    }

    var wordsPerMin = Math.round(changedCharCount / (this.state.elapsedSeconds / 60))
    if (Number.isNaN(wordsPerMin)) {
      wordsPerMin = 0
    }

    this.setState({ wordsPerMin: wordsPerMin })
  }
  calculateCompletion() {
    let charChangesRamaining = 0;
    let totalChanges = 0;
    var diffResult = Diff.diffChars(this.state.problem.currentText, this.state.problem.modifiedText);
    // Loop through the diffResult array
    for (let i = 0; i < diffResult.length; i++) {
      // Check if the element is added or removed
      if (diffResult[i].added || diffResult[i].removed) {
        charChangesRamaining += diffResult[i]?.count ?? 0;
      }
    }

    var diffResult = Diff.diffChars(this.state.problem.originalText, this.state.problem.modifiedText);
    // Loop through the diffResult array
    for (let i = 0; i < diffResult.length; i++) {
      // Check if the element is added or removed
      if (diffResult[i].added || diffResult[i].removed) {
        totalChanges += diffResult[i]?.count ?? 0;
      }
    }



    this.setState({ completionPerc: 100 - Math.round((charChangesRamaining / totalChanges) * 100) })
  }


  // Reset the timer
  resetTimer = () => {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.setState({ seconds: 0, isRunning: false });
  };
  pauseTimer = () => {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.setState({ isRunning: false });
  };

  // Clear the timer interval when the component unmounts
  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }


  // Method to generate the diff output
  renderDiff = () => {
    const { currentText, modifiedText } = this.state.problem;
    const diffResult = Diff.diffWords(currentText, modifiedText);  // Get character-level diff

    return diffResult.map((part, index) => {
      // Determine the style based on the change type
      const style = {
        backgroundColor: part.added ? "lightgreen" : part.removed ? "salmon" : "transparent",
        background: "none"
      };

      return (
        <SyntaxHighlighter
          language="javascript"
          style={coy}
          customStyle={style}
          key={index}
          className="diff-part"
        >
          {part.value}
        </SyntaxHighlighter>
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
      <div className={`editor page`}>
        <div className={this.state.hideStats ? "hidden" : ""}>
          <Statistics
            problem={this.state.problem}
            userPositionTime={140}
            userPositionStrokes={5}
            userPositionCCPM={120}
            resetProblem={this.resetProblem}
            skipProblem={this.skipProblem}
          />
        </div>
        <div className="value-displays">
          <ValueDisplay
            viewable={`${this.state.minutes.toString().padStart(2, '0')}:${this.state.seconds.toString().padStart(2, '0')}`}
            value={this.state.elapsedSeconds}
            title="Time"
            colorMap={timerColorMap} />
          <ValueDisplay value={this.state.wordsPerMin} title="Speed" unit="CCPM" colorMap={speedColorMap} />
          <ValueDisplay value={this.state.completionPerc} title="Completion" unit="%" colorMap={completionColorMap} />
          <ValueDisplay value={this.state.strokes} title="Key Strokes" colorMap={strokesColorMap} />
        </div>
        <div className="form-container">
          <div className="form-editor">
            <textarea
              id="editor"
              className="form"
              value={this.state.problem.currentText}
              onChange={this.handleChange}
              onKeyDown={this.handleKeyDown}
            />
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
