import React from 'react';
import FuzzyGauge from './FuzzyGauge';
import RecommendationCard from './RecommendationCard';

/**
 * ReadinessCard - Display for daily workout readiness
 */
const ReadinessCard = ({ data }) => {
  if (!data) {
    return (
      <div className="card animate-pulse">
        <div className="h-48 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const { intensity, label, confidence, recommendation, input_memberships } = data;

  // Label colors and icons
  const labelStyles = {
    Rest: { color: 'text-red-500', bgColor: 'bg-red-100', icon: '😴' },
    Light: { color: 'text-orange-500', bgColor: 'bg-orange-100', icon: '🚶' },
    Moderate: { color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: '🏃' },
    Hard: { color: 'text-green-500', bgColor: 'bg-green-100', icon: '💪' },
    Beast: { color: 'text-purple-500', bgColor: 'bg-purple-100', icon: '🔥' },
  };

  const style = labelStyles[label] || labelStyles.Moderate;

  // Get dominant membership for each input
  const getDominant = (memberships) => {
    let max = 0;
    let dominant = '';
    Object.entries(memberships).forEach(([key, val]) => {
      if (val > max) {
        max = val;
        dominant = key;
      }
    });
    return { dominant, value: max };
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Workout Readiness</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${style.bgColor} ${style.color}`}>
          {style.icon} {label}
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Gauge */}
        <div className="flex-1 flex justify-center">
          <FuzzyGauge
            value={intensity}
            max={100}
            label="Intensity"
            confidence={confidence}
          />
        </div>

        {/* Input memberships */}
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-600 mb-3">Input Analysis</h4>
          <div className="space-y-2">
            {input_memberships && Object.entries(input_memberships).map(([key, memberships]) => {
              const { dominant, value } = getDominant(memberships);
              return (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">{key}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full"
                        style={{ width: `${value * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-16 capitalize">{dominant}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="mt-6">
        <RecommendationCard
          title="Today's Recommendation"
          recommendation={recommendation}
          icon={style.icon}
          variant={label === 'Beast' || label === 'Hard' ? 'success' : label === 'Rest' ? 'warning' : 'default'}
        />
      </div>
    </div>
  );
};

export default ReadinessCard;
