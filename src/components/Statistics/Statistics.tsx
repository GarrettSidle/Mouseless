import { Component } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";
import "./Statistics.css";
import Problem from "../../models/Problem";

interface StatisticsProps {
  problem: Problem;
  userPositionTime: number;
  userPositionStrokes: number;
  userPositionCCPM: number;
  currentTime: number; // Current time in seconds
  currentStrokes: number; // Current key strokes
  currentCCPM: number; // Current CCPM
  resetProblem: () => void;
  skipProblem: () => void;
  isLoggedIn: boolean; // Whether the user is logged in
}

const CustomLegend = ({ isLoggedIn }: { isLoggedIn: boolean }) => (
  <div className={`legend ${!isLoggedIn ? "legend-centered" : ""}`}>
    <div className="legend-item legend-you">
      <div />
      <span>Current Attempt 👤</span>
    </div>
    {isLoggedIn && (
      <div className="legend-item legend-personal-best">
        <div />
        <span>Personal Best 👑</span>
      </div>
    )}
  </div>
);

class Statistics extends Component<StatisticsProps> {
  // Helper function to calculate bin index from a value
  // First bar (bin 0) covers 0 to bin_width/2, subsequent bars cover bin_width intervals
  private calculateBinIndex(value: number, binWidth: number): number {
    const halfWidth = binWidth / 2.0;
    let binIndex: number;

    if (value <= halfWidth) {
      binIndex = 0;
    } else {
      // For values > half_width, calculate bin index
      binIndex = Math.round((value - halfWidth) / binWidth) + 1;
    }

    return binIndex >= 0 && binIndex < 25 ? binIndex : -1;
  }

  // Helper function to create histogram data for Recharts
  // Data is stored as counts per bin: array[bin_index] = count
  // First bar (bin 0) covers 0 to binWidth/2, subsequent bars cover binWidth intervals
  private createHistogramData(
    counts: number[],
    binWidth: number,
    decimalPlaces: number = 2
  ) {
    return counts.map((count, binIndex) => {
      // Calculate bin center value for label (middle of the bin range)
      let binCenter: number;
      if (binIndex === 0) {
        // Bin 0: 0 to binWidth/2, center = binWidth / 4
        binCenter = binWidth / 4;
      } else {
        // Bin n (n>=1): from (binWidth/2 + (n-1)*binWidth) to (binWidth/2 + n*binWidth)
        // Center = binWidth/2 + (n-1)*binWidth + binWidth/2 = binWidth/2 + (n-0.5)*binWidth
        binCenter = binWidth / 2 + (binIndex - 0.5) * binWidth;
      }
      // Only show label for odd-indexed bars starting from index 1 (1, 3, 5, 7, etc.)
      const label =
        binIndex >= 1 && binIndex % 2 === 1
          ? binCenter.toFixed(decimalPlaces)
          : "";
      return {
        name: binCenter.toFixed(2), // Always store bin center for reference line matching
        displayLabel: label, // Only display label for odd indices >= 1
        x: count, // Count of users in this bin
        binIndex: binIndex, // Store bin index for reference lines
      };
    });
  }

  // Calculate percentile: percentage of users with worse (higher for time/strokes, lower for CCPM) values
  private calculatePercentile(
    counts: number[],
    userBinIndex: number,
    isHigherBetter: boolean // true for CCPM (higher is better), false for time/strokes (lower is better)
  ): number {
    if (!counts || counts.length === 0 || userBinIndex < 0) return 0;

    // Calculate total users
    const totalUsers = counts.reduce((sum, count) => sum + count, 0);
    if (totalUsers === 0) return 0;

    let usersBeat = 0;
    if (isHigherBetter) {
      // For CCPM: count users in bins with lower indices (worse performance)
      for (let i = 0; i < userBinIndex; i++) {
        usersBeat += counts[i] || 0;
      }
    } else {
      // For time/strokes: count users in bins with higher indices (worse performance)
      for (let i = userBinIndex + 1; i < counts.length; i++) {
        usersBeat += counts[i] || 0;
      }
    }

    return Math.round((usersBeat / totalUsers) * 100);
  }

  // Format time as MM:SS.SS (with 2 decimal places for seconds)
  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const secsInt = Math.floor(secs);
    const secsDec = Math.round((secs - secsInt) * 100);
    return `${mins.toString().padStart(2, "0")}:${secsInt
      .toString()
      .padStart(2, "0")}.${secsDec.toString().padStart(2, "0")}`;
  }

  render() {
    const {
      problem,
      userPositionTime,
      userPositionStrokes,
      userPositionCCPM,
      currentTime,
      currentStrokes,
      currentCCPM,
      isLoggedIn,
    } = this.props;

    // Bin widths match backend: Time=2.5s, Strokes=5, CCPM=100
    const TIME_BIN_WIDTH = 2.5;
    const STROKES_BIN_WIDTH = 5.0;
    const CCPM_BIN_WIDTH = 100.0;

    const timeHistogramData = this.createHistogramData(
      problem.problemStats.timeStats,
      TIME_BIN_WIDTH,
      0 // Time: 0 decimal places
    );
    const strokesHistogramData = this.createHistogramData(
      problem.problemStats.keyStroksStats,
      STROKES_BIN_WIDTH,
      0 // Strokes: 0 decimal places
    );
    const ccpnHistogramData = this.createHistogramData(
      problem.problemStats.CCPMStats,
      CCPM_BIN_WIDTH,
      0 // CCPM: 0 decimal places
    );

    // Calculate best value bin indices (use current if better than best, or if best doesn't exist)
    // For time/strokes: lower is better, for CCPM: higher is better
    // Only calculate best values if user is logged in
    const effectiveBestTime =
      isLoggedIn &&
      problem.bestTime !== null &&
      problem.bestTime !== undefined &&
      problem.bestTime <= currentTime
        ? problem.bestTime
        : currentTime;
    const effectiveBestStrokes =
      isLoggedIn &&
      problem.bestKeyStrokes !== null &&
      problem.bestKeyStrokes !== undefined &&
      problem.bestKeyStrokes <= currentStrokes
        ? problem.bestKeyStrokes
        : currentStrokes;
    const effectiveBestCCPM =
      isLoggedIn &&
      problem.bestCCPM !== null &&
      problem.bestCCPM !== undefined &&
      problem.bestCCPM >= currentCCPM
        ? problem.bestCCPM
        : currentCCPM;

    // Only calculate best bin indices if user is logged in
    const bestTimeBinIndex = isLoggedIn
      ? this.calculateBinIndex(effectiveBestTime, TIME_BIN_WIDTH)
      : -1;
    const bestStrokesBinIndex = isLoggedIn
      ? this.calculateBinIndex(effectiveBestStrokes, STROKES_BIN_WIDTH)
      : -1;
    const bestCCPMBinIndex = isLoggedIn
      ? this.calculateBinIndex(effectiveBestCCPM, CCPM_BIN_WIDTH)
      : -1;

    // Check if current equals best for positioning
    const timeIsSame =
      userPositionTime === bestTimeBinIndex && userPositionTime >= 0;
    const strokesIsSame =
      userPositionStrokes === bestStrokesBinIndex && userPositionStrokes >= 0;
    const ccpnIsSame =
      userPositionCCPM === bestCCPMBinIndex && userPositionCCPM >= 0;

    // Common chart layout options
    const renderHistogram = (
      data: any[],
      title: string,
      xLabel: string,
      userBinIndex: number,
      bestBinIndex: number,
      binWidth: number,
      currentValue: number,
      formatValue: (val: number) => string,
      percentile: number,
      isSameBin: boolean,
      effectiveBestValue: number,
      userIsLoggedIn: boolean
    ) => {
      const bestValue = effectiveBestValue;

      // Update data to use exact value positions for bins containing user/best values
      // This allows reference lines to position at the exact value within the bar
      let dataWithExactPositions = data.map((item, idx) => {
        // Use exact value for bins containing user or best values
        if (idx === userBinIndex && userBinIndex >= 0) {
          return { ...item, name: currentValue.toFixed(2) };
        }
        if (
          idx === bestBinIndex &&
          bestBinIndex >= 0 &&
          bestBinIndex !== userBinIndex
        ) {
          return { ...item, name: bestValue.toFixed(2) };
        }
        return item; // Keep bin center for other bars
      });

      const userCategoryName =
        userBinIndex >= 0 ? currentValue.toFixed(2) : undefined;
      const bestCategoryName =
        bestBinIndex >= 0 ? bestValue.toFixed(2) : undefined;

      return (
        <div className="chart-container">
          <h2>{title}</h2>
          <div className="chart-stats-container">
            <div className="chart-percentile">
              You Beat {percentile}% of Users
            </div>
            <div className="user-value">
              {xLabel.includes("Time")
                ? "Your Time"
                : xLabel.includes("Strokes")
                ? "Your Strokes"
                : "Your CCPM"}
              : {formatValue(currentValue)}
            </div>
          </div>

          <ResponsiveContainer className="chart" width="80%" height={150}>
            <BarChart
              data={dataWithExactPositions}
              barCategoryGap={0}
              margin={{ top: 20, bottom: 15 }}
            >
              <XAxis
                dataKey="name"
                type="category"
                label={{ value: xLabel, position: "insideBottom", offset: -4 }}
                tickFormatter={(value, index) => {
                  // Only show label for odd-indexed bars starting from index 1 (1, 3, 5, 7, etc.)
                  // Use original data for display labels (bin centers), not the modified dataWithExactPositions
                  const dataPoint = data[index];
                  return dataPoint && dataPoint.displayLabel
                    ? dataPoint.displayLabel
                    : "";
                }}
              />
              <YAxis
                label={{
                  value: "# of Users",
                  angle: -90,
                  position: "insideLeft",
                  dy: 30,
                  dx: 15,
                }}
              />
              <Tooltip />
              <Bar dataKey="x" fill="rgba(54, 162, 235, 1)" />
              {userCategoryName && !isSameBin && (
                <>
                  <ReferenceLine
                    x={userCategoryName}
                    stroke="green"
                    isFront={true}
                    strokeWidth={3}
                    label={{
                      value: "You",
                      position: "bottom",
                      style: { fill: "green", fontWeight: "bold" },
                    }}
                  />
                  <ReferenceLine
                    x={userCategoryName}
                    stroke="green"
                    isFront={true}
                    strokeWidth={3}
                    label={{
                      value: "👤",
                      position: "top",
                      style: { fill: "green", fontWeight: "bold" },
                    }}
                  />
                </>
              )}
              {userIsLoggedIn && bestCategoryName && !isSameBin && (
                <>
                  <ReferenceLine
                    x={bestCategoryName}
                    stroke="gold"
                    isFront={true}
                    strokeWidth={3}
                    label={{
                      value: "PB",
                      position: "bottom",
                      style: { fill: "gold", fontWeight: "bold" },
                    }}
                  />
                  <ReferenceLine
                    x={bestCategoryName}
                    stroke="gold"
                    isFront={true}
                    strokeWidth={3}
                    label={{
                      value: "👑",
                      position: "top",
                      style: { fill: "gold", fontWeight: "bold" },
                    }}
                  />
                </>
              )}
              {userCategoryName && isSameBin && (
                <>
                  <ReferenceLine
                    x={userCategoryName}
                    stroke="green"
                    isFront={true}
                    strokeWidth={3}
                    label={{
                      value: "You",
                      position: "bottom",
                      style: { fill: "green", fontWeight: "bold" },
                      dy: 5,
                      dx: -10,
                    }}
                  />
                  <ReferenceLine
                    x={userCategoryName}
                    stroke="green"
                    isFront={true}
                    strokeWidth={3}
                    label={{
                      value: "👤",
                      position: "top",
                      style: { fill: "green", fontWeight: "bold" },
                      dy: -5,
                      dx: -10,
                    }}
                  />
                  {userIsLoggedIn && bestCategoryName && (
                    <>
                      <ReferenceLine
                        x={bestCategoryName}
                        stroke="gold"
                        isFront={true}
                        strokeWidth={3}
                        label={{
                          value: "PB",
                          position: "bottom",
                          style: { fill: "gold", fontWeight: "bold" },
                          dy: 5,
                          dx: 10,
                        }}
                      />
                      <ReferenceLine
                        x={bestCategoryName}
                        stroke="gold"
                        isFront={true}
                        strokeWidth={3}
                        label={{
                          value: "👑",
                          position: "top",
                          style: { fill: "gold", fontWeight: "bold" },
                          dy: -5,
                          dx: 10,
                        }}
                      />
                    </>
                  )}
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    };

    return (
      <div className="stats-overlay">
        <div className="statistics">
          <h1>Problem {this.props.problem.problemId} Statistics</h1>
          <div className="charts-container">
            <CustomLegend isLoggedIn={isLoggedIn} />
            <hr />
            {renderHistogram(
              timeHistogramData,
              "User Solution Time",
              "Time (Seconds)",
              userPositionTime,
              bestTimeBinIndex,
              TIME_BIN_WIDTH,
              currentTime,
              (val) => this.formatTime(val),
              this.calculatePercentile(
                problem.problemStats.timeStats,
                userPositionTime,
                false
              ),
              timeIsSame,
              effectiveBestTime,
              isLoggedIn
            )}
            <hr />
            {renderHistogram(
              strokesHistogramData,
              "User Key Strokes",
              "Key Strokes",
              userPositionStrokes,
              bestStrokesBinIndex,
              STROKES_BIN_WIDTH,
              currentStrokes,
              (val) => val.toString(),
              this.calculatePercentile(
                problem.problemStats.keyStroksStats,
                userPositionStrokes,
                false
              ),
              strokesIsSame,
              effectiveBestStrokes,
              isLoggedIn
            )}
            <hr />
            {renderHistogram(
              ccpnHistogramData,
              "User CCPM",
              "Characters Changed Per Minute",
              userPositionCCPM,
              bestCCPMBinIndex,
              CCPM_BIN_WIDTH,
              currentCCPM,
              (val) => Math.round(val).toString(),
              this.calculatePercentile(
                problem.problemStats.CCPMStats,
                userPositionCCPM,
                true
              ),
              ccpnIsSame,
              effectiveBestCCPM,
              isLoggedIn
            )}
          </div>
          <div className="button-container">
            <button
              onClick={() => {
                this.props.resetProblem();
              }}
              title="Reset (Ctrl+R)"
            >
              Retry
            </button>
            <button
              onClick={() => {
                this.props.skipProblem();
              }}
              title="Next Problem (Ctrl+S)"
            >
              Next Problem
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Statistics;
