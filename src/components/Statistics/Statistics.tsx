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
  resetProblem: () => void;
  skipProblem: () => void;
}

const CustomLegend = () => (
  <div className="legend">
    <div className="legend-item legend-you">
      <div />
      <span>Current Attempt 👤</span>
    </div>
    <div className="legend-item legend-personal-best">
      <div />
      <span>Personal Best 👑</span>
    </div>
  </div>
);

class Statistics extends Component<StatisticsProps> {
  // Helper function to create histogram data for Recharts
  private createHistogramData(data: number[], userPosition: number) {
    return data.map((value, index) => ({
      name: `${index + 1}`,
      x: value,
    }));
  }

  render() {
    const { problem, userPositionTime, userPositionStrokes, userPositionCCPM } =
      this.props;

    const timeHistogramData = this.createHistogramData(
      problem.problemStats.timeStats,
      userPositionTime
    );
    const strokesHistogramData = this.createHistogramData(
      problem.problemStats.keyStroksStats,
      userPositionStrokes
    );
    const ccpnHistogramData = this.createHistogramData(
      problem.problemStats.CCPMStats,
      userPositionCCPM
    );

    // Common chart layout options
    const renderHistogram = (data: any[], title: string, xLabel: string) => (
      <div className="chart-container">
        <h2>{title}</h2>
        <div className="chart-stats-container">
          <div className="chart-percentile">You Beat 50% of Users</div>
          <div className="user-value">Your Time : 0:00</div>
        </div>

        <ResponsiveContainer className="chart" width="80%" height={150}>
          <BarChart
            data={data}
            barCategoryGap={0}
            margin={{ top: 20, bottom: 15 }}
          >
            <XAxis
              dataKey="name"
              type="number"
              domain={[0, data.length]}
              label={{ value: xLabel, position: "insideBottom", offset: -4 }}
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
            <ReferenceLine
              x={5}
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
              x={5}
              stroke="green"
              isFront={true}
              strokeWidth={3}
              label={{
                value: "👤",
                position: "top",
                style: { fill: "green", fontWeight: "bold" },
              }}
            />
            <ReferenceLine
              x={20}
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
              x={20}
              stroke="gold"
              isFront={true}
              strokeWidth={3}
              label={{
                value: "👑",
                position: "top",
                style: { fill: "gold", fontWeight: "bold" },
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );

    return (
      <div className="stats-overlay">
        <div className="statistics">
          <h1>Problem {this.props.problem.problemId} Statistics</h1>
          <div className="charts-container">
            <CustomLegend />
            <hr />
            {renderHistogram(
              timeHistogramData,
              "User Solution Time",
              "Time (Seconds)"
            )}
            <hr />
            {renderHistogram(
              strokesHistogramData,
              "User Key Strokes",
              "Key Strokes"
            )}
            <hr />
            {renderHistogram(
              ccpnHistogramData,
              "User CCPM",
              "Characters Changed Per Minute"
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
