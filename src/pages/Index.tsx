import React from 'react';
import PageWrapper from '@/components/Layout/PageWrapper';
import OutputChart from '@/components/Dashboard/OutputChart';
import MetricCard from '@/components/Dashboard/MetricCard';
import ProgressBar from '@/components/Dashboard/ProgressBar';
import { Download, Info, TrendingUp, TrendingDown, AlertCircle, CheckCircle2 } from 'lucide-react';
import { generateReport } from '@/utils/reportGenerator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import sidartLogo from '../nutrition_logo333.png';
import Modal from '@/components/ui/Modal';
import { childNutritionInfo, maternalNutritionInfo } from '@/data/infoData';
import LollipopChart from '@/components/Dashboard/OutputChart';
import { useData } from '@/context/DataContext';

const options = {
  scales: {
    y: {
      type: 'logarithmic',
      beginAtZero: true,
      title: {
        display: true,
        text: 'Value'
      }
    }
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: function(context) {
          return `Value: ${context.raw}`;
        }
      }
    }
  }
};

const Index = () => {
  const { 
    childrenData, 
    maternalData, 
    inputMetrics, 
    impactMetrics,
    updateChildrenData,
    updateMaternalData
  } = useData();
  
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalContent, setModalContent] = React.useState('');

  const handleDownloadReport = () => {
    generateReport({
      outputData: [...childrenData, ...maternalData],
      inputMetrics,
      impactMetrics,
    });
  };

  const handleDataInput = (index: number, dataSet: 'children' | 'maternal', value: string) => {
    const parsedValue = parseInt(value, 10);
    if (!isNaN(parsedValue)) {
      if (dataSet === 'children') {
        const newData = [...childrenData];
          newData[index] = { ...newData[index], value: parsedValue };
        updateChildrenData(newData);
      } else {
        const newData = [...maternalData];
          newData[index] = { ...newData[index], value: parsedValue };
        updateMaternalData(newData);
      }
    }
  };

  const handleChildInfoClick = () => {
    setModalContent(childNutritionInfo);
    setIsModalOpen(true);
  };

  const handleMaternalInfoClick = () => {
    setModalContent(maternalNutritionInfo);
    setIsModalOpen(true);
  };

  return (
    <PageWrapper>
      <div className="space-y-8">
        <section className="bg-gradient-to-r from-[#F2FCE2] to-[#E5F2E5] p-4 md:p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#22C55E]">
                NutriPulse Nepal
            </h2>
              <p className="text-gray-600">
                NutriPulse Nepal is a cutting-edge online dashboard offering real-time insights into Nepal's key nutrition indicators—from impact and outcomes to outputs and interventions. By tracking performance and trends, and highlighting areas needing attention, it empowers policymakers and practitioners to drive data-informed, accountable actions for nutrition improvements.
              </p>
              <p className="text-gray-600">
                Key features include:
              </p>
              <ul className="list-disc list-inside text-gray-600">
                <li>Monitoring of essential child nutrition indicators</li>
                <li>Tracking of crucial maternal health metrics</li>
                <li>Regional performance analysis across provinces</li>
                <li>Progress tracking towards national health goals</li>
                <li>Direct communication channel with health authorities</li>
              </ul>
            </div>
          </div>
        </section>

        {/* OPTION 3: COMBINED LAYOUT - Child at top (full width), Maternal and Monthly side-by-side below */}
        <div className="space-y-2">
          {/* Child Nutrition Indicators - Full Width, Side by Side Charts */}
          <section className="bg-white rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <h2 className="text-lg font-semibold text-[#22C55E]">
            Child Nutrition Indicators
          </h2>
              <Info className="text-[#22C55E] cursor-pointer ml-2" onClick={handleChildInfoClick} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Weight & Height Measured */}
              <div className="bg-[#F8FFF3] p-3 rounded-lg border border-[#E5F2E5]">
                <h3 className="text-sm font-medium text-gray-700 mb-0 flex items-center">
                  <TrendingUp className="h-4 w-4 text-[#22C55E] mr-1" />
                  Weight & Height Measured
                </h3>
                <div className="h-[220px]">
                  <OutputChart 
                    data={[childrenData[0]]}
                    title="Weight & Height Measured"
                    xAxisLabel="Month"
                    yAxisLabel="Value"
                    dataKey="name"
                    barSize={50}
                  />
                </div>
              </div>

              {/* Treated for Malnutrition */}
              <div className="bg-[#F8FFF3] p-3 rounded-lg border border-[#E5F2E5]">
                <h3 className="text-sm font-medium text-gray-700 mb-0 flex items-center">
                  <TrendingDown className="h-4 w-4 text-amber-500 mr-1" />
                  Treated for Malnutrition
                </h3>
                <div className="h-[220px]">
                  <OutputChart 
                    data={[childrenData[2]]}
                    title="Treated for Malnutrition"
                    xAxisLabel="Month"
                    yAxisLabel="Value"
                    dataKey="name"
                    barSize={50}
                  />
                </div>
              </div>

              {/* Counseling Sessions */}
              <div className="bg-[#F8FFF3] p-3 rounded-lg border border-[#E5F2E5]">
                <h3 className="text-sm font-medium text-gray-700 mb-0 flex items-center">
                  <TrendingUp className="h-4 w-4 text-[#22C55E] mr-1" />
                  Counseling Sessions
                </h3>
                <div className="h-[220px]">
              <OutputChart 
                    data={[childrenData[1]]}
                    title="Counseling Sessions"
                xAxisLabel="Month"
                yAxisLabel="Value"
                    dataKey="name"
                    barSize={50}
              />
                </div>
            </div>
          </div>
        </section>

          {/* Maternal + Monthly Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Maternal Nutrition Indicators - 8 columns */}
            <section className="md:col-span-8 bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <h2 className="text-lg font-semibold text-[#EF4444]">
            Maternal Nutrition Indicators
          </h2>
                <Info className="text-[#EF4444] cursor-pointer ml-2" onClick={handleMaternalInfoClick} />
              </div>
              
              <div className="h-[300px] bg-white p-3 rounded-lg border border-[#FECACA] mb-3">
                <LollipopChart
                data={maternalData}
                title="Maternal Nutrition Outputs"
                xAxisLabel="Month"
                yAxisLabel="Value"
                  dataKey="name"
                />
              </div>
              
              {/* Additional maternal stats */}
           
            </section>

            {/* Monthly Highlights - 4 columns */}
            <section className="md:col-span-4 bg-white p-4 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-[#6366F1] mb-4">Monthly Highlights</h2>
              
              <div className="bg-[#F5F7FF] p-3 rounded-lg border border-[#E0E7FF] mb-4">
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-[#6366F1] mr-2 mt-0.5 flex-shrink-0" />
                    <span>March 2023 data now available</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-[#6366F1] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Q1 2023 nutrition indicators updated</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-[#6366F1] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Coverage expanded to 77 districts</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-[#6366F1] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Enhanced district-level reporting system</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-[#6366F1] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Improved data quality measures in place</span>
                  </li>
                </ul>
              </div>
              
              {/* Progress bars */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Data Completion</span>
                    <span>85%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-full bg-[#6366F1] rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Target Achievement</span>
                    <span>62%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-full bg-[#6366F1] rounded-full" style={{ width: '62%' }}></div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Impact Indicators section - Mobile Optimized */}
        <section className="bg-[#F2FCE2] p-4 md:p-5 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-semibold text-[#22C55E]">
              Impact Indicators
            </h2>
            <Info className="text-[#22C55E] cursor-pointer ml-2" onClick={handleChildInfoClick} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {impactMetrics.map((metric) => {
              // Determine if this is a reduction metric (where lower is better)
              const isReduction = metric.label.toLowerCase().includes('prevalence');
              
              return (
                <div key={metric.label} className="bg-white p-4 rounded-lg shadow-sm">
                  <ProgressBar
                    label={metric.label}
                    current={metric.current}
                    target={metric.target}
                    isReduction={isReduction}
              />
            </div>  
              );
            })}
          </div>
        </section>

        {/* Input Indicators section - Mobile Optimized */}
        <section className="bg-[#F2FCE2] p-4 md:p-5 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-semibold text-[#22C55E]">
            Input Indicators
          </h2>
            <Info className="text-[#22C55E] cursor-pointer ml-2" onClick={handleChildInfoClick} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {inputMetrics.map((metric) => (
              <MetricCard
                key={metric.title}
                title={metric.title}
                value={metric.value}
                subtitle={`${metric.percentage} (${metric.value} out of ${metric.total})`}
                className="bg-white"
              />
            ))}
          </div>
        </section>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="prose text-gray-600 max-w-3xl">
            <p className="text-sm md:text-base">{modalContent}</p>
          </div>
        </Modal>
      </div>
    </PageWrapper>
  );
};

export default Index;
