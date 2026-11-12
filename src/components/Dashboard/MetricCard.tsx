
import React from 'react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  className?: string;
}

const MetricCard = ({ title, value, subtitle, className }: MetricCardProps) => {
  return (
    <div className={cn("bg-white p-6 rounded-lg shadow-sm", className)}>
      <h3 className="text-sm font-medium text-[#22C55E]">{title}</h3>
      <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
      {subtitle && (
        <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
      )}
    </div>
  );
};

export default MetricCard;
