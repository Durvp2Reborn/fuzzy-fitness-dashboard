import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';

/**
 * DistributionChart - Bell curve visualization for fuzzy ranges
 */
const DistributionChart = ({ 
  low, 
  mid, 
  high, 
  label = '', 
  unit = '',
  color = '#3b82f6'
}) => {
  // Generate bell curve data points
  const generateBellCurve = () => {
    const data = [];
    const range = high - low;
    const step = range / 50;
    const sigma = range / 4; // Standard deviation approximation
    
    for (let x = low - range * 0.2; x <= high + range * 0.2; x += step) {
      // Gaussian function
      const y = Math.exp(-Math.pow(x - mid, 2) / (2 * sigma * sigma));
      data.push({ x: Math.round(x * 10) / 10, y, value: y });
    }
    
    return data;
  };

  const data = generateBellCurve();

  return (
    <div className="w-full">
      <div className="text-sm font-medium text-gray-700 mb-2">{label}</div>
      
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 20 }}>
            <defs>
              <linearGradient id={`gradient-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={color} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            
            <XAxis 
              dataKey="x" 
              type="number"
              domain={['dataMin', 'dataMax']}
              tick={{ fontSize: 10 }}
              tickFormatter={(val) => `${Math.round(val)}${unit}`}
            />
            <YAxis hide />
            
            {/* Reference lines for range */}
            <ReferenceLine 
              x={low} 
              stroke="#94a3b8" 
              strokeDasharray="3 3"
              label={{ value: 'Low', position: 'bottom', fontSize: 10 }}
            />
            <ReferenceLine 
              x={mid} 
              stroke={color} 
              strokeWidth={2}
              label={{ value: 'Est.', position: 'top', fontSize: 10, fill: color }}
            />
            <ReferenceLine 
              x={high} 
              stroke="#94a3b8" 
              strokeDasharray="3 3"
              label={{ value: 'High', position: 'bottom', fontSize: 10 }}
            />
            
            <Area
              type="monotone"
              dataKey="y"
              stroke={color}
              strokeWidth={2}
              fill={`url(#gradient-${label})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Value indicators */}
      <div className="flex justify-between text-xs mt-1">
        <span className="text-gray-500">{low}{unit}</span>
        <span className="font-semibold text-primary-600">{mid}{unit}</span>
        <span className="text-gray-500">{high}{unit}</span>
      </div>
    </div>
  );
};

export default DistributionChart;
