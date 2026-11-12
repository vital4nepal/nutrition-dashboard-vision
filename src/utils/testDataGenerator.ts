import * as XLSX from 'xlsx';

export const generateTestData = (): Blob => {
  const testData = [
    {
      month: 'January',
      indicator: 'Weight & Height Measured',
      value: 200,
      province: 'Province 1',
      district: 'District A',
    },
    {
      month: 'January',
      indicator: 'Counseling Sessions',
      value: 5000,
      province: 'Province 1',
      district: 'District A',
    },
    {
      month: 'January',
      indicator: 'Treated for Malnutrition',
      value: 75,
      province: 'Province 1',
      district: 'District A',
    },
    {
      month: 'January',
      indicator: 'IFA During ANC',
      value: 300,
      province: 'Province 1',
      district: 'District A',
    },
    {
      month: 'January',
      indicator: 'Nutrition Counseling',
      value: 350,
      province: 'Province 1',
      district: 'District A',
    },
    {
      month: 'January',
      indicator: 'Weight Monitoring',
      value: 100,
      province: 'Province 1',
      district: 'District A',
    },
    {
      month: 'January',
      indicator: 'Districts/Facilities Reporting',
      value: 60,
      province: 'Province 1',
      district: 'District A',
    },
    {
      month: 'January',
      indicator: 'Facilities with IFA Supply',
      value: 55,
      province: 'Province 1',
      district: 'District A',
    },
    {
      month: 'January',
      indicator: 'Supervised Facilities',
      value: 45,
      province: 'Province 1',
      district: 'District A',
    },
    {
      month: 'January',
      indicator: 'Facilities with Ibal Vita',
      value: 50,
      province: 'Province 1',
      district: 'District A',
    },
    {
      month: 'January',
      indicator: 'Prevalence of Stunting',
      value: 22.0,
      province: 'Province 1',
      district: 'District A',
    },
    {
      month: 'January',
      indicator: 'Prevalence of Anaemia',
      value: 30.0,
      province: 'Province 1',
      district: 'District A',
    },
    {
      month: 'January',
      indicator: 'Prevalence of Wasting',
      value: 8.0,
      province: 'Province 1',
      district: 'District A',
    },
    {
      month: 'January',
      indicator: 'Exclusive Breastfeeding',
      value: 70.0,
      province: 'Province 1',
      district: 'District A',
    },
  ];

  const ws = XLSX.utils.json_to_sheet(testData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'TestData');

  // Generate the Excel file as a blob
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};

export const downloadTestData = () => {
  const testDataBlob = generateTestData();
  const url = URL.createObjectURL(testDataBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'NutritionTestData.xlsx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}; 