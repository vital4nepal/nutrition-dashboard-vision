import React, { useState } from 'react';
import PageWrapper from '@/components/Layout/PageWrapper';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, ChevronDown, ChevronUp, FileText, ArrowLeft, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import OutputChart from '@/components/Dashboard/OutputChart';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from 'recharts';

// Simple pie chart component
const PieChart = ({ data, colors, size = 150 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`translate(${size / 2}, ${size / 2})`}>
        {data.map((item, index) => {
          const angle = (item.value / total) * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;
          currentAngle = endAngle;

          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;

          const x1 = Math.sin(startRad) * (size / 2);
          const y1 = -Math.cos(startRad) * (size / 2);
          const x2 = Math.sin(endRad) * (size / 2);
          const y2 = -Math.cos(endRad) * (size / 2);

          const largeArcFlag = angle > 180 ? 1 : 0;

          const pathData = [
            `M 0 0`,
            `L ${x1} ${y1}`,
            `A ${size / 2} ${size / 2} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            `Z`
          ].join(' ');

          return (
            <path
              key={index}
              d={pathData}
              fill={colors[index % colors.length]}
              stroke="#fff"
              strokeWidth="1"
            />
          );
        })}
      </g>
      
      {/* Legend */}
      <g transform={`translate(0, ${size + 10})`}>
        {data.map((item, index) => (
          <g key={index} transform={`translate(0, ${index * 20})`}>
            <rect width="15" height="15" fill={colors[index % colors.length]} />
            <text x="20" y="12" fontSize="12">{item.name} ({Math.round((item.value / total) * 100)}%)</text>
          </g>
        ))}
      </g>
    </svg>
  );
};

// Donut chart component
const DonutChart = ({ data, colors, size = 150, thickness = 40 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;
  const radius = size / 2;
  const innerRadius = radius - thickness;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`translate(${size / 2}, ${size / 2})`}>
        {data.map((item, index) => {
          const angle = (item.value / total) * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;
          currentAngle = endAngle;

          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;

          const x1 = Math.sin(startRad) * radius;
          const y1 = -Math.cos(startRad) * radius;
          const x2 = Math.sin(endRad) * radius;
          const y2 = -Math.cos(endRad) * radius;

          const x3 = Math.sin(endRad) * innerRadius;
          const y3 = -Math.cos(endRad) * innerRadius;
          const x4 = Math.sin(startRad) * innerRadius;
          const y4 = -Math.cos(startRad) * innerRadius;

          const largeArcFlag = angle > 180 ? 1 : 0;

          const pathData = [
            `M ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            `L ${x3} ${y3}`,
            `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
            `Z`
          ].join(' ');

          return (
            <path
              key={index}
              d={pathData}
              fill={colors[index % colors.length]}
              stroke="#fff"
              strokeWidth="1"
            />
          );
        })}
        
        {/* Center text */}
        <text
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="16"
          fontWeight="bold"
        >
          {total}
        </text>
      </g>
      
      {/* Legend */}
      <g transform={`translate(0, ${size + 10})`}>
        {data.map((item, index) => (
          <g key={index} transform={`translate(0, ${index * 20})`}>
            <rect width="15" height="15" fill={colors[index % colors.length]} />
            <text x="20" y="12" fontSize="12">{item.name} ({Math.round((item.value / total) * 100)}%)</text>
          </g>
        ))}
      </g>
    </svg>
  );
};

// N4G Commitment data
const commitmentData = {
  total: 32,
  met: 15,
  onTrack: 15,
  notMet: 2,
  themes: [
    {
      name: 'Political and Governance',
      commitments: 5,
      met: 2,
      onTrack: 3,
      notMet: 0
    },
    {
      name: 'Policy',
      commitments: 8,
      met: 4,
      onTrack: 3,
      notMet: 1
    },
    {
      name: 'Financial',
      commitments: 6,
      met: 3,
      onTrack: 2,
      notMet: 1
    },
    {
      name: 'Operational',
      commitments: 7,
      met: 3,
      onTrack: 4,
      notMet: 0
    },
    {
      name: 'Monitoring, Reporting and Research',
      commitments: 6,
      met: 3,
      onTrack: 3,
      notMet: 0
    }
  ]
};

// Colors for charts
const COLORS = ['#4285F4', '#34A853', '#EA4335', '#FBBC05', '#FF6D01', '#46BDC6'];
const STATUS_COLORS = {
  Met: '#4285F4',      // Blue
  'On Track': '#34A853', // Green
  'Not Met': '#EA4335'   // Red
};
const BAR_COLORS = {
  Met: '#4285F4',      // Blue
  'On Track': '#34A853', // Green
  'Not Met': '#EA4335'   // Red
};

const N4GDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    introduction: false,
    whaTargets: false,
    reviewProcess: false
  });
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Calculate percentages
  const metPercentage = Math.round((commitmentData.met / commitmentData.total) * 100);
  const onTrackPercentage = Math.round((commitmentData.onTrack / commitmentData.total) * 100);
  const notMetPercentage = Math.round((commitmentData.notMet / commitmentData.total) * 100);

  // Prepare data for status pie chart
  const statusData = [
    { name: 'Met', value: commitmentData.met },
    { name: 'On Track', value: commitmentData.onTrack },
    { name: 'Not Met', value: commitmentData.notMet }
  ];

  // Prepare data for themes pie chart
  const themesData = commitmentData.themes.map(theme => ({
    name: theme.name.split(' ')[0], // Just use the first word for display
    value: theme.commitments
  }));

  // Prepare data for themes bar chart with better formatted names for two lines
  const themesBarData = commitmentData.themes.map(theme => {
    // Create shorter display names for the chart
    let displayName;
    
    // Custom formatting for each theme to ensure good line breaks
    switch(theme.name) {
      case 'Political and Governance':
        displayName = 'Political\nand Governance';
        break;
      case 'Monitoring, Reporting and Research':
        displayName = 'Monitoring\nand Research';
        break;
      case 'Policy':
        displayName = 'Policy';
        break;
      case 'Financial':
        displayName = 'Financial';
        break;
      case 'Operational':
        displayName = 'Operational';
        break;
      default:
        // Split at a reasonable point if not a predefined theme
        const words = theme.name.split(' ');
        if (words.length > 1) {
          const midpoint = Math.ceil(words.length / 2);
          displayName = words.slice(0, midpoint).join(' ') + '\n' + words.slice(midpoint).join(' ');
        } else {
          displayName = theme.name;
        }
    }
    
    return {
      name: displayName,
      fullName: theme.name, // Keep full name for tooltip
      Met: theme.met,
      'On Track': theme.onTrack,
      'Not Met': theme.notMet
    };
  });

  // Handle PDF generation
  const handlePrintPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text('Tracking Nutrition for Growth (N4G) commitments of Nepal', 14, 20);
      
      // Add summary
      doc.setFontSize(12);
      doc.text(`Total ${commitmentData.total} commitments`, 14, 30);
      doc.text(`${commitmentData.met} commitments met (${metPercentage}%)`, 14, 36);
      doc.text(`${commitmentData.onTrack} commitments on track (${onTrackPercentage}%)`, 14, 42);
      doc.text(`${commitmentData.notMet} commitments not met (${notMetPercentage}%)`, 14, 48);
      doc.text(`Overall, ${metPercentage}% of Commitments have been met in the past 4 years`, 14, 54);
      
      // Add themes table
      const tableData = commitmentData.themes.map(theme => [
        theme.name,
        theme.commitments,
        theme.met,
        theme.onTrack,
        theme.notMet,
        `${Math.round(((theme.met + theme.onTrack) / theme.commitments) * 100)}%`
      ]);
      
      // @ts-ignore
      doc.autoTable({
        head: [['Theme', 'Total', 'Met', 'On Track', 'Not Met', 'Progress']],
        body: tableData,
        startY: 60
      });
      
      // Save the PDF
      doc.save('N4G_Commitments_Nepal.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      // You could add a user-friendly error message here
    }
  };

  const handleOpenPdf = (url: string) => {
    setPdfUrl(url);
    setShowPdfViewer(true);
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-green-500">
              Tracking Nutrition for Growth (N4G) commitments of Nepal
            </h1>
            <p className="text-gray-600 mt-1">
              Interactive tool to visualize progress, challenges and priorities
            </p>
          </div>
          <Button onClick={handlePrintPDF} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Print in PDF
          </Button>
        </div>

        {/* PDF Viewer Modal */}
        {showPdfViewer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg w-full h-full max-w-5xl max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="font-medium">PDF Document</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowPdfViewer(false)}
                  className="h-8 w-8 p-0 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-hidden">
                <iframe
                  src={pdfUrl}
                  className="w-full h-full"
                  title="PDF Viewer"
                />
              </div>
              <div className="p-3 border-t flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowPdfViewer(false)}
                >
                  Close
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.open(pdfUrl, '_blank')}
                >
                  Open in new tab <ExternalLink className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="themes">Commitment Themes</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            {/* Introduction Section */}
            <Card className="border rounded-md overflow-hidden">
              <div 
                className="flex justify-between items-center cursor-pointer p-4 hover:bg-gray-50" 
                onClick={() => toggleSection('introduction')}
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-medium">1. Introduction</h2>
                </div>
                {expandedSections.introduction ? 
                  <ChevronUp className="h-5 w-5" /> : 
                  <ChevronDown className="h-5 w-5" />
                }
              </div>
              
              {expandedSections.introduction && (
                <div className="p-4 pt-0 space-y-4 text-gray-700 border-t">
                  <p>
                    The Government of Nepal has committed to the Nutrition for Growth (N4G) Summit 2021, 
                    Tokyo, pledges to combat prevailing malnutrition in all its forms in Nepal through the 
                    implementation of the Multi-sector Nutrition Plan (MSNP).
                  </p>
                  <p>
                    This dashboard tracks the progress of 32 commitments across five thematic areas:
                    Political and Governance, Policy, Financial, Operational, and Monitoring, Reporting and Research.
                  </p>
                  <p>
                    Malnutrition remains a significant public health challenge in Nepal, with approximately 36% of children under five suffering from stunting and 10% from wasting. The economic cost of malnutrition is estimated at 2-3% of Nepal's GDP annually. Through the N4G commitments, Nepal aims to reduce stunting to below 20% by 2030, reduce anemia in women of reproductive age by 50%, and increase exclusive breastfeeding rates to at least 65%.
                  </p>
                  <p>
                    This dashboard serves as a transparent accountability tool for tracking progress on these commitments. It provides stakeholders, policymakers, and the public with up-to-date information on implementation status, challenges, and achievements across all thematic areas. The data is updated quarterly based on reports from relevant ministries and implementing partners.
                  </p>
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-2"
                      onClick={() => handleOpenPdf('http://localhost:8080/docs/n4g-introduction.pdf')}
                    >
                      <FileText className="h-4 w-4" />
                      Introduction (PDF)
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            {/* World Health Assembly & SDG Targets Section */}
            <Card className="border rounded-md overflow-hidden">
              <div 
                className="flex justify-between items-center cursor-pointer p-4 hover:bg-gray-50" 
                onClick={() => toggleSection('whaTargets')}
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-yellow-600" />
                  <h2 className="text-lg font-medium">2. World Health Assembly & SDG targets on Nutrition</h2>
                </div>
                {expandedSections.whaTargets ? 
                  <ChevronUp className="h-5 w-5" /> : 
                  <ChevronDown className="h-5 w-5" />
                }
              </div>
              
              {expandedSections.whaTargets && (
                <div className="p-4 pt-0 space-y-4 text-gray-700 border-t">
                  <p>
                    Nepal has aligned its N4G commitments with the World Health Assembly (WHA) global nutrition targets for 2025 and the Sustainable Development Goals (SDGs) for 2030. These international frameworks provide benchmarks for measuring progress and ensuring alignment with global nutrition priorities.
                  </p>
                  <h3 className="font-medium mt-4">WHA Targets (by 2025):</h3>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>40% reduction in the number of children under 5 who are stunted</li>
                    <li>50% reduction of anemia in women of reproductive age</li>
                    <li>30% reduction in low birth weight</li>
                    <li>No increase in childhood overweight</li>
                    <li>Increase the rate of exclusive breastfeeding in the first 6 months to at least 50%</li>
                    <li>Reduce and maintain childhood wasting to less than 5%</li>
                  </ul>
                  <h3 className="font-medium mt-4">SDG Targets (by 2030):</h3>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>SDG 2.1: End hunger and ensure access to safe, nutritious and sufficient food</li>
                    <li>SDG 2.2: End all forms of malnutrition, including stunting and wasting in children under 5</li>
                    <li>SDG 3.1: Reduce maternal mortality</li>
                    <li>SDG 3.2: End preventable deaths of newborns and children under 5</li>
                  </ul>
                  <p className="mt-4">
                    Nepal's progress toward these targets is monitored through regular national surveys, including the Nepal Demographic and Health Survey (NDHS) and Multiple Indicator Cluster Surveys (MICS). The data from these surveys informs policy adjustments and resource allocation to accelerate progress.
                  </p>
                  <div className="mt-4">
                    <a 
                      href="https://www.npc.gov.np" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      Visit NPC website <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}
            </Card>

            {/* Review Process Section */}
            <Card className="border rounded-md overflow-hidden">
              <div 
                className="flex justify-between items-center cursor-pointer p-4 hover:bg-gray-50" 
                onClick={() => toggleSection('reviewProcess')}
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-600" />
                  <h2 className="text-lg font-medium">3. Review Process</h2>
                </div>
                {expandedSections.reviewProcess ? 
                  <ChevronUp className="h-5 w-5" /> : 
                  <ChevronDown className="h-5 w-5" />
                }
              </div>
              
              {expandedSections.reviewProcess && (
                <div className="p-4 pt-0 space-y-4 text-gray-700 border-t">
                  <p>
                    The review process for N4G commitments follows a structured approach to ensure accuracy, transparency, and accountability in tracking progress. The process involves multiple stakeholders and occurs on a quarterly and annual basis.
                  </p>
                  <h3 className="font-medium mt-4">Quarterly Review Process:</h3>
                  <ol className="list-decimal list-inside ml-4 space-y-2">
                    <li><span className="font-medium">Data Collection:</span> Implementing ministries and partners submit progress reports using standardized templates</li>
                    <li><span className="font-medium">Data Verification:</span> Technical committee validates submitted data against established indicators</li>
                    <li><span className="font-medium">Progress Assessment:</span> Status of each commitment is evaluated as "Met," "On Track," or "Not Met"</li>
                    <li><span className="font-medium">Dashboard Update:</span> Verified data is uploaded to this dashboard for public access</li>
                  </ol>
                  <h3 className="font-medium mt-4">Annual Review Process:</h3>
                  <ol className="list-decimal list-inside ml-4 space-y-2">
                    <li><span className="font-medium">Comprehensive Analysis:</span> In-depth review of all commitments and their impact</li>
                    <li><span className="font-medium">Stakeholder Consultation:</span> Multi-sectoral meeting to discuss challenges and solutions</li>
                    <li><span className="font-medium">Report Publication:</span> Annual progress report published and disseminated</li>
                    <li><span className="font-medium">Strategy Adjustment:</span> Implementation strategies revised based on findings</li>
                  </ol>
                  <p className="mt-4">
                    The review process is overseen by the National Planning Commission in coordination with the Ministry of Health and Population. Independent verification is conducted by technical partners to ensure objectivity in assessment. All review findings are made publicly available through this dashboard and official government publications.
                  </p>
                  <div className="mt-4 flex items-center gap-4">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Download Review Guidelines
                    </Button>
                    <p className="text-sm text-gray-500">
                      Useful links: <a href="https://www.npc.gov.np" className="text-blue-600 hover:underline">www.npc.gov.np</a>
                    </p>
                  </div>
                </div>
              )}
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Status of the Commitments</h2>
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="w-full md:w-1/2 order-2 md:order-1">
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-center">
                        <span className="mr-2 w-3 h-3" style={{backgroundColor: STATUS_COLORS.Met}}></span>
                        <span>{commitmentData.met} commitments met ({metPercentage}%)</span>
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2 w-3 h-3" style={{backgroundColor: STATUS_COLORS['On Track']}}></span>
                        <span>{commitmentData.onTrack} commitments on track ({onTrackPercentage}%)</span>
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2 w-3 h-3" style={{backgroundColor: STATUS_COLORS['Not Met']}}></span>
                        <span>{commitmentData.notMet} commitments not met ({notMetPercentage}%)</span>
                      </li>
                    </ul>
                    <div className="mt-4 text-gray-700">
                      <p>Overall, {metPercentage}% of Commitments have been met in the past 4 years</p>
                      <p className="mt-2">The Government of Nepal has made significant progress in meeting its Nutrition for Growth (N4G) commitments, with {metPercentage + onTrackPercentage}% of commitments either met or on track.</p>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 flex justify-center order-1 md:order-2 mb-4 md:mb-0">
                    <PieChart 
                      data={statusData} 
                      colors={[STATUS_COLORS.Met, STATUS_COLORS['On Track'], STATUS_COLORS['Not Met']]} 
                      size={200} 
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Commitment Themes</h2>
                <div className="flex flex-col items-center">
                  <div className="h-[350px] w-full">
                    <div className="w-full h-full">
                      <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={300}>
                        <BarChart
                          data={themesBarData}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 30,
                          }}
                          barSize={55}
                          maxBarSize={65}
                          layout="vertical"
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                          <XAxis 
                            type="number"
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => value.toLocaleString()}
                          />
                          <YAxis 
                            type="category"
                            dataKey="name"
                            tick={{ fontSize: 12 }}
                            width={120}
                          />
                          <Tooltip 
                            formatter={(value) => [`${value} commitments`, '']}
                            labelFormatter={(label) => {
                              // Find the corresponding theme by display name
                              const theme = themesBarData.find(t => t.name === label);
                              return theme ? theme.fullName : label;
                            }}
                            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                          />
                          <Legend 
                            wrapperStyle={{ paddingTop: 15 }}
                          />
                          <Bar key="met" dataKey="Met" stackId="a" fill={BAR_COLORS.Met} name="Met" />
                          <Bar key="onTrack" dataKey="On Track" stackId="a" fill={BAR_COLORS['On Track']} name="On Track" />
                          <Bar key="notMet" dataKey="Not Met" stackId="a" fill={BAR_COLORS['Not Met']} name="Not Met" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

           
          </TabsContent>
          
          <TabsContent value="themes" className="space-y-6">
            {selectedTheme ? (
              <Card className="p-3 md:p-4 shadow-sm">
                <div className="flex items-center mb-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedTheme(null)} 
                    className="flex items-center gap-1 text-gray-700 h-7 text-sm px-2.5 py-0.5 mr-3 hover:bg-green-500 hover:shadow-md hover:shadow-green-300/50"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    <span>Back</span>
                  </Button>
                  <h2 className="text-lg font-semibold">Theme Details: <span className="text-green-600">{selectedTheme}</span></h2>
                </div>
                
                {commitmentData.themes.filter(t => t.name === selectedTheme).map((theme, index) => (
                  <div key={index}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      <div className="bg-gray-50 p-3 rounded-md">
                        <h3 className="font-medium text-sm text-gray-700 mb-2 border-b border-gray-200 pb-1">Summary</h3>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mb-3">
                          <span className="text-sm font-medium text-gray-600">Total:</span>
                          <span className="text-sm text-right">{theme.commitments} commitments</span>
                          
                          <span className="text-sm font-medium text-gray-600">Status:</span>
                          <span className="text-sm text-right">
                            <span className="inline-flex items-center">
                              <span className="w-2 h-2 rounded-full mr-0.5" style={{backgroundColor: STATUS_COLORS.Met}}></span>
                              {theme.met} met
                            </span>
                            <span className="mx-1">·</span>
                            <span className="inline-flex items-center">
                              <span className="w-2 h-2 rounded-full mr-0.5" style={{backgroundColor: STATUS_COLORS['On Track']}}></span>
                              {theme.onTrack} on track
                            </span>
                            <span className="mx-1">·</span>
                            <span className="inline-flex items-center">
                              <span className="w-2 h-2 rounded-full mr-0.5" style={{backgroundColor: STATUS_COLORS['Not Met']}}></span>
                              {theme.notMet} not met
                            </span>
                          </span>
                        </div>
                        
                        {theme.name === 'Political and Governance' && (
                          <div className="mb-3 border-t border-gray-200 pt-2">
                            <div className="flex text-sm">
                              <span className="font-medium text-gray-600 mr-1">Goal:</span>
                              <span className="text-gray-700">Strengthen the mechanism for improved nutrition governance and accountability from 2022 to 2030</span>
                            </div>
                          </div>
                        )}
                        
                        <div className="text-sm text-gray-600 border-t border-gray-200 pt-2">
                          {theme.name === 'Political and Governance' && (
                            <>
                              <p>This theme focuses on establishing effective governance structures for nutrition interventions in Nepal. It includes commitments related to high-level coordination mechanisms, policy development, and provincial implementation frameworks.</p>
                              <p className="mt-2.5">Major achievements include the creation of the National Nutrition Council and development of a multi-sector nutrition plan, leading to <span className="font-medium">{Math.round(((theme.met + theme.onTrack) / theme.commitments) * 100)}%</span> overall progress.</p>
                            </>
                          )}
                          
                          {theme.name === 'Financial' && (
                            <>
                              <p>This theme addresses the financial aspects of nutrition programming in Nepal. It includes commitments related to budget allocation, nutrition-specific funding codes, and sustainable financing mechanisms.</p>
                              <p className="mt-2">Key progress includes a 35% increase in nutrition budget allocation and establishment of dedicated budget codes, resulting in <span className="font-medium">{Math.round(((theme.met + theme.onTrack) / theme.commitments) * 100)}%</span> overall progress.</p>
                            </>
                          )}
                          
                          {theme.name === 'Policy' && (
                            <>
                              <p>This theme covers the policy framework necessary for effective nutrition interventions. It includes commitments on food security policy, fortification standards, and regulatory frameworks for nutrition.</p>
                              <p className="mt-2">Significant achievements include the National Food Security Policy approval, though challenges remain in implementation. Overall progress stands at <span className="font-medium">{Math.round(((theme.met + theme.onTrack) / theme.commitments) * 100)}%</span>.</p>
                            </>
                          )}
                          
                          {theme.name === 'Health' && (
                            <>
                              <p>This theme focuses on health-sector nutrition interventions. It includes commitments related to maternal and child nutrition services, micronutrient supplementation programs, and integration of nutrition into primary healthcare.</p>
                              <p className="mt-2">Progress includes expanded coverage of vitamin A supplementation and iron-folate programs, contributing to <span className="font-medium">{Math.round(((theme.met + theme.onTrack) / theme.commitments) * 100)}%</span> overall progress.</p>
                            </>
                          )}
                          
                          {theme.name === 'Agriculture' && (
                            <>
                              <p>This theme addresses nutrition-sensitive agricultural interventions. It includes commitments on promoting diverse food production, supporting smallholder farmers, and strengthening food value chains.</p>
                              <p className="mt-2">Key achievements include expansion of home garden programs and promotion of biofortified crops, resulting in <span className="font-medium">{Math.round(((theme.met + theme.onTrack) / theme.commitments) * 100)}%</span> overall progress.</p>
                            </>
                          )}
                          
                          {theme.name === 'Education' && (
                            <>
                              <p>This theme focuses on nutrition education and school-based nutrition programs. It includes commitments related to curriculum development, school feeding programs, and nutrition awareness campaigns.</p>
                              <p className="mt-2">Progress includes integration of nutrition education in school curricula and expansion of mid-day meal programs, leading to <span className="font-medium">{Math.round(((theme.met + theme.onTrack) / theme.commitments) * 100)}%</span> overall progress.</p>
                            </>
                          )}
                          
                          {theme.name !== 'Political and Governance' && 
                           theme.name !== 'Financial' && 
                           theme.name !== 'Policy' && 
                           theme.name !== 'Health' && 
                           theme.name !== 'Agriculture' && 
                           theme.name !== 'Education' && (
                            <>
                              <p>This theme focuses on {theme.name.toLowerCase()} aspects of nutrition interventions in Nepal. It includes various commitments to improve nutritional outcomes through targeted approaches.</p>
                              <p className="mt-2">Overall progress stands at <span className="font-medium">{Math.round(((theme.met + theme.onTrack) / theme.commitments) * 100)}%</span> with {theme.met} commitments fully met.</p>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-md flex flex-col">
                        <h3 className="font-medium text-sm text-gray-700 mb-2 border-b border-gray-200 pb-1">Status Breakdown</h3>
                        <div className="flex items-center justify-center flex-1 py-2">
                          <PieChart 
                            data={[
                              { name: 'Met', value: theme.met },
                              { name: 'On Track', value: theme.onTrack },
                              { name: 'Not Met', value: theme.notMet }
                            ]} 
                            colors={[STATUS_COLORS.Met, STATUS_COLORS['On Track'], STATUS_COLORS['Not Met']]} 
                            size={130} 
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center border-t border-gray-200 pt-2 mt-1">
                          <div>
                            <div className="flex items-center justify-center mb-1">
                              <span className="w-2.5 h-2.5 rounded-full mr-1" style={{backgroundColor: STATUS_COLORS.Met}}></span>
                              <span className="text-sm font-medium">Met</span>
                            </div>
                            <span className="text-sm">{Math.round((theme.met / theme.commitments) * 100)}%</span>
                          </div>
                          <div>
                            <div className="flex items-center justify-center mb-1">
                              <span className="w-2.5 h-2.5 rounded-full mr-1" style={{backgroundColor: STATUS_COLORS['On Track']}}></span>
                              <span className="text-sm font-medium">On Track</span>
                            </div>
                            <span className="text-sm">{Math.round((theme.onTrack / theme.commitments) * 100)}%</span>
                          </div>
                          <div>
                            <div className="flex items-center justify-center mb-1">
                              <span className="w-2.5 h-2.5 rounded-full mr-1" style={{backgroundColor: STATUS_COLORS['Not Met']}}></span>
                              <span className="text-sm font-medium">Not Met</span>
                            </div>
                            <span className="text-sm">{Math.round((theme.notMet / theme.commitments) * 100)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Card>
            ) : (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Commitment Themes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {commitmentData.themes.map((theme, index) => (
                    <div 
                      key={index} 
                      className="border p-4 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setSelectedTheme(theme.name)}
                    >
                      <h3 className="font-medium text-lg">{index + 1}. {theme.name}</h3>
                      <p className="text-sm mt-1">
                        {theme.commitments} commitments ({theme.met} met, {theme.onTrack} on track, {theme.notMet} not met)
                      </p>
                      {theme.name === 'Political and Governance' && (
                        <p className="text-sm mt-1">
                          <span className="font-medium">Goal:</span> Strengthen the mechanism for improved nutrition governance and accountability from 2022 to 2030
                        </p>
                      )}
                      <div className="mt-2 flex items-center space-x-2">
                        <div className="w-full">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{Math.round(((theme.met + theme.onTrack) / theme.commitments) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{ width: `${(theme.met / theme.commitments) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="link" 
                        className="mt-2 p-0 h-auto text-blue-600"
                      >
                        View details
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="resources" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Useful Resources</h2>
              <div className="space-y-6">
                {/* Document Resources */}
                <div>
                  <h3 className="font-medium mb-3">Documents:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="mr-2 mt-0.5 text-gray-700"><FileText className="h-4 w-4" /></span>
                      <a 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleOpenPdf('http://localhost:8080/docs/n4g-introduction.pdf');
                        }} 
                        className="text-blue-600 hover:underline cursor-pointer"
                      >
                        Introduction
                      </a>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-0.5 text-gray-700"><FileText className="h-4 w-4" /></span>
                      <a 
                        href="#" 
                        className="text-blue-600 hover:underline"
                      >
                        Technical Specifications
                      </a>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-0.5 text-gray-700"><FileText className="h-4 w-4" /></span>
                      <a 
                        href="#" 
                        className="text-blue-600 hover:underline"
                      >
                        Methodology Guide
                      </a>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium">Government Resources:</h3>
                  <ul className="list-disc list-inside ml-4 text-sm space-y-1">
                    <li>
                      <a 
                        href="https://www.npc.gov.np" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        National Planning Commission
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://mohp.gov.np" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Ministry of Health and Population
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium">International Standards & Targets:</h3>
                  <ul className="list-disc list-inside ml-4 text-sm space-y-1">
                    <li>
                      <a 
                        href="https://www.who.int/initiatives/nutrition-for-growth" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        World Health Assembly & SDG targets on Nutrition
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://nutritionforgrowth.org/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Nutrition for Growth (N4G) Summit
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium">Contact Information:</h3>
                  <p className="text-sm mt-1">
                    For more information, please contact: <a href="mailto:nutrifellowship@nutrifellowship.com" className="text-blue-600">nutrifellowship@nutrifellowship.com</a>
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageWrapper>
  );
};

export default N4GDashboard; 