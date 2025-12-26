import Problem from "../../models/Problem";
import { isProblemCompleted } from "./EditorCalculations";
import { fetchRandomProblem } from "../../services/problemService";

/**
 * Problem management utilities for the Editor component
 */
export class EditorProblemManager {
  /**
   * Get a random problem from the API
   */
  getRandomProblem = async (): Promise<Problem> => {
    return await fetchRandomProblem();
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

