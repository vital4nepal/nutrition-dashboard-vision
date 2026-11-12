import React, { useState } from 'react';
import PageWrapper from '@/components/Layout/PageWrapper';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Download, Info } from 'lucide-react';
import { generateReport } from '@/utils/reportGenerator';
import { Button } from '@/components/ui/button';
import { historicalData } from '../data/historicalData';
import { whaTargets } from '../data/whaTargets';
import Modal from '@/components/ui/Modal';
import { whaTargetsInfo, indicatorDetailsInfo, remarksInfo } from '../data/infoContent';
import { useIsMobile } from '@/hooks/use-mobile';

const ProgressBar = ({ current, target, label }: { current: number; target: number; label: string }) => {
  const percentage = Math.min((current / target) * 100, 100);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span>{current}%</span>
      </div>
      <div className="h-4 bg-gray-200 rounded-full">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-xs text-gray-500">
        Target: {target}%
      </div>
    </div>
  );
};

const Impact = () => {
  usePageTitle('Impact Analysis');
  const [activeTab, setActiveTab] = useState('stunting');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const isMobile = useIsMobile();

  const getProgressData = (tab: string) => {
    const mapping: { [key: string]: { current: number; target: number; label: string } } = {
      stunting: { current: 24.7, target: 22.44, label: 'Stunting Reduction' },
      wasting: { current: 10.4, target: 5.0, label: 'Wasting Reduction' },
      anemia: { current: 35.0, target: 21.0, label: 'Anemia Reduction' },
      breastfeeding: { current: 56.0, target: 90.0, label: 'Exclusive Breastfeeding' },
    };
    return mapping[tab] || mapping.stunting;
  };

  const handleDownloadReport = () => {
    generateReport({
      outputData: [], // Add relevant data here
      inputMetrics: [], // Add relevant data here
      impactMetrics: whaTargets,
    });
  };

  const handleInfoClick = (content: string) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  return (
    <PageWrapper title="Impact Analysis">
      <div className="space-y-8 max-w-full">
        {/* WHA Targets Table */}
        <section className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-semibold">WHA Targets on Nutrition</h2>
            <Info className="text-[#22C55E] cursor-pointer ml-2" onClick={() => handleInfoClick(whaTargetsInfo)} />
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Indicator</TableHead>
                  <TableHead className="text-right w-[120px]">Target 2030</TableHead>
                  <TableHead className="text-right w-[120px]">Current</TableHead>
                  <TableHead className="text-right w-[200px]">Annual Rate of Reduction</TableHead>
                  <TableHead className="text-right w-[120px]">Required Rate</TableHead>
                  <TableHead className="text-right w-[120px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {whaTargets.map((target) => (
                  <TableRow key={target.indicator}>
                    <TableCell className="font-medium">{target.indicator}</TableCell>
                    <TableCell className="text-right">{target.target2030}%</TableCell>
                    <TableCell className="text-right">{target.current}%</TableCell>
                    <TableCell className="text-right">{target.annualReduction}%</TableCell>
                    <TableCell className="text-right">{target.requiredReduction}%</TableCell>
                    <TableCell className="text-right">
                      <span className={`${target.status === 'On Track' ? 'text-green-600' : 'text-red-600'}`}>
                        {target.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Indicator Details */}
        <section className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">Indicator Details</h2>
              <Info 
                className="text-[#22C55E] cursor-pointer" 
                onClick={() => handleInfoClick(indicatorDetailsInfo)}
              />
            </div>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full tabs-fix">
            <TabsList className="w-full">
              {[
                { value: 'stunting', label: 'Stunting' },
                { value: 'wasting', label: 'Wasting' },
                { value: 'anemia', label: 'Anemia' },
                { value: 'breastfeeding', label: 'Breastfeeding' }
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {['stunting', 'wasting', 'anemia', 'breastfeeding'].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-6">
                <div className="flex flex-col md:flex-row w-full gap-6">
                  <div className="bg-gray-50 p-5 rounded-lg flex-1 min-w-0">
                    <h3 className="text-lg font-semibold mb-4">Current Progress</h3>
                    <div className="mt-8">
                      <ProgressBar
                        current={getProgressData(tab).current}
                        target={getProgressData(tab).target}
                        label="Progress"
                      />
                    </div>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-lg flex-1 min-w-0">
                    <h3 className="text-lg font-semibold mb-4">Historical Trend</h3>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={historicalData[tab as keyof typeof historicalData]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#22C55E" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        {/* Remarks */}
        <section className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Remarks</h2>
          </div>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>All indicators show gradual improvement over the past 5 years</li>
            <li>Exclusive breastfeeding rates show the most significant positive trend</li>
            <li>Additional interventions needed to accelerate progress towards 2030 targets</li>
          </ul>
        </section>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="prose text-gray-600 max-w-3xl">
          <p className="text-sm md:text-base">{modalContent}</p>
        </div>
      </Modal>
    </PageWrapper>
  );
};

export default Impact;
