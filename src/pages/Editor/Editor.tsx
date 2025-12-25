import { Component } from "react";

import "./Editor.css";
import ValueDisplay from "../../components/ValueDisplay/ValueDisplay";
import ColorMap from "../../models/ColorMap";
import Problem from "../../models/Problem";
import * as Diff from "diff";
import Statistics from "../../components/Statistics/Statistics";
import MonacoEditor, { DiffEditor } from "@monaco-editor/react";

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
  showDiffEditor: boolean;
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
      showDiffEditor: true,
    };
    this.startTimer();
  }

  private timer: NodeJS.Timeout | null = null; // Timer interval reference
  private _isMounted: boolean = true; // Track if component is mounted (start as true)
  private diffEditorRef: any = null; // Reference to DiffEditor instance

  skipProblem = () => {
    var isStatsHidden = !this.state.isRunning;
    var index = Math.floor(Math.random() * problems.length);
    // Clear any existing timer first
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    // Hide and dispose DiffEditor before changing problem
    this.setState({ showDiffEditor: false }, () => {
      // Dispose DiffEditor after hiding
      if (this.diffEditorRef) {
        try {
          this.diffEditorRef.dispose();
        } catch (error) {
          // Ignore disposal errors
        }
        this.diffEditorRef = null;
      }
      // Small delay to ensure disposal completes, then update problem and show editor
      setTimeout(() => {
        this.setState(
          {
            problem: problems[index],
            elapsedSeconds: 0,
            seconds: 0,
            minutes: 0,
            hideStats: true,
            isRunning: false,
            showDiffEditor: true,
          },
          () => {
            // Restart timer after state has been updated
            this.calculateSpeed();
            this.calculateCompletion();
            this.startTimer();
          }
        );
      }, 50);
    });
  };

  completeProblem() {
    if (!this._isMounted) return;
    this.pauseTimer();
    // Update stats before showing completion page
    this.calculateSpeed();
    this.calculateCompletion();
    // Use setTimeout to ensure state updates are applied before showing stats
    setTimeout(() => {
      if (this._isMounted) {
        this.setState({ hideStats: false });
      }
    }, 0);
  }

  resetProblem = () => {
    var isStatsHidden = !this.state.isRunning;
    // Clear any existing timer first
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    // Hide and dispose DiffEditor before resetting
    this.setState({ showDiffEditor: false }, () => {
      // Dispose DiffEditor after hiding
      if (this.diffEditorRef) {
        try {
          this.diffEditorRef.dispose();
        } catch (error) {
          // Ignore disposal errors
        }
        this.diffEditorRef = null;
      }
      // Small delay to ensure disposal completes, then reset problem and show editor
      setTimeout(() => {
        this.setState(
          (prevState) => ({
            problem: {
              ...prevState.problem,
              currentText: this.state.problem.originalText,
            },
            elapsedSeconds: 0,
            seconds: 0,
            minutes: 0,
            hideStats: true,
            isRunning: false,
            showDiffEditor: true,
          }),
          () => {
            // Restart timer after state has been updated
            this.calculateSpeed();
            this.calculateCompletion();
            this.startTimer();
          }
        );
      }, 50);
    });
  };

  // Start the timer
  startTimer = () => {
    if (!this.state.isRunning && this._isMounted) {
      this.timer = setInterval(() => {
        // Check if component is still mounted before updating state
        if (!this._isMounted) {
          if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
          }
          return;
        }

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

    // Calculate completion percentage, ensuring it never goes below 0%
    const calculatedPerc =
      totalChanges > 0
        ? 100 - Math.round((charChangesRamaining / totalChanges) * 100)
        : 100;

    this.setState({
      completionPerc: Math.max(0, calculatedPerc),
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

  componentDidMount() {
    this._isMounted = true;
    // Calculate initial stats
    this.calculateSpeed();
    this.calculateCompletion();
    // Ensure timer is running (in case it didn't start in constructor)
    if (!this.state.isRunning && !this.timer) {
      this.startTimer();
    }
    // Add keyboard event listener for hotkeys
    window.addEventListener("keydown", this.handleKeyPress);
  }

  // Clear the timer interval when the component unmounts
  componentWillUnmount() {
    this._isMounted = false;
    // Clear timer
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    // Dispose DiffEditor if it exists
    if (this.diffEditorRef) {
      try {
        this.diffEditorRef.dispose();
      } catch (error) {
        // Ignore disposal errors as editor may already be disposed
        console.warn("DiffEditor disposal warning:", error);
      }
      this.diffEditorRef = null;
    }
    // Remove keyboard event listener
    window.removeEventListener("keydown", this.handleKeyPress);
  }

  // Handle DiffEditor mount
  handleDiffEditorDidMount = (editor: any) => {
    this.diffEditorRef = editor;
  };

  handleKeyPress = (event: KeyboardEvent) => {
    // Ctrl+R for reset (or Cmd+R on Mac)
    if ((event.ctrlKey || event.metaKey) && event.key === "r") {
      event.preventDefault();
      this.resetProblem();
    }
    // Ctrl+S for skip (or Cmd+S on Mac)
    if ((event.ctrlKey || event.metaKey) && event.key === "s") {
      event.preventDefault();
      this.skipProblem();
    }
  };

  handleChange = (value: string | undefined) => {
    const newText = value || "";
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
        <div className="editor-buttons">
          <button
            className="reset-button"
            onClick={() => {
              this.resetProblem();
            }}
            title="Reset (Ctrl+R)"
          >
            Reset
          </button>
          <button
            className="skip-button"
            onClick={() => {
              this.skipProblem();
            }}
            title="Skip (Ctrl+S)"
          >
            Skip
          </button>
        </div>
        <div className="form-container">
          <div className="form-editor">
            <div className="form monaco-editor-wrapper">
              <MonacoEditor
                height="80vh"
                language="typescript"
                theme="vs-dark"
                value={this.state.problem.currentText}
                onChange={this.handleChange}
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 18,
                  fontFamily: "Consolas, Monaco, 'Courier New', monospace",
                  lineHeight: 25.6,
                  padding: { top: 24, bottom: 24 },
                  wordWrap: "on",
                  automaticLayout: true,
                  tabSize: 2,
                  insertSpaces: true,
                  renderWhitespace: "all",
                  roundedSelection: false,
                  scrollbar: {
                    verticalScrollbarSize: 8,
                    horizontalScrollbarSize: 8,
                  },
                }}
              />
            </div>
          </div>
          <div className="form-diff">
            <div className="form monaco-editor-wrapper">
              {this._isMounted && this.state.showDiffEditor && (
                <DiffEditor
                  key={this.state.problem.problemId}
                  height="80vh"
                  language="typescript"
                  theme="vs-dark"
                  original={this.state.problem.currentText}
                  modified={this.state.problem.modifiedText}
                  onMount={this.handleDiffEditorDidMount}
                  options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 18,
                    fontFamily: "Consolas, Monaco, 'Courier New', monospace",
                    lineHeight: 25.6,
                    padding: { top: 24, bottom: 24 },
                    wordWrap: "on",
                    automaticLayout: true,
                    readOnly: true,
                    scrollbar: {
                      verticalScrollbarSize: 8,
                      horizontalScrollbarSize: 8,
                    },
                    renderSideBySide: true,
                    ignoreTrimWhitespace: false,
                    renderIndicators: true,
                    originalEditable: false,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Editor;
