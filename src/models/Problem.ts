interface Problem {
    originalText: string;
    modifiedText: string;
    currentText : string;
    problemId : string;
    id? : number; // Numeric ID from the API (optional for backward compatibility)
    problemStats : ProblemStats;
    bestTime? : number | null; // Best time for this user (if logged in)
    bestKeyStrokes? : number | null; // Best key strokes for this user (if logged in)
    bestCCPM? : number | null; // Best CCPM for this user (if logged in)
  }


  interface ProblemStats{
    timeStats: number[];
    CCPMStats: number[];
    keyStroksStats: number[];
  }


  export default Problem;