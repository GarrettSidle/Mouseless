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
    problemStats: {
      // For now, use empty arrays. These could be populated from user stats later
      timeStats: [],
      CCPMStats: [],
      keyStroksStats: [],
    },
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
