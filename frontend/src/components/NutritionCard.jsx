import React from 'react';
import FuzzyProgressBar from './FuzzyProgressBar';
import RecommendationCard from './RecommendationCard';

/**
 * NutritionCard - Display for macro targets
 */
const NutritionCard = ({ data, goal = 'maintain' }) => {
  if (!data) {
    return (
      <div className="card animate-pulse">
        <div className="h-48 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const {
    calories_low, calories_mid, calories_high,
    protein_low, protein_mid, protein_high,
    carbs_low, carbs_mid, carbs_high,
    fat_low, fat_mid, fat_high,
    recommendation
  } = data;

  // Goal styling
  const goalStyles = {
    cut: { icon: '🔥', color: 'text-orange-600', bg: 'bg-orange-100' },
    maintain: { icon: '⚖️', color: 'text-blue-600', bg: 'bg-blue-100' },
    bulk: { icon: '📈', color: 'text-green-600', bg: 'bg-green-100' },
  };

  const style = goalStyles[goal] || goalStyles.maintain;

  // Macro colors
  const macroInfo = [
    {
      name: 'Calories',
      low: calories_low,
      mid: calories_mid,
      high: calories_high,
      unit: ' kcal',
      color: 'primary',
      icon: '⚡',
    },
    {
      name: 'Protein',
      low: protein_low,
      mid: protein_mid,
      high: protein_high,
      unit: 'g',
      color: 'purple',
      icon: '🥩',
    },
    {
      name: 'Carbs',
      low: carbs_low,
      mid: carbs_mid,
      high: carbs_high,
      unit: 'g',
      color: 'orange',
      icon: '🍚',
    },
    {
      name: 'Fat',
      low: fat_low,
      mid: fat_mid,
      high: fat_high,
      unit: 'g',
      color: 'green',
      icon: '🥑',
    },
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Nutrition Targets</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${style.bg} ${style.color} capitalize`}>
          {style.icon} {goal}
        </span>
      </div>

      {/* Calorie display */}
      <div className="bg-gradient-to-r from-primary-50 to-indigo-50 rounded-xl p-6 mb-6 text-center">
        <span className="text-sm text-gray-600">Daily Calorie Target</span>
        <p className="text-4xl font-bold text-primary-600 mt-1">{calories_mid}</p>
        <p className="text-sm text-gray-500 mt-1">
          Range: {calories_low} - {calories_high} kcal
        </p>
      </div>

      {/* Macro breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {macroInfo.slice(1).map((macro) => (
          <div key={macro.name} className="bg-gray-50 rounded-lg p-4 text-center">
            <span className="text-2xl">{macro.icon}</span>
            <h4 className="text-sm text-gray-600 mt-1">{macro.name}</h4>
            <p className="text-2xl font-bold text-gray-800">{macro.mid}{macro.unit}</p>
            <p className="text-xs text-gray-500">{macro.low} - {macro.high}{macro.unit}</p>
          </div>
        ))}
      </div>

      {/* Progress bars */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-700">Macro Ranges</h4>
        {macroInfo.map((macro) => (
          <FuzzyProgressBar
            key={macro.name}
            low={macro.low}
            mid={macro.mid}
            high={macro.high}
            label={`${macro.icon} ${macro.name}`}
            unit={macro.unit}
            color={macro.color}
          />
        ))}
      </div>

      {/* Recommendation */}
      <div className="mt-6">
        <RecommendationCard
          title="Nutrition Strategy"
          recommendation={recommendation}
          icon="🍽️"
          variant={goal === 'bulk' ? 'success' : goal === 'cut' ? 'warning' : 'default'}
        />
      </div>
    </div>
  );
};

export default NutritionCard;
