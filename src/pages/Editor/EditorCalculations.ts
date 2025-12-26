import * as Diff from "diff";
import Problem from "../../models/Problem";

/**
 * Normalize whitespace for comparison by replacing all whitespace with a single space
 */
export const normalizeWhitespace = (text: string): string => {
  return text.replace(/\s+/g, " ").trim();
};

/**
 * Calculate typing speed (CCPM - Characters Changed Per Minute)
 */
export const calculateSpeed = (
  currentText: string,
  originalText: string,
  elapsedSeconds: number
): number => {
  let changedCharCount = 0;
  const diffResult = Diff.diffChars(currentText, originalText);

  // Loop through the diffResult array
  for (let i = 0; i < diffResult.length; i++) {
    // Check if the element is added or removed
    if (diffResult[i].added || diffResult[i].removed) {
      changedCharCount += diffResult[i]?.count ?? 0;
    }
  }

  var wordsPerMin = Math.round(changedCharCount / (elapsedSeconds / 60));
  if (Number.isNaN(wordsPerMin)) {
    wordsPerMin = 0;
  }

  return wordsPerMin;
};

/**
 * Calculate completion percentage based on how close currentText is to modifiedText
 */
export const calculateCompletion = (
  currentText: string,
  originalText: string,
  modifiedText: string
): number => {
  let charChangesRamaining = 0;
  let totalChanges = 0;

  // Calculate remaining changes
  var diffResult = Diff.diffChars(currentText, modifiedText);
  for (let i = 0; i < diffResult.length; i++) {
    if (diffResult[i].added || diffResult[i].removed) {
      charChangesRamaining += diffResult[i]?.count ?? 0;
    }
  }

  // Calculate total changes needed
  var diffResult = Diff.diffChars(originalText, modifiedText);
  for (let i = 0; i < diffResult.length; i++) {
    if (diffResult[i].added || diffResult[i].removed) {
      totalChanges += diffResult[i]?.count ?? 0;
    }
  }

  // Calculate completion percentage, ensuring it never goes below 0%
  const calculatedPerc =
    totalChanges > 0
      ? 100 - Math.round((charChangesRamaining / totalChanges) * 100)
      : 100;

  return Math.max(0, calculatedPerc);
};

/**
 * Check if the problem is completed by comparing normalized texts
 */
export const isProblemCompleted = (
  currentText: string,
  modifiedText: string
): boolean => {
  const normalizedCurrent = normalizeWhitespace(currentText);
  const normalizedTarget = normalizeWhitespace(modifiedText);
  return normalizedCurrent === normalizedTarget;
};

