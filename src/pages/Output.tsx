import React, { useState } from 'react';
import PageWrapper from '@/components/Layout/PageWrapper';
import { usePageTitle } from '@/hooks/usePageTitle';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OutputChart from '@/components/Dashboard/OutputChart';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Upload } from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { monthlyData } from '../data/monthlyData';
import { Info } from "lucide-react";
import Modal from '@/components/ui/Modal';
import { monthlyProgressInfo, cumulativeValuesInfo, annualTargetProgressInfo } from '../data/infoContent';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const indicators = [
  'Children under five measured',
  'Acute malnutrition treatment',
  'Counseling sessions provided',
  'IFA tablets distributed',
  'Nutrition counseling (pregnant)',
  'Pregnant women weighed',
];

const COLORS = ['#22C55E', '#E5E7EB'];

const Output = () => {
  usePageTitle('Output Analysis');
  const [selectedIndicator, setSelectedIndicator] = useState(indicators[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  
  const data = monthlyData[selectedIndicator] || [];
  const cumulativeData = data.map((item, index) => ({
    month: item.month,
    value: data.slice(0, index + 1).reduce((sum, d) => sum + d.value, 0),
  }));

  const totalReached = cumulativeData[cumulativeData.length - 1]?.value || 0;
  const annualTarget = 150000;
  const monthlyTarget = 12500;
  const percentageReached = ((totalReached / annualTarget) * 100).toFixed(2);
  const isOnTrack = totalReached >= (annualTarget / 2);

  const pieData = [
    { name: 'Reached', value: totalReached },
    { name: 'Remaining', value: Math.max(0, annualTarget - totalReached) },
  ];

  const handleInfoClick = (content: string) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  return (
    <PageWrapper title="Output Analysis">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="w-full md:w-64">
            <Select
              value={selectedIndicator}
              onValueChange={setSelectedIndicator}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an indicator" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg">
                {indicators.map((indicator) => (
                  <SelectItem key={indicator} value={indicator}>
                    {indicator}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Monthly Bar Chart */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <h3 className="text-lg font-semibold">Monthly Progress</h3>
            <Info className="text-[#22C55E] cursor-pointer ml-2" onClick={() => handleInfoClick(monthlyProgressInfo)} />
          </div>
          <div className="h-[400px]">
            <OutputChart 
              data={data} 
              title="Monthly Progress"
              xAxisLabel="Month"
              yAxisLabel="Value"
              dataKey="month"
            />
          </div>
        </div>

        {/* Cumulative Line Chart */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <h3 className="text-lg font-semibold">Cumulative Values</h3>
            <Info className="text-[#22C55E] cursor-pointer ml-2" onClick={() => handleInfoClick(cumulativeValuesInfo)} />
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cumulativeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  hide={window.innerWidth < 640}
                />
                <YAxis />
                <Tooltip formatter={(value) => `${value}`}
  labelFormatter={(monthLabel) => `${monthLabel}`} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#22C55E" 
                  dot={{ fill: '#22C55E' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Annual Target Progress */}
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
          <div className="flex items-center mb-6">
            <h3 className="text-lg font-semibold">Annual Target Progress</h3>
            <Info className="text-[#22C55E] cursor-pointer ml-2" onClick={() => handleInfoClick(annualTargetProgressInfo)} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left side - Pie Chart */}
            <div className="relative h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              {/* Center text in pie chart */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-[#22C55E]">{percentageReached}%</span>
                <span className="text-sm text-gray-500">Complete</span>
              </div>
            </div>

            {/* Right side - Stats */}
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Annual Target</h4>
                  <p className="text-2xl font-bold text-gray-900">{annualTarget.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Monthly Target</h4>
                  <p className="text-2xl font-bold text-gray-900">{monthlyTarget.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Total Reached</h4>
                  <p className="text-2xl font-bold text-gray-900">{totalReached.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Remaining</h4>
                  <p className="text-2xl font-bold text-gray-900">{(annualTarget - totalReached).toLocaleString()}</p>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Current Status</h4>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      isOnTrack ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {isOnTrack ? 'On Track' : 'Off Track'}
                    </div>
                  </div>
                  {!isOnTrack && (
                    <div className="flex items-center text-red-600">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      <span className="text-sm font-medium">
                        {(100 - Number(percentageReached)).toFixed(1)}% behind target
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="prose text-gray-600 max-w-3xl">
          <p className="text-sm md:text-base">{modalContent}</p>
        </div>
      </Modal>
    </PageWrapper>
  );
};

export default Output;
