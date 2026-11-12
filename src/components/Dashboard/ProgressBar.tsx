import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface ProgressBarProps {
  label: string;
  current: number;
  target: number;
  showTargetIndicator?: boolean;
  isReduction?: boolean;
}

const ProgressBar = ({ 
  label, 
  current, 
  target, 
  showTargetIndicator = true,
  isReduction = false
}: ProgressBarProps) => {
  // For reduction metrics (like stunting, anemia, wasting), lower is better
  // For improvement metrics (like breastfeeding), higher is better
  const isOnTrack = isReduction ? current <= target : current >= target;
  
  // Use standardized max values based on metric type
  const maxValue = isReduction ? 50 : 100;
  
  // Calculate the target position on the bar scale
  const targetPosition = (target / maxValue) * 100;
  const targetPercentage = Math.min(targetPosition, 98); // Cap at 98% to keep visible
  
  // Calculate current position on the bar scale
  const currentPosition = (current / maxValue) * 100;
  const currentPercentage = Math.min(currentPosition, 100); // Cap at 100%
  
  // Choose appropriate bar color based on progress and metric type
  const barColor = isOnTrack ? 'bg-green-500' : 'bg-amber-500';
  
  return (
    <div className="space-y-2">
      {/* Header with label and status dot */}
      <div className="flex justify-between items-center">
        <span className="font-medium text-gray-700 text-sm">{label}</span>
        <div className="flex items-center gap-1">
          <span className={`inline-block w-2 h-2 rounded-full ${barColor}`}></span>
        </div>
      </div>
      
      {/* Current value with indicator */}
      <div className="flex items-center gap-1">
        <span className="text-xl font-bold">{current}%</span>
        {isReduction ? (
          <ArrowDown className={`h-4 w-4 ${current > target ? 'text-red-500' : 'text-green-500'}`} />
        ) : (
          <ArrowUp className={`h-4 w-4 ${current < target ? 'text-red-500' : 'text-green-500'}`} />
        )}
      </div>
      
     
      
      {/* Progress bar container with proper spacing */}
      <div className="mt-1 mb-4 relative">
        {/* Progress bar */}
        <div className="h-3 bg-gray-100 rounded-full relative">
          {/* Current progress */}
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
            style={{ width: `${currentPercentage}%` }}
          />
          
          {/* Target indicator - fixed positioning */}
          {showTargetIndicator && (
            <div 
              className="absolute top-0 bottom-0 z-10" 
              style={{ 
                left: `${targetPercentage}%`,
                transform: 'translateX(-50%)'
              }}
            >
              <div className="absolute h-3 w-0.5 bg-black rounded-full" style={{ top: '-1px' }}></div>
              <div className="absolute h-3 w-0.5 bg-black rounded-full" style={{ bottom: '-1px' }}></div>
            </div>
          )}
        </div>
        
        {/* Add legends to explain what each element represents */}
        <div className="flex justify-between text-[9px] mt-2 text-gray-500">
          <div className="flex items-center">
            <span>Current: {current}%</span>
          </div>
          <div className="flex items-center">
            <span>Target: {target}%</span>
          </div>
        </div>
        
       
        {/* Add explanation text */}
        <div className="mt-2 text-[10px] text-gray-500">
          {isReduction ? (
            <p>Goal: Reduce {label.toLowerCase()} from {current}% to {target}% or lower
              {isOnTrack ? " (On Track)" : " (Needs Attention)"}
            </p>
          ) : (
            
            <p>Goal: Increase {label.toLowerCase()} from {current}% to {target}% or higher
              {isOnTrack ? " (On Track)" : " (Needs Attention)"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
