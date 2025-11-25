import React from 'react';
import DistributionChart from './DistributionChart';
import RecommendationCard from './RecommendationCard';

/**
 * BodyCompCard - Display for body composition estimates
 */
const BodyCompCard = ({ data }) => {
  if (!data) {
    return (
      <div className="card animate-pulse">
        <div className="h-48 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const {
    body_fat_low,
    body_fat_mid,
    body_fat_high,
    muscle_mass_category,
    bmi,
    bmi_interpretation,
    recommendation
  } = data;

  // BMI color coding
  const getBMIColor = () => {
    if (bmi < 18.5) return 'text-yellow-600';
    if (bmi < 25) return 'text-green-600';
    if (bmi < 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Muscle mass icon
  const getMuscleIcon = () => {
    switch (muscle_mass_category) {
      case 'Below Average': return '📉';
      case 'Average': return '📊';
      case 'Above Average': return '📈';
      case 'Athletic': return '💪';
      default: return '📊';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Body Composition</h3>
        <span className="text-2xl">🏋️</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Body Fat Distribution */}
        <div>
          <DistributionChart
            low={body_fat_low}
            mid={body_fat_mid}
            high={body_fat_high}
            label="Body Fat Estimate"
            unit="%"
            color="#8b5cf6"
          />
        </div>

        {/* Stats */}
        <div className="space-y-4">
          {/* BMI */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">BMI</span>
              <span className={`text-2xl font-bold ${getBMIColor()}`}>{bmi}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1 capitalize">
              Interpretation: {bmi_interpretation}
            </p>
          </div>

          {/* Muscle Mass */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Muscle Mass</span>
              <span className="text-xl">{getMuscleIcon()}</span>
            </div>
            <p className="text-lg font-semibold text-gray-800 mt-1">
              {muscle_mass_category}
            </p>
          </div>

          {/* Body Fat Range */}
          <div className="bg-gray-50 rounded-lg p-4">
            <span className="text-sm text-gray-600">Body Fat Range</span>
            <p className="text-lg font-semibold text-purple-600 mt-1">
              {body_fat_low}% - {body_fat_high}%
            </p>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="mt-6">
        <RecommendationCard
          title="Body Composition Insights"
          recommendation={recommendation}
          icon="📊"
          variant="info"
        />
      </div>
    </div>
  );
};

export default BodyCompCard;
