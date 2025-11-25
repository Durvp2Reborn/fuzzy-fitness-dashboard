import React from 'react';

/**
 * FuzzyGauge - An arc gauge component showing value with confidence
 */
const FuzzyGauge = ({ 
  value, 
  max = 100, 
  label = '', 
  confidence = 1,
  colorStops = null
}) => {
  // Default color stops for fitness intensity
  const defaultColorStops = [
    { stop: 0, color: '#ef4444' },    // red - rest
    { stop: 0.25, color: '#f97316' }, // orange - light
    { stop: 0.5, color: '#eab308' },  // yellow - moderate
    { stop: 0.75, color: '#22c55e' }, // green - hard
    { stop: 1, color: '#8b5cf6' },    // purple - beast
  ];
  
  const stops = colorStops || defaultColorStops;
  
  // Calculate the arc position
  const percentage = Math.min(value / max, 1);
  
  // Get color based on percentage
  const getColor = (pct) => {
    for (let i = stops.length - 1; i >= 0; i--) {
      if (pct >= stops[i].stop) {
        return stops[i].color;
      }
    }
    return stops[0].color;
  };

  const currentColor = getColor(percentage);
  
  // Arc path calculation
  const radius = 80;
  const centerX = 100;
  const centerY = 90;
  
  const startAngle = Math.PI;
  const endAngle = Math.PI + (percentage * Math.PI);
  
  const startX = centerX + radius * Math.cos(startAngle);
  const startY = centerY + radius * Math.sin(startAngle);
  const endX = centerX + radius * Math.cos(endAngle);
  const endY = centerY + radius * Math.sin(endAngle);
  
  const largeArcFlag = percentage > 0.5 ? 1 : 0;
  
  const pathD = `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
  
  // Background arc
  const bgEndX = centerX + radius * Math.cos(2 * Math.PI);
  const bgEndY = centerY + radius * Math.sin(2 * Math.PI);
  const bgPathD = `M ${startX} ${startY} A ${radius} ${radius} 0 1 1 ${bgEndX} ${bgEndY}`;

  return (
    <div className="relative w-full flex flex-col items-center">
      <svg viewBox="0 0 200 120" className="w-full max-w-[200px]">
        {/* Gradient definition */}
        <defs>
          <linearGradient id={`gaugeGradient-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
            {stops.map((stop, idx) => (
              <stop key={idx} offset={`${stop.stop * 100}%`} stopColor={stop.color} />
            ))}
          </linearGradient>
        </defs>
        
        {/* Background arc */}
        <path
          d={bgPathD}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="16"
          strokeLinecap="round"
        />
        
        {/* Value arc */}
        {percentage > 0 && (
          <path
            d={pathD}
            fill="none"
            stroke={`url(#gaugeGradient-${label})`}
            strokeWidth="16"
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 2px 4px ${currentColor}40)`
            }}
          />
        )}
        
        {/* Center value */}
        <text
          x="100"
          y="80"
          textAnchor="middle"
          className="text-3xl font-bold"
          fill={currentColor}
        >
          {Math.round(value)}
        </text>
        
        {/* Label */}
        <text
          x="100"
          y="100"
          textAnchor="middle"
          className="text-sm"
          fill="#6b7280"
        >
          {label}
        </text>
      </svg>
      
      {/* Confidence indicator */}
      <div className="mt-2 w-full max-w-[150px]">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Confidence</span>
          <span>{Math.round(confidence * 100)}%</span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-500"
            style={{ width: `${confidence * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default FuzzyGauge;
