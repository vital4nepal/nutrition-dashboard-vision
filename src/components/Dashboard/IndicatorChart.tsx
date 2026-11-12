import { Bar, BarChart, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { TrendingDown, TrendingUp } from 'lucide-react';
import type { MonthPoint } from '@/data/monthlyIndicators';

interface IndicatorChartProps {
  title: string;
  data: MonthPoint[];
}

const format = (value: number) => value.toLocaleString('en-US');

const IndicatorChart = ({ title, data }: IndicatorChartProps) => {
  const latest = data[data.length - 1];
  const previous = data.length > 1 ? data[data.length - 2] : undefined;
  const change = previous ? latest.value - previous.value : 0;
  const ChangeIcon = change < 0 ? TrendingDown : TrendingUp;

  return (
    <div className="bg-muted p-4 rounded-lg border border-border">
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      <p className="mt-1 text-3xl font-semibold text-primary">{format(latest.value)}</p>
      <p className="text-sm text-muted-foreground flex items-center gap-1 min-h-[20px]">
        {previous && (
          <>
            <ChangeIcon className="h-4 w-4" aria-hidden="true" />
            {change > 0 ? '+' : ''}
            {format(change)} from {previous.name}
          </>
        )}
      </p>
      <div className="h-[180px] mt-2 text-primary">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 8, left: 8, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 14 }} tickLine={false} axisLine={false} />
            <YAxis hide domain={[0, 'dataMax']} />
            <Bar dataKey="value" name={title} fill="currentColor" radius={[4, 4, 0, 0]} isAnimationActive={false}>
              <LabelList
                dataKey="value"
                position="top"
                formatter={format}
                fontSize={14}
                className="fill-foreground"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IndicatorChart;
