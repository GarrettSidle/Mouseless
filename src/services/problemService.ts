import { getRequest } from "../utils/api";
import Problem from "../models/Problem";

/**
 * API response structure from the backend
 */
interface ProblemResponse {
  id: number;
  name: string;
  original_text: string;
  modified_text: string;
  problem_id: string;
  best_time: number | null;
  best_key_strokes: number | null;
  best_ccpm: number | null;
  time_histogram: number[] | null;
  strokes_histogram: number[] | null;
  ccpm_histogram: number[] | null;
}

/**
 * Map API response to frontend Problem interface
 */
function mapApiResponseToProblem(apiResponse: ProblemResponse): Problem {
  return {
    originalText: apiResponse.original_text,
    modifiedText: apiResponse.modified_text,
    currentText: apiResponse.original_text, // Start with original text
    problemId: apiResponse.problem_id,
    id: apiResponse.id, // Store the numeric ID for API submissions
    problemStats: {
      // Use histogram data from API, or empty arrays if not available
      timeStats: apiResponse.time_histogram || [],
      CCPMStats: apiResponse.ccpm_histogram || [],
      keyStroksStats: apiResponse.strokes_histogram || [],
    },
    bestTime: apiResponse.best_time || null,
    bestKeyStrokes: apiResponse.best_key_strokes || null,
    bestCCPM: apiResponse.best_ccpm || null,
  };
}

/**
 * Fetch a random problem from the API
 */
export async function fetchRandomProblem(): Promise<Problem> {
  try {
    const response = await getRequest<ProblemResponse>({
      endpoint: "/api/problems/random",
    });
    return mapApiResponseToProblem(response);
  } catch (error) {
    console.error("Error fetching problem from API:", error);
    throw error;
  }
}
