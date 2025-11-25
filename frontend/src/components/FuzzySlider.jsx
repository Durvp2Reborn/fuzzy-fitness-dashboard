import React from 'react';

/**
 * FuzzySlider - A slider component with linguistic labels
 */
const FuzzySlider = ({ 
  label, 
  value, 
  onChange, 
  min = 0, 
  max = 10, 
  step = 0.5,
  labels = null,
  color = 'primary'
}) => {
  // Default labels if not provided
  const defaultLabels = {
    0: 'None',
    2.5: 'Low',
    5: 'Medium',
    7.5: 'High',
    10: 'Max'
  };
  
  const displayLabels = labels || defaultLabels;
  
  // Get the current linguistic label
  const getCurrentLabel = () => {
    const sortedKeys = Object.keys(displayLabels)
      .map(Number)
      .sort((a, b) => a - b);
    
    for (let i = sortedKeys.length - 1; i >= 0; i--) {
      if (value >= sortedKeys[i]) {
        return displayLabels[sortedKeys[i]];
      }
    }
    return displayLabels[sortedKeys[0]];
  };

  // Calculate gradient position
  const percentage = ((value - min) / (max - min)) * 100;
  
  // Color schemes
  const colorSchemes = {
    primary: 'from-blue-400 to-blue-600',
    energy: 'from-yellow-400 to-green-500',
    soreness: 'from-green-400 to-red-500',
    stress: 'from-green-400 to-red-500',
    sleep: 'from-red-400 to-green-500',
  };

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="label">{label}</label>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-500">
            {getCurrentLabel()}
          </span>
          <span className="bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full text-sm font-semibold">
            {value.toFixed(1)}
          </span>
        </div>
      </div>
      
      <div className="relative">
        {/* Track background */}
        <div className="absolute inset-0 h-3 bg-gray-200 rounded-full" />
        
        {/* Filled track */}
        <div 
          className={`absolute h-3 rounded-full bg-gradient-to-r ${colorSchemes[color] || colorSchemes.primary}`}
          style={{ width: `${percentage}%` }}
        />
        
        {/* Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="relative w-full h-3 appearance-none bg-transparent cursor-pointer z-10
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-5
                     [&::-webkit-slider-thumb]:h-5
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-white
                     [&::-webkit-slider-thumb]:border-2
                     [&::-webkit-slider-thumb]:border-primary-600
                     [&::-webkit-slider-thumb]:shadow-lg
                     [&::-webkit-slider-thumb]:transition-transform
                     [&::-webkit-slider-thumb]:hover:scale-110
                     [&::-moz-range-thumb]:w-5
                     [&::-moz-range-thumb]:h-5
                     [&::-moz-range-thumb]:rounded-full
                     [&::-moz-range-thumb]:bg-white
                     [&::-moz-range-thumb]:border-2
                     [&::-moz-range-thumb]:border-primary-600"
        />
      </div>
      
      {/* Label markers */}
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        {Object.entries(displayLabels).map(([pos, text]) => (
          <span 
            key={pos}
            style={{ 
              position: 'absolute', 
              left: `${((parseFloat(pos) - min) / (max - min)) * 100}%`,
              transform: 'translateX(-50%)'
            }}
            className="relative"
          >
            {text}
          </span>
        ))}
      </div>
      <div className="h-4" /> {/* Spacer for labels */}
    </div>
  );
};

export default FuzzySlider;
