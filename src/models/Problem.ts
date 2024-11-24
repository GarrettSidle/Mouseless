interface Problem {
    originalText: string;
    modifiedText: string;
    currentText : string;
    problemId : string;
    problemStats : ProblemStats;
  }


  interface ProblemStats{
    timeStats: number[];
    CCPMStats: number[];
    keyStroksStats: number[];
  }


  export default Problem;