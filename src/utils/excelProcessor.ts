import * as XLSX from 'xlsx';

export interface NutritionDataRow {
  month: string;
  indicator: string;
  value: number;
  province?: string;
  district?: string;
  validationStatus?: 'pending' | 'approved' | 'rejected';
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

interface ProcessResult {
  isValid: boolean;
  data: NutritionDataRow[];
  errors: ValidationError[];
}

const validateRow = (row: any, rowIndex: number): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Check required fields
  const requiredFields = ['month', 'indicator', 'value'];
  requiredFields.forEach(field => {
    if (!row[field]) {
      errors.push({
        row: rowIndex + 1,
        field,
        message: `Missing required field: ${field}`,
      });
    }
  });

  // Validate value is a number
  if (row.value && isNaN(Number(row.value))) {
    errors.push({
      row: rowIndex + 1,
      field: 'value',
      message: 'Value must be a valid number',
    });
  }

  // Validate BMI range if indicator is BMI-related
  if (row.indicator?.toLowerCase().includes('bmi') && row.value) {
    const bmi = Number(row.value);
    if (bmi < 10 || bmi > 50) {
      errors.push({
        row: rowIndex + 1,
        field: 'value',
        message: 'BMI value must be between 10 and 50',
      });
    }
  }

  // Validate birth weight range if indicator is birth weight-related
  if (row.indicator?.toLowerCase().includes('birth weight') && row.value) {
    const weight = Number(row.value);
    if (weight < 0.5 || weight > 6) {
      errors.push({
        row: rowIndex + 1,
        field: 'value',
        message: 'Birth weight must be between 0.5 and 6 kg',
      });
    }
  }

  // Validate month format
  const validMonths = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];
  if (row.month && !validMonths.includes(row.month.toLowerCase())) {
    errors.push({
      row: rowIndex + 1,
      field: 'month',
      message: 'Invalid month format',
    });
  }

  return errors;
};

export const processExcelFile = async (file: File): Promise<ProcessResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const validationErrors: ValidationError[] = [];
        const processedData: NutritionDataRow[] = [];

        jsonData.forEach((row: any, index) => {
          const rowErrors = validateRow(row, index);
          validationErrors.push(...rowErrors);

          if (rowErrors.length === 0) {
            processedData.push({
              month: row.month,
              indicator: row.indicator,
              value: Number(row.value),
              province: row.province,
              district: row.district,
              validationStatus: 'pending',
            });
          }
        });

        resolve({
          isValid: validationErrors.length === 0,
          data: processedData,
          errors: validationErrors,
        });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };

    reader.readAsArrayBuffer(file);
  });
};

export const generateTemplate = (): Blob => {
  const template = [
    {
      month: 'January',
      indicator: 'Weight & Height Measured',
      value: 100,
      province: 'Province 1',
      district: 'District A',
    },
    {
      month: 'January',
      indicator: 'Counseling Sessions',
      value: 4500,
      province: 'Province 1',
      district: 'District A',
    },
    {
      month: 'January',
      indicator: 'Treated for Malnutrition',
      value: 50,
      province: 'Province 1',
      district: 'District A',
    },
    {
      month: 'January',
      indicator: 'IFA During ANC',
      value: 250,
      province: 'Province 1',
      district: 'District A',
    },
    {
      month: 'January',
      indicator: 'Nutrition Counseling',
      value: 300,
      province: 'Province 1',
      district: 'District A',
    },
    {
      month: 'January',
      indicator: 'Weight Monitoring',
      value: 75,
      province: 'Province 1',
      district: 'District A',
    },
    {
      month: 'January',
      indicator: 'Districts/Facilities Reporting',
      value: 50,
      province: 'Province 1',
      district: 'District A',
    },
    {
      month: 'January',
      indicator: 'Facilities with IFA Supply',
      value: 45,
      province: 'Province 1',
      district: 'District A',
    },
    {
      month: 'January',
      indicator: 'Supervised Facilities',
      value: 35,
      province: 'Province 1',
      district: 'District A',
    },
    {
      month: 'January',
      indicator: 'Facilities with Ibal Vita',
      value: 40,
      province: 'Province 1',
      district: 'District A',
    },
    {
      month: 'January',
      indicator: 'Prevalence of Stunting',
      value: 24.0,
      province: 'Province 1',
      district: 'District A',
    },
    {
      month: 'January',
      indicator: 'Prevalence of Anaemia',
      value: 34.0,
      province: 'Province 1',
      district: 'District A',
    },
    {
      month: 'January',
      indicator: 'Prevalence of Wasting',
      value: 10.0,
      province: 'Province 1',
      district: 'District A',
    },
    {
      month: 'January',
      indicator: 'Exclusive Breastfeeding',
      value: 60.0,
      province: 'Province 1',
      district: 'District A',
    },
  ];

  const ws = XLSX.utils.json_to_sheet(template);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template');

  // Generate the Excel file as a blob
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};
