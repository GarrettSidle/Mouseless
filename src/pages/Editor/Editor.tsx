import { Component } from "react";

import "./Editor.css";
import ValueDisplay from "../../components/ValueDisplay/ValueDisplay";
import ColorMap from "../../models/ColorMap";
import Problem from "../../models/Problem";
import * as Diff from "diff";
import Statistics from "../../components/Statistics/Statistics";

const problems: Problem[] = [
  {
    originalText:
      "interface TimerState {\n   time: number;\n   isRunning: boolean;\n}",
    modifiedText: "interface TimerState {\n   time: number;\n}",
    currentText:
      "interface TimerState {\n   time: number;\n   isRunning: boolean;\n}",
    problemId: "01234",
    problemStats: {
      timeStats: [
        1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24, 18, 12,
        7, 4, 2, 1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24,
        18, 12, 7, 4, 2, 1,
      ],
      CCPMStats: [
        1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24, 18, 12,
        7, 4, 2, 1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24,
        18, 12, 7, 4, 2, 1,
      ],
      keyStroksStats: [
        1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24, 18, 12,
        7, 4, 2, 1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24,
        18, 12, 7, 4, 2, 1,
      ],
    },
  },
  {
    originalText: "1",
    modifiedText: "12",
    currentText: "1",
    problemId: "01234",
    problemStats: {
      timeStats: [1, 2, 4, 8, 8, 4, 2, 1],
      CCPMStats: [1, 2, 4, 8, 8, 4, 2, 1],
      keyStroksStats: [1, 2, 4, 8, 8, 4, 2, 1],
    },
  },
  {
    originalText: "1",
    modifiedText: "2",
    currentText: "1",
    problemId: "01234",
    problemStats: {
      timeStats: [1, 2, 4, 8, 8, 4, 2, 1],
      CCPMStats: [1, 2, 4, 8, 8, 4, 2, 1],
      keyStroksStats: [1, 2, 4, 8, 8, 4, 2, 1],
    },
  },
  {
    originalText: "3",
    modifiedText: "355",
    currentText: "3",
    problemId: "01234",
    problemStats: {
      timeStats: [1, 2, 4, 8, 8, 4, 2, 1],
      CCPMStats: [1, 2, 4, 8, 8, 4, 2, 1],
      keyStroksStats: [1, 2, 4, 8, 8, 4, 2, 1],
    },
  },
  {
    originalText:
      "function calculateTotal(items) {\n  let sum = 0;\n  for (let i = 0; i < items.length; i++) {\n    sum += items[i].price;\n  }\n  return sum;\n}\n\nfunction applyDiscount(total) {\n  return total * 0.9;\n}",
    modifiedText:
      "function calculateTotal(items) {\n  let total = 0;\n  for (let i = 0; i < items.length; i++) {\n    total += items[i].price;\n  }\n  return total;\n}\n\nfunction applyDiscount(amount) {\n  return amount * 0.9;\n}",
    currentText:
      "function calculateTotal(items) {\n  let sum = 0;\n  for (let i = 0; i < items.length; i++) {\n    sum += items[i].price;\n  }\n  return sum;\n}\n\nfunction applyDiscount(total) {\n  return total * 0.9;\n}",
    problemId: "01235",
    problemStats: {
      timeStats: [
        1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24, 18, 12,
        7, 4, 2, 1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24,
        18, 12, 7, 4, 2, 1,
      ],
      CCPMStats: [
        1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24, 18, 12,
        7, 4, 2, 1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24,
        18, 12, 7, 4, 2, 1,
      ],
      keyStroksStats: [
        1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24, 18, 12,
        7, 4, 2, 1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24,
        18, 12, 7, 4, 2, 1,
      ],
    },
  },
  {
    originalText:
      "class UserService {\n  constructor() {\n    this.users = [];\n    this.nextId = 1;\n  }\n\n  addUser(name, email) {\n    const user = {\n      id: this.nextId++,\n      name: name,\n      email: email\n    };\n    this.users.push(user);\n    return user;\n  }\n\n  findUserById(id) {\n    return this.users.find(u => u.id === id);\n  }\n\n  getAllUsers() {\n    return this.users;\n  }\n}",
    modifiedText:
      "class UserService {\n  constructor() {\n    this.users = [];\n    this.nextId = 1;\n  }\n\n  getAllUsers() {\n    return this.users;\n  }\n\n  findUserById(id) {\n    return this.users.find(u => u.id === id);\n  }\n\n  addUser(name, email) {\n    const user = {\n      id: this.nextId++,\n      name: name,\n      email: email\n    };\n    this.users.push(user);\n    return user;\n  }\n}",
    currentText:
      "class UserService {\n  constructor() {\n    this.users = [];\n    this.nextId = 1;\n  }\n\n  addUser(name, email) {\n    const user = {\n      id: this.nextId++,\n      name: name,\n      email: email\n    };\n    this.users.push(user);\n    return user;\n  }\n\n  findUserById(id) {\n    return this.users.find(u => u.id === id);\n  }\n\n  getAllUsers() {\n    return this.users;\n  }\n}",
    problemId: "01236",
    problemStats: {
      timeStats: [
        1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24, 18, 12,
        7, 4, 2, 1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24,
        18, 12, 7, 4, 2, 1,
      ],
      CCPMStats: [
        1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24, 18, 12,
        7, 4, 2, 1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24,
        18, 12, 7, 4, 2, 1,
      ],
      keyStroksStats: [
        1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24, 18, 12,
        7, 4, 2, 1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24,
        18, 12, 7, 4, 2, 1,
      ],
    },
  },
  {
    originalText:
      "const data = [\n  { id: 1, name: 'Alice', age: 25 },\n  { id: 2, name: 'Bob', age: 30 },\n  { id: 3, name: 'Charlie', age: 35 }\n];\n\nfunction processData(data) {\n  const results = [];\n  for (let item of data) {\n    if (item.age > 28) {\n      results.push(item.name);\n    }\n  }\n  return results;\n}\n\nconsole.log(processData(data));",
    modifiedText:
      "const data = [\n  { id: 1, name: 'Alice', age: 25 },\n  { id: 2, name: 'Bob', age: 30 },\n  { id: 3, name: 'Charlie', age: 35 }\n];\n\nfunction processData(users) {\n  const filtered = [];\n  for (let user of users) {\n    if (user.age > 28) {\n      filtered.push(user.name);\n    }\n  }\n  return filtered;\n}\n\nconsole.log(processData(data));",
    currentText:
      "const data = [\n  { id: 1, name: 'Alice', age: 25 },\n  { id: 2, name: 'Bob', age: 30 },\n  { id: 3, name: 'Charlie', age: 35 }\n];\n\nfunction processData(data) {\n  const results = [];\n  for (let item of data) {\n    if (item.age > 28) {\n      results.push(item.name);\n    }\n  }\n  return results;\n}\n\nconsole.log(processData(data));",
    problemId: "01237",
    problemStats: {
      timeStats: [
        1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24, 18, 12,
        7, 4, 2, 1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24,
        18, 12, 7, 4, 2, 1,
      ],
      CCPMStats: [
        1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24, 18, 12,
        7, 4, 2, 1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24,
        18, 12, 7, 4, 2, 1,
      ],
      keyStroksStats: [
        1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24, 18, 12,
        7, 4, 2, 1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24,
        18, 12, 7, 4, 2, 1,
      ],
    },
  },
  {
    originalText:
      "async function fetchUserData(userId) {\n  try {\n    const response = await fetch(`/api/users/${userId}`);\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error('Error:', error);\n    return null;\n  }\n}\n\nasync function fetchUserPosts(userId) {\n  try {\n    const response = await fetch(`/api/users/${userId}/posts`);\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error('Error:', error);\n    return null;\n  }\n}",
    modifiedText:
      "async function fetchUserData(userId) {\n  try {\n    const response = await fetch(`/api/users/${userId}`);\n    if (!response.ok) {\n      throw new Error(`HTTP error! status: ${response.status}`);\n    }\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error('Error:', error);\n    return null;\n  }\n}\n\nasync function fetchUserPosts(userId) {\n  try {\n    const response = await fetch(`/api/users/${userId}/posts`);\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error('Error:', error);\n    return null;\n  }\n}",
    currentText:
      "async function fetchUserData(userId) {\n  try {\n    const response = await fetch(`/api/users/${userId}`);\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error('Error:', error);\n    return null;\n  }\n}\n\nasync function fetchUserPosts(userId) {\n  try {\n    const response = await fetch(`/api/users/${userId}/posts`);\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error('Error:', error);\n    return null;\n  }\n}",
    problemId: "01238",
    problemStats: {
      timeStats: [
        1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24, 18, 12,
        7, 4, 2, 1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24,
        18, 12, 7, 4, 2, 1,
      ],
      CCPMStats: [
        1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24, 18, 12,
        7, 4, 2, 1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24,
        18, 12, 7, 4, 2, 1,
      ],
      keyStroksStats: [
        1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24, 18, 12,
        7, 4, 2, 1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24,
        18, 12, 7, 4, 2, 1,
      ],
    },
  },
  {
    originalText:
      "function validateEmail(email) {\n  if (!email) return false;\n  const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n  return regex.test(email);\n}\n\nfunction validatePassword(password) {\n  if (!password) return false;\n  if (password.length < 8) return false;\n  return true;\n}\n\nfunction validateUser(user) {\n  return validateEmail(user.email) && validatePassword(user.password);\n}",
    modifiedText:
      "function validateEmail(email) {\n  if (!email) return false;\n  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n  return emailRegex.test(email);\n}\n\nfunction validatePassword(password) {\n  if (!password) return false;\n  if (password.length < 8) return false;\n  return true;\n}\n\nfunction validateUser(user) {\n  return validateEmail(user.email) && validatePassword(user.password);\n}",
    currentText:
      "function validateEmail(email) {\n  if (!email) return false;\n  const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n  return regex.test(email);\n}\n\nfunction validatePassword(password) {\n  if (!password) return false;\n  if (password.length < 8) return false;\n  return true;\n}\n\nfunction validateUser(user) {\n  return validateEmail(user.email) && validatePassword(user.password);\n}",
    problemId: "01239",
    problemStats: {
      timeStats: [
        1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24, 18, 12,
        7, 4, 2, 1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24,
        18, 12, 7, 4, 2, 1,
      ],
      CCPMStats: [
        1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24, 18, 12,
        7, 4, 2, 1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24,
        18, 12, 7, 4, 2, 1,
      ],
      keyStroksStats: [
        1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24, 18, 12,
        7, 4, 2, 1, 2, 4, 7, 12, 18, 24, 30, 34, 37, 39, 40, 39, 37, 34, 30, 24,
        18, 12, 7, 4, 2, 1,
      ],
    },
  },
];

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
};

export class Editor extends Component<{}, EditorFormState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      minutes: 0,
      seconds: 0,
      isRunning: false, // Tracks if the timer is running
      elapsedSeconds: 0,
      problem: problems[0],
      wordsPerMin: 0,
      completionPerc: 0,
      hideStats: true,
      strokes: 0,
    };
    this.startTimer();
  }

  private timer: NodeJS.Timeout | null = null; // Timer interval reference

  skipProblem = () => {
    var isStatsHidden = !this.state.isRunning;
    var index = Math.floor(Math.random() * problems.length);
    this.setState({
      problem: problems[index],
      elapsedSeconds: 0,
      seconds: 0,
      minutes: 0,
      hideStats: true,
    });
    this.calculateSpeed();
    this.calculateCompletion();
    // if (!this.state.isRunning) {
    //   this.startTimer()
    // }
  };

  completeProblem() {
    this.pauseTimer();
    this.setState({ hideStats: false });
  }

  resetProblem = () => {
    var isStatsHidden = !this.state.isRunning;
    this.setState((prevState) => ({
      problem: {
        ...prevState.problem,
        currentText: this.state.problem.originalText,
      },
      elapsedSeconds: 0,
      seconds: 0,
      minutes: 0,
      hideStats: true,
    }));
    this.calculateSpeed();
    this.calculateCompletion();

    // if (!this.state.isRunning) {
    //   this.startTimer()
    // }
  };

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
            seconds: 0,
          }));
        }

        this.calculateSpeed();
        this.calculateCompletion();

        // Compare normalized text (ignoring whitespace differences)
        const normalizedCurrent = this.normalizeWhitespace(
          this.state.problem.currentText
        );
        const normalizedTarget = this.normalizeWhitespace(
          this.state.problem.modifiedText
        );
        if (normalizedCurrent === normalizedTarget) {
          this.completeProblem();
        }
      }, 1000);
      this.setState({ isRunning: true });
    }
  };

  calculateSpeed() {
    let changedCharCount = 0;
    const diffResult = Diff.diffChars(
      this.state.problem.currentText,
      this.state.problem.originalText
    );

    // Loop through the diffResult array
    for (let i = 0; i < diffResult.length; i++) {
      // Check if the element is added or removed
      if (diffResult[i].added || diffResult[i].removed) {
        changedCharCount += diffResult[i]?.count ?? 0;
      }
    }

    var wordsPerMin = Math.round(
      changedCharCount / (this.state.elapsedSeconds / 60)
    );
    if (Number.isNaN(wordsPerMin)) {
      wordsPerMin = 0;
    }

    this.setState({ wordsPerMin: wordsPerMin });
  }
  // Helper function to normalize whitespace for comparison
  normalizeWhitespace = (text: string): string => {
    // Replace all whitespace characters (spaces, tabs, newlines) with a single space
    // Then trim the result
    return text.replace(/\s+/g, " ").trim();
  };

  calculateCompletion() {
    let charChangesRamaining = 0;
    let totalChanges = 0;
    console.log(
      this.state.problem.currentText,
      this.state.problem.modifiedText
    );
    var diffResult = Diff.diffChars(
      this.state.problem.currentText,
      this.state.problem.modifiedText
    );
    // Loop through the diffResult array
    for (let i = 0; i < diffResult.length; i++) {
      // Check if the element is added or removed
      if (diffResult[i].added || diffResult[i].removed) {
        charChangesRamaining += diffResult[i]?.count ?? 0;
      }
    }

    var diffResult = Diff.diffChars(
      this.state.problem.originalText,
      this.state.problem.modifiedText
    );
    // Loop through the diffResult array
    for (let i = 0; i < diffResult.length; i++) {
      // Check if the element is added or removed
      if (diffResult[i].added || diffResult[i].removed) {
        totalChanges += diffResult[i]?.count ?? 0;
      }
    }

    this.setState({
      completionPerc:
        100 - Math.round((charChangesRamaining / totalChanges) * 100),
    });
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

  // Helper function to check if a string contains only whitespace
  isWhitespaceOnly = (text: string): boolean => {
    return /^\s*$/.test(text);
  };

  // Method to generate the diff output - shows target (modifiedText) with diff highlighting
  renderDiff = () => {
    const { currentText, modifiedText } = this.state.problem;
    const diffResult = Diff.diffChars(currentText, modifiedText); // Get character-level diff including spaces

    return (
      <div className="diff-content">
        {diffResult.map((part, index) => {
          // Determine the style based on the change type
          // If the part is only whitespace, treat it as unchanged (don't highlight)
          const isWhitespace = this.isWhitespaceOnly(part.value);
          const className =
            isWhitespace || !(part.added || part.removed)
              ? "diff-unchanged"
              : part.added
              ? "diff-added"
              : "diff-removed";

          // Render each character, making spaces visible
          // Note: newlines are preserved naturally by white-space: pre-wrap in CSS
          const renderContent = part.value.split("").map((char, charIndex) => {
            if (char === " ") {
              return (
                <span key={charIndex} className="diff-space">
                  ·
                </span>
              );
            } else if (char === "\n") {
              return <span key={charIndex}>{"\n"}</span>;
            } else if (char === "\t") {
              return (
                <span key={charIndex} className="diff-tab">
                  →
                </span>
              );
            }
            return <span key={charIndex}>{char}</span>;
          });

          return (
            <span key={index} className={className}>
              {renderContent}
            </span>
          );
        })}
      </div>
    );
  };

  handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {};

  applyFormatting = (prefix: string, suffix: string = "") => {
    const textarea = document.getElementById("editor") as HTMLTextAreaElement;
    const { selectionStart, selectionEnd } = textarea;
    const content = this.state.problem.currentText;

    const before = content.slice(0, selectionStart);
    const selected = content.slice(selectionStart, selectionEnd);
    const after = content.slice(selectionEnd);

    this.setState((prevState) => ({
      problem: {
        ...prevState.problem,
        currentText: before + prefix + selected + suffix + after,
      },
    }));
  };

  handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    this.setState(
      (prevState) => ({
        problem: { ...prevState.problem, currentText: newText },
      }),
      () => {
        // Check for completion after state has been updated
        const normalizedCurrent = this.normalizeWhitespace(newText);
        const normalizedTarget = this.normalizeWhitespace(
          this.state.problem.modifiedText
        );
        if (normalizedCurrent === normalizedTarget) {
          this.completeProblem();
        }
      }
    );
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
            viewable={`${this.state.minutes
              .toString()
              .padStart(2, "0")}:${this.state.seconds
              .toString()
              .padStart(2, "0")}`}
            value={this.state.elapsedSeconds}
            title="Time"
            colorMap={timerColorMap}
          />
          <ValueDisplay
            value={this.state.wordsPerMin}
            title="Speed"
            unit="CCPM"
            colorMap={speedColorMap}
          />
          <ValueDisplay
            value={this.state.completionPerc}
            title="Completion"
            unit="%"
            colorMap={completionColorMap}
          />
          <ValueDisplay
            value={this.state.strokes}
            title="Key Strokes"
            colorMap={strokesColorMap}
          />
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
            <div className="form diff">{this.renderDiff()}</div>
          </div>
        </div>
        <div className="editor-buttons">
          <button
            onClick={() => {
              this.resetProblem();
            }}
          >
            Reset
          </button>
          <button
            onClick={() => {
              this.skipProblem();
            }}
          >
            Skip
          </button>
        </div>
      </div>
    );
  }
}
export default Editor;
