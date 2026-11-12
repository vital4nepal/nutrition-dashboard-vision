import csv from '@/assets/sample_nutrition_data.csv?raw';

export interface MonthPoint {
  name: string;
  value: number;
}

// Months appear in reporting order. A month with no row for an indicator is skipped, not zero-filled.
const rows = csv
  .trim()
  .split('\n')
  .slice(1)
  .map((line) => {
    const [month, indicator, value] = line.split(',');
    return { month, indicator, value: Number(value) };
  });

export const getMonthlySeries = (indicator: string): MonthPoint[] =>
  rows
    .filter((row) => row.indicator === indicator)
    .map((row) => ({ name: row.month.slice(0, 3), value: row.value }));
