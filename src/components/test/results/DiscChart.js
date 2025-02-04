// src/components/tests/results/DiscChart.jsx
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid
} from 'recharts';

const DiscChart = ({ results }) => {
  if (!results) return null;

  // Transform the DISC results into data points for the chart
  const chartData = [
    { name: 'D', value: results.D },
    { name: 'I', value: results.I },
    { name: 'S', value: results.S },
    { name: 'C', value: results.C }
  ];

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#8B2332', fontSize: 14, fontWeight: 'bold' }}
          />
          <YAxis 
            domain={[-28, 28]}
            ticks={[-28, -20, -10, 0, 10, 20, 28]}
            tick={{ fontSize: 12 }}
          />
          <Tooltip />
          <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
          <Line
            type="linear"
            dataKey="value"
            stroke="#8B2332"
            strokeWidth={2}
            dot={{
              r: 6,
              fill: "#8B2332",
              stroke: "#8B2332"
            }}
            activeDot={{
              r: 8,
              stroke: "#8B2332",
              strokeWidth: 2
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DiscChart;