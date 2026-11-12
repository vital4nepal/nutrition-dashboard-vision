import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { Line, Dot } from 'recharts';
import { LineChart } from 'recharts';

interface OutputChartProps {
  data: {
    name: string;
    value: number;
  }[];
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
  dataKey?: string;
  barSize?: number;
  referenceValue?: number;
  referenceLabel?: string;
}

const OutputChart = ({ data, title, dataKey = "name", barSize = 50, referenceValue, referenceLabel }: OutputChartProps) => {
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile screens
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    // Initial check
    checkIfMobile();
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-[#22C55E]">
            Value: {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: isMobile ? 20 : 0,
            left: isMobile ? 20 : 0,
            bottom: isMobile ? 10 : 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
          <XAxis 
            dataKey={dataKey} 
            tick={{ fontSize: isMobile ? 10 : 12 }}
            angle={0}
            textAnchor="middle"
            height={isMobile ? 30 : 60}
            tickMargin={isMobile ? 5 : 10}
            interval={isMobile ? 1 : 0}
          />
          <YAxis 
            tick={{ fontSize: isMobile ? 10 : 12 }}
            width={isMobile ? 48 : 60}
            tickFormatter={(value) => value.toLocaleString()}
            tickCount={isMobile ? 4 : 5}
          />
          <Tooltip content={<CustomTooltip />} />
          {referenceValue !== undefined && (
            <ReferenceLine
              y={referenceValue}
              stroke="#EF4444"
              strokeDasharray="6 4"
              ifOverflow="extendDomain"
              label={{ value: `${referenceLabel ?? 'Target'}: ${referenceValue}%`, position: 'insideTopRight', fontSize: isMobile ? 10 : 12, fill: '#EF4444' }}
            />
          )}

          <Bar
            dataKey="value" 
            fill="#22C55E"
            radius={[4, 4, 0, 0]}
            name={title}
            barSize={isMobile ? barSize * 0.7 : barSize}
            animationDuration={750}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const LollipopChart = ({ data, title }: OutputChartProps) => {
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile screens
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    // Initial check
    checkIfMobile();
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-[#EF4444]">
            Value: {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: isMobile ? 10 : 30,
            left: isMobile ? 0 : 40,
            bottom: isMobile ? 30 : 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: isMobile ? 10 : 12 }}
            angle={0}
            textAnchor="middle"
            height={isMobile ? 30 : 60}
            tickMargin={isMobile ? 5 : 10}
            interval={isMobile ? 1 : 0}
          />
          <YAxis 
            tick={{ fontSize: isMobile ? 10 : 12 }}
            width={isMobile ? 48 : 60}
            tickFormatter={(value) => value.toLocaleString()}
            tickCount={isMobile ? 4 : 5}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#EF4444" 
            strokeWidth={2}
            dot={{ r: isMobile ? 3 : 5, fill: "#EF4444", strokeWidth: 0 }}
            activeDot={{ r: isMobile ? 6 : 8, fill: "#EF4444" }}
            isAnimationActive={true}
            animationDuration={750}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OutputChart;
