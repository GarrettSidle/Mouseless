import Problem from "../../models/Problem";
import ColorMap from "../../models/ColorMap";

export const problems: Problem[] = [
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

export interface EditorFormState {
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

export const timerColorMap: ColorMap = {
  upperCutoff: 30,
  centerCutoff: 15,
  isInverted: true,
};

export const speedColorMap: ColorMap = {
  upperCutoff: 75,
  centerCutoff: 50,
  isInverted: false,
};

export const completionColorMap: ColorMap = {
  upperCutoff: 75,
  centerCutoff: 50,
  isInverted: false,
};

export const strokesColorMap: ColorMap = {
  upperCutoff: 30,
  centerCutoff: 15,
  isInverted: true,
};

