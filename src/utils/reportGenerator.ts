import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { historicalData } from '../data/historicalData';
import { regions } from '../data/regionsData';
import { monthlyData } from '../data/monthlyData';
import { childrenOutputData, maternalOutputData, inputMetrics } from '../data/outputData';
import { whaTargets } from '../data/whaTargets';

interface ReportData {
  outputData: Array<{
    name: string;
    value: number;
    month?: string;
  }>;
  inputMetrics: Array<{
    title: string;
    value: string;
    total: string;
    percentage: string;
  }>;
  impactMetrics: Array<{
    indicator?: string;
    label?: string;
    current: number;
    target: number;
    target2030?: number;
    annualReduction?: number;
    requiredReduction?: number;
    status?: string;
  }>;
  selectedRegion?: string;
  monthlyTarget?: number;
  annualTarget?: number;
  totalReached?: number;
  percentageReached?: string;
  isMonthlyTargetMet?: boolean;
}

export const generateReport = (data: ReportData) => {
  const doc = new jsPDF();
  let currentY = 20;
  
  // Add title and header
  doc.setFontSize(20);
  doc.setTextColor(34, 197, 94); // #22C55E
  doc.text('NutriPulse Nepal - Progress Report', 20, currentY);
  currentY += 10;
  
  // Add date and time
  doc.setFontSize(12);
  doc.setTextColor(0);
  const now = new Date();
  doc.text(`Generated on: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, 20, currentY);
  currentY += 15;
  
  // WHA Targets Section
  doc.setFontSize(16);
  doc.text('WHA Targets on Nutrition', 20, currentY);
  currentY += 5;
  
  autoTable(doc, {
    startY: currentY,
    head: [['Indicator', 'Target 2030', 'Current', 'Annual Reduction', 'Required Rate', 'Status']],
    body: whaTargets.map((target) => [
      target.indicator,
      `${target.target2030}%`,
      `${target.current}%`,
      `${target.annualReduction}%`,
      `${target.requiredReduction}%`,
      target.status
    ]),
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [34, 197, 94] }
  });
  
  currentY = (doc as any).lastAutoTable.finalY + 20;
  
  // Historical Trends Section
  doc.setFontSize(16);
  doc.text('Historical Trends (2018-2022)', 20, currentY);
  currentY += 5;

  const historicalTrends = Object.entries(historicalData).map(([indicator, data]) => {
    const startValue = data[0].value;
    const endValue = data[data.length - 1].value;
    const change = parseFloat((endValue - startValue).toFixed(1));
    const trend = change >= 0 ? 'Improving' : 'Declining';
    const matchingTarget = whaTargets.find(t => t.indicator.toLowerCase() === indicator.toLowerCase());
    
    return [
      indicator.charAt(0).toUpperCase() + indicator.slice(1),
      `${startValue}%`,
      `${endValue}%`,
      `${change}%`,
      trend,
      matchingTarget?.status || '-'
    ];
  });

  autoTable(doc, {
    startY: currentY,
    head: [['Indicator', '2018', '2022', 'Change', 'Trend', 'Status']],
    body: historicalTrends,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [34, 197, 94] }
  });

  currentY = (doc as any).lastAutoTable.finalY + 20;

  // Detailed Year-by-Year Trends
  doc.setFontSize(16);
  doc.text('Detailed Year-by-Year Progress', 20, currentY);
  currentY += 5;

  Object.entries(historicalData).forEach(([indicator, yearData]) => {
    const tableData = yearData.map(entry => [
      entry.year.toString(),
      `${entry.value}%`
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [[indicator.charAt(0).toUpperCase() + indicator.slice(1), 'Value']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [34, 197, 94] }
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;
  });

  // Child Nutrition Indicators Section
  doc.setFontSize(16);
  doc.text('Child Nutrition Indicators', 20, currentY);
  currentY += 5;

  const childNutritionData = childrenOutputData.map(item => {
    const monthlyValues = monthlyData[item.name] || [];
    const cumulative = monthlyValues.reduce((sum, entry) => sum + entry.value, 0);
    return [
      item.name,
      item.value.toLocaleString(),
      cumulative.toLocaleString(),
      monthlyValues.length > 0 ? monthlyValues[monthlyValues.length - 1].value.toLocaleString() : '-'
    ];
  });

  autoTable(doc, {
    startY: currentY,
    head: [['Indicator', 'Current Value', 'Cumulative', 'Latest Monthly']],
    body: childNutritionData,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [34, 197, 94] }
  });

  currentY = (doc as any).lastAutoTable.finalY + 20;

  // Maternal Nutrition Indicators Section
  doc.setFontSize(16);
  doc.text('Maternal Nutrition Indicators', 20, currentY);
  currentY += 5;

  const maternalNutritionData = maternalOutputData.map(item => {
    const monthlyValues = monthlyData[item.name] || [];
    const cumulative = monthlyValues.reduce((sum, entry) => sum + entry.value, 0);
    return [
      item.name,
      item.value.toLocaleString(),
      cumulative.toLocaleString(),
      monthlyValues.length > 0 ? monthlyValues[monthlyValues.length - 1].value.toLocaleString() : '-'
    ];
  });

  autoTable(doc, {
    startY: currentY,
    head: [['Indicator', 'Current Value', 'Cumulative', 'Latest Monthly']],
    body: maternalNutritionData,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [34, 197, 94] }
  });

  currentY = (doc as any).lastAutoTable.finalY + 20;
  
  // Monthly Progress Section
  if (data.monthlyTarget && data.annualTarget) {
    doc.setFontSize(16);
    doc.text('Monthly Progress & Targets', 20, currentY);
    currentY += 5;
    
    // Create a summary of all indicators' monthly progress
    const allMonthlyProgress = Object.entries(monthlyData).map(([indicator, values]) => {
      const latestMonth = values[values.length - 1];
      return [
        indicator,
        latestMonth.month,
        latestMonth.value.toLocaleString(),
        data.monthlyTarget?.toLocaleString() || '-',
        latestMonth.value >= (data.monthlyTarget || 0) ? 'Met' : 'Not Met'
      ];
    });

    autoTable(doc, {
      startY: currentY,
      head: [['Indicator', 'Month', 'Achieved', 'Monthly Target', 'Status']],
      body: allMonthlyProgress,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [34, 197, 94] }
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 20;
  }
  
  // Input Metrics Section
  doc.setFontSize(16);
  doc.text('Input Indicators', 20, currentY);
  currentY += 5;
  
  autoTable(doc, {
    startY: currentY,
    head: [['Indicator', 'Value', 'Total', 'Percentage']],
    body: inputMetrics.map((item) => [
      item.title,
      item.value,
      item.total,
      item.percentage
    ]),
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [34, 197, 94] }
  });
  
  currentY = (doc as any).lastAutoTable.finalY + 20;
  
  // Regional Data Section
  doc.setFontSize(16);
  doc.text('Regional Overview', 20, currentY);
  currentY += 5;
  
  autoTable(doc, {
    startY: currentY,
    head: [['Province', 'Population', 'Districts', 'Stunting Rate', 'Health Facilities']],
    body: regions.map(region => [
      region.name,
      region.stats.population,
      region.stats.districts,
      region.stats.stunting,
      region.stats.facilities
    ]),
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [34, 197, 94] }
  });
  
  // Add footer with page numbers
  const pageCount = (doc as any).internal.getNumberOfPages();
  doc.setFontSize(10);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  doc.save(`nutripulse-nepal-report-${now.toISOString().split('T')[0]}.pdf`);
};
