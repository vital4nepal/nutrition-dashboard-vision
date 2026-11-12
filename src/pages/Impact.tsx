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

const START_YEAR = historicalData.stunting[0].year;

// Share of the distance from the start value to the target that is covered.
// The sign of (target - start) handles both lower-is-better and higher-is-better.
const progressShare = (start: number, current: number, target: number) =>
  Math.min(Math.max(((current - start) / (target - start)) * 100, 0), 100);

const ProgressBar = ({ start, current, target }: { start: number; current: number; target: number }) => {
  const percentage = progressShare(start, current, target);

  return (
    <div className="space-y-3">
      <p className="text-sm">
        <span className="font-semibold">{Math.round(percentage)}%</span> of the way from the {START_YEAR} value to the 2030 target
      </p>
      <div className="relative h-4 bg-gray-200 rounded-full">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
        <div className="absolute -top-1 -bottom-1 right-0 w-0.5 bg-gray-700" aria-hidden="true" />
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>{START_YEAR}: {start}%</span>
        <span className="font-medium text-gray-900">Now: {current}%</span>
        <span>Target 2030: {target}%</span>
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
    const row = whaTargets.find((t) => t.indicator.toLowerCase() === tab) ?? whaTargets[0];
    const series = historicalData[row.indicator.toLowerCase() as keyof typeof historicalData];
    return { start: series[0].value, current: row.current, target: row.target2030 };
  };

  const offTrack = whaTargets.filter((t) => t.status !== 'On Track');
  const onTrack = whaTargets.filter((t) => t.status === 'On Track');

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
                        {...getProgressData(tab)}
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
            <li>All four indicators have moved toward their 2030 targets since {START_YEAR}</li>
            <li>On Track: {onTrack.map((t) => t.indicator).join(', ')}</li>
            {offTrack.map((t) => (
              <li key={t.indicator}>
                Off Track: {t.indicator} annual rate is {t.annualReduction}%, required rate is {t.requiredReduction}%
              </li>
            ))}
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
