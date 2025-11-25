import React from 'react';

/**
 * FuzzyProgressBar - Progress bar showing a range (low-mid-high)
 */
const FuzzyProgressBar = ({ 
  low, 
  mid, 
  high, 
  max = null,
  label = '',
  unit = '',
  color = 'primary'
}) => {
  // Calculate max if not provided
  const effectiveMax = max || high * 1.2;
  
  // Calculate percentages
  const lowPct = (low / effectiveMax) * 100;
  const midPct = (mid / effectiveMax) * 100;
  const highPct = (high / effectiveMax) * 100;
  
  // Color schemes
  const colorSchemes = {
    primary: {
      bg: 'bg-primary-100',
      range: 'bg-primary-200',
      mid: 'bg-primary-600',
      text: 'text-primary-700',
    },
    green: {
      bg: 'bg-green-100',
      range: 'bg-green-200',
      mid: 'bg-green-600',
      text: 'text-green-700',
    },
    purple: {
      bg: 'bg-purple-100',
      range: 'bg-purple-200',
      mid: 'bg-purple-600',
      text: 'text-purple-700',
    },
    orange: {
      bg: 'bg-orange-100',
      range: 'bg-orange-200',
      mid: 'bg-orange-600',
      text: 'text-orange-700',
    },
  };
  
  const scheme = colorSchemes[color] || colorSchemes.primary;

  return (
    <div className="w-full mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className={`text-sm font-semibold ${scheme.text}`}>
          {mid}{unit}
        </span>
      </div>
      
      {/* Progress bar container */}
      <div className={`relative h-4 ${scheme.bg} rounded-full overflow-hidden`}>
        {/* Range indicator (low to high) */}
        <div
          className={`absolute h-full ${scheme.range} transition-all duration-500`}
          style={{ 
            left: `${lowPct}%`, 
            width: `${highPct - lowPct}%` 
          }}
        />
        
        {/* Mid point indicator */}
        <div
          className={`absolute h-full w-1 ${scheme.mid} shadow-md transition-all duration-500`}
          style={{ left: `${midPct}%` }}
        />
      </div>
      
      {/* Labels */}
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{low}{unit}</span>
        <span>{high}{unit}</span>
      </div>
    </div>
  );
};

export default FuzzyProgressBar;
