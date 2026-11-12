import React, { useState, Suspense } from "react";
import { lazy } from "react";
import PageWrapper from "@/components/Layout/PageWrapper";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Button } from "@/components/ui/button";
import { Mail, Download, TrendingUp } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { generateReport } from "@/utils/reportGenerator";
import { regions } from '../data/regionsData';
import { whaTargets } from '../data/whaTargets';
import { historicalData } from '../data/historicalData';
import MetricCard from "@/components/Dashboard/MetricCard";
import OutputChart from "@/components/Dashboard/OutputChart";
import MapLegend from "@/assets/maps/MapLegend";
import StaticMap from "@/assets/maps/StaticMap";

// Loading placeholder
const MapLoadingPlaceholder = () => (
  <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg">
    <p className="text-gray-500">Loading map...</p>
  </div>
);

// Replace the placeholder with our new province map component
const RegionVisualization = ({ region }) => {
  // Extract province number from region name if available
  const getProvinceNumber = () => {
    if (region.name.includes('Province')) {
      const match = region.name.match(/Province\s*(\d+)/i);
      return match ? parseInt(match[1]) : 1;
    } else if (region.name === 'Bagmati') {
      return 3;
    } else if (region.name === 'Gandaki') {
      return 4;
    } else if (region.name === 'Lumbini') {
      return 5;
    } else if (region.name === 'Karnali') {
      return 6;
    } else if (region.name === 'Sudurpashchim') {
      return 7;
    }
    return 1; // Default to Province 1 if not found
  };

  return (
    <div className="w-full h-full">
      <div className="h-64 bg-white rounded-lg overflow-hidden border border-gray-200">
        <StaticMap type="province" province={getProvinceNumber()} />
      </div>
      <MapLegend />
    </div>
  );
};

// WHA Target Profile
const WhaTargetProfile = ({ indicator }) => {
  const targetData = whaTargets.find(target => target.indicator.toLowerCase() === indicator.toLowerCase());
  
  // Same series as the Impact page, so both pages show one trend.
  const trendData = historicalData[indicator.toLowerCase() as keyof typeof historicalData].map(
    ({ year, value }) => ({ name: String(year), value })
  );

  // Move from the current value by the annual rate for each year after 2022.
  // The rate is a drop, except for an indicator whose target is above its current value.
  const direction = targetData.target2030 < targetData.current ? -1 : 1;
  const projectionData = [2022, 2024, 2026, 2028, 2030].map((year) => ({
    name: String(year),
    value: Number((targetData.current + direction * targetData.annualReduction * (year - 2022)).toFixed(1)),
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Current Rate" 
          value={`${targetData.current}%`} 
          subtitle="Latest measurement"
          className="bg-white"
        />
        <MetricCard 
          title="Target 2030" 
          value={`${targetData.target2030}%`} 
          subtitle="WHO target"
          className="bg-white"
        />
        <MetricCard 
          title="Annual Reduction" 
          value={`${targetData.annualReduction}%`} 
          subtitle="Current rate"
          className="bg-white"
        />
        <MetricCard 
          title="Required Reduction" 
          value={`${targetData.requiredReduction}%`} 
          subtitle="To meet target"
          className="bg-white"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Historical Trend</h3>
          <div className="h-64">
            <OutputChart 
              data={trendData}
              title="Historical Data" 
              xAxisLabel="Year" 
              yAxisLabel="Value (%)"
            />
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Projection to 2030</h3>
          <div className="h-64">
            <OutputChart 
              data={projectionData}
              referenceValue={targetData.target2030}
              referenceLabel="2030 target"
              title="Projected Data"
              xAxisLabel="Year" 
              yAxisLabel="Value (%)"
            />
          </div>
        </Card>
      </div>
      
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Provincial Distribution</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Province</TableHead>
                <TableHead className="text-right">Stunting</TableHead>
                <TableHead className="text-right">Wasting</TableHead>
                <TableHead className="text-right">Anemia</TableHead>
                <TableHead className="text-right">Breastfeeding</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regions.map((region) => {
                const getIndicatorValue = (baseValue, variance) => (baseValue + (Math.random() * variance - variance/2)).toFixed(1);
                const getStatus = () => Math.random() > 0.5 ? "On Track" : "Needs Attention";
                
                return (
                <TableRow key={region.name}>
                  <TableCell className="font-medium">{region.name}</TableCell>
                    <TableCell className="text-right">{getIndicatorValue(whaTargets[0].current, 4)}%</TableCell>
                    <TableCell className="text-right">{getIndicatorValue(whaTargets[1].current, 3)}%</TableCell>
                    <TableCell className="text-right">{getIndicatorValue(whaTargets[2].current, 5)}%</TableCell>
                    <TableCell className="text-right">{getIndicatorValue(whaTargets[3].current, 6)}%</TableCell>
                  <TableCell className="text-right">
                    <span className={Math.random() > 0.5 ? "text-green-600" : "text-amber-600"}>
                        {getStatus()}
                    </span>
                  </TableCell>
                </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

const Profile = () => {
  usePageTitle("Profile");
  const [selectedRegion, setSelectedRegion] = useState(regions[0]);
  const [activeWhaTab, setActiveWhaTab] = useState("stunting");

  const handleEmailAuthority = (region) => {
    const subject = `Nutrition Program Concerns - ${region}`;
    const body = `Dear Authority,\n\nI would like to bring to your attention the current nutrition indicators for ${region}...`;

    // Open Gmail compose in a new tab
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=authority@example.com&su=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.open(gmailComposeUrl, "_blank");
  };

  const handleDownloadReport = () => {
    // Placeholder for future data pipeline implementation
    const placeholderData = {
      outputData: [],
      inputMetrics: [],
      impactMetrics: [],
    };
    generateReport(placeholderData);
  };

  return (
    <PageWrapper title="Profile" >
      <div className="space-y-6">
        {/* Country Profile Section */}
        <section className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Country Profile</h2>
            <Button onClick={handleDownloadReport} className="w-full sm:w-auto bg-[#22C55E] hover:bg-[#16A34A] text-white">
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="p-4">
              <p className="text-sm text-gray-500">Population</p>
              <p className="text-lg font-semibold mt-1">29,164,578</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-500">Provinces</p>
              <p className="text-lg font-semibold mt-1">7</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-500">Districts</p>
              <p className="text-lg font-semibold mt-1">77</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-500">Municipalities</p>
              <p className="text-lg font-semibold mt-1">293</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-500">Rural Municipalities</p>
              <p className="text-lg font-semibold mt-1">460</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-500">Total Households</p>
              <p className="text-lg font-semibold mt-1">6,660,841</p>
            </Card>
          </div>
        </section>

        {/* Overall map section */}
        <section className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">National Overview</h2>
          <div className="h-64 border border-gray-200 rounded-lg overflow-hidden">
            <StaticMap type="nepal" />
          </div>
          <MapLegend />
        </section>

        {/* Provincial Profile Section */}
        <section className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Provincial Profile</h2>

          {/* Province selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="w-full sm:w-64">
            <Select onValueChange={(value) => setSelectedRegion(regions.find((r) => r.name === value))}>
                <SelectTrigger className="w-full bg-white border shadow-sm">
                <span>{selectedRegion.name}</span>
              </SelectTrigger>
                <SelectContent>
                {regions.map((region) => (
                    <SelectItem key={region.name} value={region.name}>
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
                <Button
                  variant="outline"
              className="w-full sm:w-auto text-[#22C55E] hover:bg-[#F2FCE2]"
                  onClick={() => handleEmailAuthority(selectedRegion.name)}
                >
                  <Mail className="h-4 w-4 mr-2" /> Contact Authority
                </Button>
              </div>

          {/* Region details and map */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Region Stats */}
            <div className="lg:col-span-5">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="font-semibold text-gray-900 mb-4">{selectedRegion.name}</h3>
                <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Population</p>
                    <p className="text-lg font-semibold mt-1">{selectedRegion.stats.population}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Districts</p>
                    <p className="text-lg font-semibold mt-1">{selectedRegion.stats.districts}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Stunting Rate</p>
                    <p className="text-lg font-semibold mt-1">{selectedRegion.stats.stunting}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Health Facilities</p>
                    <p className="text-lg font-semibold mt-1">{selectedRegion.stats.facilities}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Region-Specific Map */}
            <div className="lg:col-span-7">
              <div className="bg-white p-4 rounded-lg shadow-sm border h-full">
              <RegionVisualization region={selectedRegion} />
              </div>
            </div>
          </div>
        </section>

        {/* WHA Targets Profile Section */}
        <section className="bg-white p-4 rounded-lg shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">WHA Target Profiles</h2>
            <p className="text-gray-500">Track progress towards World Health Assembly nutrition targets for 2030</p>
          </div>
          
          <Tabs value={activeWhaTab} onValueChange={setActiveWhaTab}>
            <div className="overflow-x-auto pb-2">
              <TabsList className="inline-flex w-full md:w-auto min-w-full md:min-w-0 h-10 items-center justify-start md:justify-center text-muted-foreground rounded-lg p-1 bg-muted">
                <TabsTrigger 
                  value="stunting" 
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                Stunting
              </TabsTrigger>
                <TabsTrigger 
                  value="wasting"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                Wasting
              </TabsTrigger>
                <TabsTrigger 
                  value="anemia"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                Anemia
              </TabsTrigger>
                <TabsTrigger 
                  value="breastfeeding"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                Breastfeeding
              </TabsTrigger>
            </TabsList>
            </div>
            
            <TabsContent value="stunting">
              <WhaTargetProfile indicator="stunting" />
            </TabsContent>
            <TabsContent value="wasting">
              <WhaTargetProfile indicator="wasting" />
            </TabsContent>
            <TabsContent value="anemia">
              <WhaTargetProfile indicator="anemia" />
            </TabsContent>
            <TabsContent value="breastfeeding">
              <WhaTargetProfile indicator="breastfeeding" />
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </PageWrapper>
  );
};

export default Profile;
