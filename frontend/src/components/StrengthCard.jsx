import React from 'react';
import DistributionChart from './DistributionChart';
import FuzzyProgressBar from './FuzzyProgressBar';
import RecommendationCard from './RecommendationCard';

/**
 * StrengthCard - Display for 1RM estimates
 */
const StrengthCard = ({ data, lift = 'Lift' }) => {
  if (!data) {
    return (
      <div className="card animate-pulse">
        <div className="h-48 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const { one_rm_low, one_rm_mid, one_rm_high, confidence, recommendation } = data;

  // Training zone calculations
  const zones = [
    { name: 'Strength', pct: [0.8, 0.9], reps: '3-5', color: 'purple' },
    { name: 'Hypertrophy', pct: [0.65, 0.75], reps: '8-12', color: 'green' },
    { name: 'Endurance', pct: [0.5, 0.6], reps: '15-20', color: 'orange' },
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">1RM Estimate</h3>
        <span className="text-2xl">🏆</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distribution Chart */}
        <div>
          <DistributionChart
            low={one_rm_low}
            mid={one_rm_mid}
            high={one_rm_high}
            label={`Estimated 1RM for ${lift}`}
            unit=" kg"
            color="#22c55e"
          />
          
          {/* Confidence indicator */}
          <div className="mt-4 bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">Estimate Confidence</span>
              <span className="text-sm font-semibold text-primary-600">
                {Math.round(confidence * 100)}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-500"
                style={{ width: `${confidence * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Training Zones */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Training Zones</h4>
          
          {zones.map((zone) => (
            <div key={zone.name} className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{zone.name}</span>
                <span className="text-gray-500">{zone.reps} reps</span>
              </div>
              <FuzzyProgressBar
                low={Math.round(one_rm_mid * zone.pct[0])}
                mid={Math.round(one_rm_mid * (zone.pct[0] + zone.pct[1]) / 2)}
                high={Math.round(one_rm_mid * zone.pct[1])}
                max={one_rm_high}
                label=""
                unit=" kg"
                color={zone.color}
              />
            </div>
          ))}

          {/* 1RM Display */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 text-center mt-4">
            <span className="text-sm text-gray-600">Estimated 1RM</span>
            <p className="text-3xl font-bold text-green-600">{one_rm_mid} kg</p>
            <p className="text-xs text-gray-500 mt-1">
              Range: {one_rm_low} - {one_rm_high} kg
            </p>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="mt-6">
        <RecommendationCard
          title="Strength Training Advice"
          recommendation={recommendation}
          icon="💪"
          variant="success"
        />
      </div>
    </div>
  );
};

export default StrengthCard;
