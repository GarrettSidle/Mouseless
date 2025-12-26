import Problem from "../../models/Problem";
import { problems } from "./EditorData";
import { isProblemCompleted } from "./EditorCalculations";

/**
 * Problem management utilities for the Editor component
 */
export class EditorProblemManager {
  /**
   * Get a random problem from the problems array
   */
  getRandomProblem = (): Problem => {
    const index = Math.floor(Math.random() * problems.length);
    return { ...problems[index] };
  };

  /**
   * Reset a problem to its original state
   */
  resetProblem = (problem: Problem): Problem => {
    return {
      ...problem,
      currentText: problem.originalText,
    };
  };

  /**
   * Check if a problem is completed
   */
  checkCompletion = (currentText: string, modifiedText: string): boolean => {
    return isProblemCompleted(currentText, modifiedText);
  };
}

