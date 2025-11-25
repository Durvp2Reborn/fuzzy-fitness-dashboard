import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ReadinessCard from '../components/ReadinessCard';
import BodyCompCard from '../components/BodyCompCard';
import StrengthCard from '../components/StrengthCard';
import NutritionCard from '../components/NutritionCard';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Dashboard - Main dashboard combining all cards
 */
const Dashboard = () => {
  const [readinessData, setReadinessData] = useState(null);
  const [bodyCompData, setBodyCompData] = useState(null);
  const [strengthData, setStrengthData] = useState(null);
  const [nutritionData, setNutritionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [goal, setGoal] = useState('maintain');

  const getDefaultInputs = useCallback(() => ({
    readiness: { sleep: 7, energy: 6, soreness: 4, stress: 3 },
    bodyComp: { weight: 75, height: 175, waist: 82, activity_level: 'moderate', build_type: 'mesomorph' },
    strength: { weight_lifted: 100, reps: '6', rpe: 8, form_quality: 'good' },
    nutrition: { weight: 75, goal: 'maintain', activity_level: 'moderate', metabolism: 'normal', adherence: 0.7 }
  }), []);

  const fetchAllData = useCallback(async (inputs) => {
    setLoading(true);
    setError(null);

    try {
      const [readinessRes, bodyCompRes, strengthRes, nutritionRes] = await Promise.all([
        axios.post(`${API_BASE}/api/readiness`, inputs.readiness),
        axios.post(`${API_BASE}/api/body-composition`, inputs.bodyComp),
        axios.post(`${API_BASE}/api/one-rep-max`, inputs.strength),
        axios.post(`${API_BASE}/api/nutrition`, inputs.nutrition)
      ]);

      setReadinessData(readinessRes.data);
      setBodyCompData(bodyCompRes.data);
      setStrengthData(strengthRes.data);
      setNutritionData(nutritionRes.data);
      setGoal(inputs.nutrition?.goal || 'maintain');
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load saved data from localStorage on mount
  useEffect(() => {
    const loadSavedData = () => {
      try {
        const savedInputs = localStorage.getItem('fitnessInputs');
        if (savedInputs) {
          const inputs = JSON.parse(savedInputs);
          setGoal(inputs.nutrition?.goal || 'maintain');
          fetchAllData(inputs);
        } else {
          // Use default demo data
          fetchAllData(getDefaultInputs());
        }
      } catch (err) {
        console.error('Error loading saved data:', err);
        fetchAllData(getDefaultInputs());
      }
    };

    loadSavedData();
  }, [fetchAllData, getDefaultInputs]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your fitness data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <span className="text-3xl mb-2 block">⚠️</span>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Connection Error</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => fetchAllData(getDefaultInputs())}
          className="btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gradient mb-2">Your Fitness Dashboard</h2>
        <p className="text-gray-600">Powered by fuzzy logic for personalized recommendations</p>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickStat 
          icon="🏃" 
          label="Readiness" 
          value={readinessData?.label || '-'} 
          color="blue" 
        />
        <QuickStat 
          icon="📊" 
          label="Body Fat" 
          value={`${bodyCompData?.body_fat_mid || '-'}%`} 
          color="purple" 
        />
        <QuickStat 
          icon="💪" 
          label="Est. 1RM" 
          value={`${strengthData?.one_rm_mid || '-'} kg`} 
          color="green" 
        />
        <QuickStat 
          icon="🍽️" 
          label="Calories" 
          value={nutritionData?.calories_mid || '-'} 
          color="orange" 
        />
      </div>

      {/* Main Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReadinessCard data={readinessData} />
        <BodyCompCard data={bodyCompData} />
        <StrengthCard data={strengthData} lift="Bench Press" />
        <NutritionCard data={nutritionData} goal={goal} />
      </div>
    </div>
  );
};

// Quick stat component
const QuickStat = ({ icon, label, value, color }) => {
  const colors = {
    blue: 'from-blue-50 to-blue-100 text-blue-700',
    purple: 'from-purple-50 to-purple-100 text-purple-700',
    green: 'from-green-50 to-green-100 text-green-700',
    orange: 'from-orange-50 to-orange-100 text-orange-700',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-xl p-4 text-center`}>
      <span className="text-2xl">{icon}</span>
      <p className="text-xs text-gray-600 mt-1">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
};

export default Dashboard;
