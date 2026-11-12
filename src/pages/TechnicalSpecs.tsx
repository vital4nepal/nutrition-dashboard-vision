import React, { useEffect } from 'react';
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

const TechnicalSpecs = () => {
  usePageTitle('Technical Specifications');
  useEffect(() => {
    // Scroll to top smoothly when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const renderMobileCard = (data: { indicator: string; definition: string; target?: string; frequency?: string; }) => (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-3 border border-gray-100">
      <h3 className="font-medium text-gray-900">{data.indicator}</h3>
      <div className="text-sm text-gray-600 space-y-2">
        <p className="leading-relaxed">{data.definition}</p>
        {data.target && (
          <div className="flex justify-between items-center pt-2">
            <span className="text-gray-500">Target:</span>
            <span className="font-medium text-[#22C55E]">{data.target}</span>
          </div>
        )}
        {data.frequency && (
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Frequency:</span>
            <span>{data.frequency}</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderMethodCard = (data: { point: string; recording: string; reporting: string; method: string; }) => (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-3 border border-gray-100">
      <h3 className="font-medium text-gray-900">{data.point}</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Recording Person:</span>
          <span>{data.recording}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Reporting Person:</span>
          <span>{data.reporting}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Method:</span>
          <span>{data.method}</span>
        </div>
      </div>
    </div>
  );

  const maternalData = [
    {
      indicator: "Maternal Nutrition Counselling",
      definition: "Number of visits with pregnant and lactating women up to two years after birth with a counselling session on maternal nutrition divided by the total number of visits",
      target: "70%",
      frequency: "Monthly"
    },
    {
      indicator: "IFA Distribution",
      definition: "Percentage of pregnant women who received 180 IFA tablets during their pregnancy period",
      target: "80%",
      frequency: "Monthly"
    },
    {
      indicator: "Maternal Weight Monitoring",
      definition: "Percentage of pregnant women whose weight was monitored during ANC visits",
      target: "90%",
      frequency: "Monthly"
    }
  ];

  const childData = [
    {
      indicator: "Children Under Five Measured",
      definition: "Number of children under five years whose growth was monitored in the reporting period",
      target: "85%",
      frequency: "Monthly"
    },
    {
      indicator: "Acute Malnutrition Treatment",
      definition: "Number of children with severe acute malnutrition who received appropriate treatment",
      target: "95%",
      frequency: "Monthly"
    },
    {
      indicator: "Growth Monitoring",
      definition: "Percentage of children under 5 years who had their height/length measured",
      target: "80%",
      frequency: "Monthly"
    }
  ];

  const methodsData = [
    {
      point: "Community Clinics",
      recording: "CHCP",
      reporting: "CHCP",
      method: "Maternal Register"
    },
    {
      point: "Home Visits",
      recording: "CHCP",
      reporting: "FWA",
      method: "FW Register"
    },
    {
      point: "Family Welfare Center",
      recording: "FWV",
      reporting: "CHCP",
      method: "Pregnant Mother Register"
    }
  ];

  return (
    <PageWrapper title="Technical Specifications">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Tabs defaultValue="maternal" className="w-full">
          <div className="overflow-x-auto pb-2">
            <TabsList className="inline-flex w-full md:w-auto min-w-full md:min-w-0 h-10 items-center justify-start md:justify-center text-muted-foreground rounded-lg p-1 bg-muted">
              <TabsTrigger 
                value="maternal" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Maternal Indicators
              </TabsTrigger>
              <TabsTrigger 
                value="child"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Child Indicators
              </TabsTrigger>
              <TabsTrigger 
                value="methods"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Data Collection Methods
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Mobile View */}
          <div className="md:hidden mt-6">
            <TabsContent value="maternal" className="space-y-4">
              {maternalData.map((item, index) => (
                <div key={index}>{renderMobileCard(item)}</div>
              ))}
            </TabsContent>

            <TabsContent value="child" className="space-y-4">
              {childData.map((item, index) => (
                <div key={index}>{renderMobileCard(item)}</div>
              ))}
            </TabsContent>

            <TabsContent value="methods" className="space-y-4">
              {methodsData.map((item, index) => (
                <div key={index}>{renderMethodCard(item)}</div>
              ))}
            </TabsContent>
          </div>

          {/* Desktop View */}
          <div className="hidden md:block">
            <TabsContent value="maternal" className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Indicator</TableHead>
                      <TableHead>Definition</TableHead>
                      <TableHead className="w-[100px]">Target</TableHead>
                      <TableHead className="w-[100px]">Frequency</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {maternalData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.indicator}</TableCell>
                        <TableCell className="max-w-[400px]">{item.definition}</TableCell>
                        <TableCell>{item.target}</TableCell>
                        <TableCell>{item.frequency}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="child" className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Indicator</TableHead>
                      <TableHead>Definition</TableHead>
                      <TableHead className="w-[100px]">Target</TableHead>
                      <TableHead className="w-[100px]">Frequency</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {childData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.indicator}</TableCell>
                        <TableCell className="max-w-[400px]">{item.definition}</TableCell>
                        <TableCell>{item.target}</TableCell>
                        <TableCell>{item.frequency}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="methods" className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Collection Point</TableHead>
                      <TableHead>Recording Person</TableHead>
                      <TableHead>Reporting Person</TableHead>
                      <TableHead>Recording Method</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {methodsData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.point}</TableCell>
                        <TableCell>{item.recording}</TableCell>
                        <TableCell>{item.reporting}</TableCell>
                        <TableCell>{item.method}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </div>

          {/* Abbreviations Section */}
          <TabsContent value="methods" className="space-y-6">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm space-y-4 mt-4">
              <h3 className="text-lg font-semibold">Abbreviations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm"><span className="font-medium">CHCP:</span> Community Health Care Provider</p>
                  <p className="text-sm"><span className="font-medium">FWA:</span> Family Welfare Assistant</p>
                  <p className="text-sm"><span className="font-medium">FWV:</span> Family Welfare Visitor</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm"><span className="font-medium">ANC:</span> Antenatal Care</p>
                  <p className="text-sm"><span className="font-medium">IFA:</span> Iron Folic Acid</p>
                  <p className="text-sm"><span className="font-medium">MIS:</span> Management Information System</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageWrapper>
  );
};

export default TechnicalSpecs; 