import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FuzzySlider from '../components/FuzzySlider';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * InputForm - Form to enter all fuzzy inputs
 */
const InputForm = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('readiness');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Readiness inputs
  const [sleep, setSleep] = useState(7);
  const [energy, setEnergy] = useState(6);
  const [soreness, setSoreness] = useState(4);
  const [stress, setStress] = useState(3);

  // Body composition inputs
  const [weight, setWeight] = useState(75);
  const [height, setHeight] = useState(175);
  const [waist, setWaist] = useState(82);
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [buildType, setBuildType] = useState('mesomorph');

  // Strength inputs
  const [weightLifted, setWeightLifted] = useState(100);
  const [reps, setReps] = useState('6');
  const [rpe, setRpe] = useState(8);
  const [formQuality, setFormQuality] = useState('good');

  // Nutrition inputs
  const [nutritionWeight, setNutritionWeight] = useState(75);
  const [goal, setGoal] = useState('maintain');
  const [nutritionActivityLevel, setNutritionActivityLevel] = useState('moderate');
  const [metabolism, setMetabolism] = useState('normal');
  const [adherence, setAdherence] = useState(0.7);

  const tabs = [
    { id: 'readiness', label: 'Readiness', icon: '🏃' },
    { id: 'bodyComp', label: 'Body Comp', icon: '📊' },
    { id: 'strength', label: 'Strength', icon: '💪' },
    { id: 'nutrition', label: 'Nutrition', icon: '🍽️' },
  ];

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const inputs = {
      readiness: { sleep, energy, soreness, stress },
      bodyComp: { weight, height, waist, activity_level: activityLevel, build_type: buildType },
      strength: { weight_lifted: weightLifted, reps, rpe, form_quality: formQuality },
      nutrition: {
        weight: nutritionWeight,
        goal,
        activity_level: nutritionActivityLevel,
        metabolism,
        adherence
      }
    };

    try {
      // Test connection with a simple request
      await axios.post(`${API_BASE}/api/readiness`, inputs.readiness);
      
      // Save to localStorage
      localStorage.setItem('fitnessInputs', JSON.stringify(inputs));
      
      // Navigate to dashboard
      navigate('/');
    } catch (err) {
      console.error('Error submitting data:', err);
      setError('Failed to connect to the server. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const renderReadinessForm = () => (
    <div className="space-y-6">
      <p className="text-gray-600 mb-4">
        Rate your current physical and mental state to get personalized workout recommendations.
      </p>
      
      <FuzzySlider
        label="😴 Sleep Quality"
        value={sleep}
        onChange={setSleep}
        color="sleep"
        labels={{ 0: 'Terrible', 2.5: 'Poor', 5: 'Okay', 7.5: 'Good', 10: 'Amazing' }}
      />
      
      <FuzzySlider
        label="⚡ Energy Level"
        value={energy}
        onChange={setEnergy}
        color="energy"
        labels={{ 0: 'Exhausted', 2.5: 'Low', 5: 'Normal', 7.5: 'High', 10: 'Supercharged' }}
      />
      
      <FuzzySlider
        label="🦵 Muscle Soreness"
        value={soreness}
        onChange={setSoreness}
        color="soreness"
        labels={{ 0: 'None', 2.5: 'Slight', 5: 'Moderate', 7.5: 'High', 10: 'Can\'t Move' }}
      />
      
      <FuzzySlider
        label="🧠 Stress Level"
        value={stress}
        onChange={setStress}
        color="stress"
        labels={{ 0: 'Zen', 2.5: 'Relaxed', 5: 'Normal', 7.5: 'Stressed', 10: 'Overwhelmed' }}
      />
    </div>
  );

  const renderBodyCompForm = () => (
    <div className="space-y-6">
      <p className="text-gray-600 mb-4">
        Enter your body measurements for body composition estimates.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="label">Weight (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
            className="input-field"
            min="30"
            max="200"
          />
        </div>
        
        <div>
          <label className="label">Height (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
            className="input-field"
            min="100"
            max="250"
          />
        </div>
        
        <div>
          <label className="label">Waist (cm)</label>
          <input
            type="number"
            value={waist}
            onChange={(e) => setWaist(parseFloat(e.target.value) || 0)}
            className="input-field"
            min="40"
            max="150"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Activity Level</label>
          <select
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value)}
            className="input-field"
          >
            <option value="sedentary">Sedentary (desk job)</option>
            <option value="light">Light (1-2 days/week)</option>
            <option value="moderate">Moderate (3-5 days/week)</option>
            <option value="active">Active (6-7 days/week)</option>
            <option value="very_active">Very Active (athlete)</option>
          </select>
        </div>
        
        <div>
          <label className="label">Body Type</label>
          <select
            value={buildType}
            onChange={(e) => setBuildType(e.target.value)}
            className="input-field"
          >
            <option value="ectomorph">Ectomorph (naturally lean)</option>
            <option value="mesomorph">Mesomorph (athletic build)</option>
            <option value="endomorph">Endomorph (naturally stocky)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStrengthForm = () => (
    <div className="space-y-6">
      <p className="text-gray-600 mb-4">
        Enter your lift data to estimate your one-rep max. You can use fuzzy terms like "around 6" for reps.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Weight Lifted (kg)</label>
          <input
            type="number"
            value={weightLifted}
            onChange={(e) => setWeightLifted(parseFloat(e.target.value) || 0)}
            className="input-field"
            min="1"
            max="500"
          />
        </div>
        
        <div>
          <label className="label">Reps (can be fuzzy like "around 6")</label>
          <input
            type="text"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="input-field"
            placeholder="e.g., 6 or 'around 6' or '5-7'"
          />
        </div>
      </div>

      <FuzzySlider
        label="💯 RPE (Rate of Perceived Exertion)"
        value={rpe}
        onChange={setRpe}
        min={1}
        max={10}
        step={0.5}
        labels={{ 1: 'Very Easy', 4: 'Moderate', 7: 'Hard', 10: 'Max' }}
      />

      <div>
        <label className="label">Form Quality</label>
        <div className="grid grid-cols-4 gap-2">
          {['poor', 'fair', 'good', 'excellent'].map((quality) => (
            <button
              key={quality}
              onClick={() => setFormQuality(quality)}
              className={`p-3 rounded-lg border-2 transition-all capitalize ${
                formQuality === quality
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {quality}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNutritionForm = () => (
    <div className="space-y-6">
      <p className="text-gray-600 mb-4">
        Set your nutrition preferences to get personalized macro targets.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Weight (kg)</label>
          <input
            type="number"
            value={nutritionWeight}
            onChange={(e) => setNutritionWeight(parseFloat(e.target.value) || 0)}
            className="input-field"
            min="30"
            max="200"
          />
        </div>
        
        <div>
          <label className="label">Goal</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'cut', icon: '🔥', label: 'Cut' },
              { value: 'maintain', icon: '⚖️', label: 'Maintain' },
              { value: 'bulk', icon: '📈', label: 'Bulk' },
            ].map((g) => (
              <button
                key={g.value}
                onClick={() => setGoal(g.value)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  goal === g.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-xl">{g.icon}</span>
                <p className="text-sm mt-1">{g.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Activity Level</label>
          <select
            value={nutritionActivityLevel}
            onChange={(e) => setNutritionActivityLevel(e.target.value)}
            className="input-field"
          >
            <option value="sedentary">Sedentary</option>
            <option value="light">Light</option>
            <option value="moderate">Moderate</option>
            <option value="active">Active</option>
            <option value="very_active">Very Active</option>
          </select>
        </div>
        
        <div>
          <label className="label">Metabolism</label>
          <select
            value={metabolism}
            onChange={(e) => setMetabolism(e.target.value)}
            className="input-field"
          >
            <option value="slow">Slow (gain weight easily)</option>
            <option value="normal">Normal</option>
            <option value="fast">Fast (hard to gain weight)</option>
          </select>
        </div>
      </div>

      <FuzzySlider
        label="📋 Diet Adherence"
        value={adherence}
        onChange={setAdherence}
        min={0}
        max={1}
        step={0.05}
        labels={{ 0: 'Low', 0.25: 'Fair', 0.5: 'Moderate', 0.75: 'Good', 1: 'Excellent' }}
      />
    </div>
  );

  const renderActiveForm = () => {
    switch (activeTab) {
      case 'readiness':
        return renderReadinessForm();
      case 'bodyComp':
        return renderBodyCompForm();
      case 'strength':
        return renderStrengthForm();
      case 'nutrition':
        return renderNutritionForm();
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gradient mb-2">Enter Your Data</h2>
        <p className="text-gray-600">Fill in the forms below to get personalized recommendations</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex bg-gray-100 rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'bg-white shadow-md text-primary-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form Card */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
          <span>{tabs.find(t => t.id === activeTab)?.icon}</span>
          <span>{tabs.find(t => t.id === activeTab)?.label}</span>
        </h3>

        {renderActiveForm()}

        {/* Error message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => {
              const currentIndex = tabs.findIndex(t => t.id === activeTab);
              if (currentIndex > 0) {
                setActiveTab(tabs[currentIndex - 1].id);
              }
            }}
            disabled={activeTab === tabs[0].id}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {activeTab === tabs[tabs.length - 1].id ? (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Calculate Results</span>
                  <span>→</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => {
                const currentIndex = tabs.findIndex(t => t.id === activeTab);
                if (currentIndex < tabs.length - 1) {
                  setActiveTab(tabs[currentIndex + 1].id);
                }
              }}
              className="btn-primary"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputForm;
