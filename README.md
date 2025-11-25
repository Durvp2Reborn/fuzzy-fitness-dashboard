# 🏋️ Fuzzy Fitness Dashboard

A web-based fitness calculator and dashboard that uses **fuzzy logic** to provide personalized, uncertainty-aware fitness recommendations. Unlike traditional calculators that give precise numbers, this application embraces the inherent uncertainty in fitness metrics and provides ranges and confidence levels.

![Fuzzy Fitness Dashboard](https://img.shields.io/badge/Fuzzy-Logic-blue) ![Python](https://img.shields.io/badge/Python-3.12+-green) ![React](https://img.shields.io/badge/React-18-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-0.109-teal)

## ✨ Features

### 🏃 Workout Readiness Calculator
- Assess daily readiness based on **sleep quality**, **energy levels**, **muscle soreness**, and **stress**
- Get intensity recommendations: Rest → Light → Moderate → Hard → Beast Mode
- View fuzzy membership values for each input factor

### 📊 Body Composition Estimator
- Estimate body fat percentage with **confidence ranges**
- Fuzzy BMI interpretation (not just "normal" but "70% normal, 30% overweight")
- Muscle mass category assessment based on activity and build type

### 💪 1RM (One-Rep Max) Estimator
- Support for **fuzzy rep counts** like "around 6" or "5-7 reps"
- Accounts for RPE (Rate of Perceived Exertion) and form quality
- Provides training zones for strength, hypertrophy, and endurance

### 🍽️ Nutrition Calculator
- Goal-based macro calculations (cut, maintain, bulk)
- Adjusts ranges based on metabolism and diet adherence
- Flexible targets that account for real-world variability

## 🧠 Fuzzy Logic Concepts

This application uses **fuzzy logic** instead of crisp calculations because:

1. **Human inputs are fuzzy**: "I slept well" doesn't mean exactly 8.0 hours
2. **Fitness metrics have uncertainty**: Your true 1RM varies day-to-day
3. **Ranges are more useful**: Knowing your body fat is "15-18%" is more honest than "16.3%"

### Membership Functions

We use **triangular membership functions** to model linguistic terms:

```
Poor Sleep        Fair Sleep        Good Sleep
    ▲                 ▲                 ▲
   /\               /   \             /  \
  /  \             /     \           /    \
 /    \           /       \         /      \
──────────────────────────────────────────────
0    2    4    6    8    10
```

### Fuzzy Rules

Rules combine inputs using fuzzy AND/OR operations:
- IF sleep is **good** AND energy is **high** AND soreness is **low** → intensity is **beast**
- IF sleep is **poor** OR stress is **high** → intensity is **rest**

### Defuzzification

The output is "defuzzified" using the **centroid method** to produce a crisp recommendation while maintaining uncertainty information.

## 🚀 Quick Start

### Prerequisites

- Python 3.12+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/health`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The dashboard will be available at `http://localhost:3000`

## 📡 API Documentation

### POST `/api/readiness`

Calculate workout readiness score.

**Request:**
```json
{
  "sleep": 8,
  "energy": 7,
  "soreness": 3,
  "stress": 2
}
```

**Response:**
```json
{
  "intensity": 75.5,
  "label": "Hard",
  "confidence": 0.85,
  "recommendation": "Great conditions for a challenging workout!",
  "input_memberships": {
    "sleep": {"poor": 0, "fair": 0, "good": 0.5},
    "energy": {"low": 0, "medium": 0.33, "high": 0.25}
  }
}
```

### POST `/api/body-composition`

Estimate body composition.

**Request:**
```json
{
  "weight": 80,
  "height": 180,
  "waist": 85,
  "activity_level": "active",
  "build_type": "mesomorph"
}
```

**Response:**
```json
{
  "body_fat_low": 12.5,
  "body_fat_mid": 15.0,
  "body_fat_high": 17.5,
  "muscle_mass_category": "Athletic",
  "bmi": 24.7,
  "bmi_interpretation": "80% normal, 20% overweight",
  "recommendation": "..."
}
```

### POST `/api/one-rep-max`

Estimate 1RM with fuzzy rep input.

**Request:**
```json
{
  "weight_lifted": 100,
  "reps": "around 6",
  "rpe": 8,
  "form_quality": "good"
}
```

**Response:**
```json
{
  "one_rm_low": 118.5,
  "one_rm_mid": 125.0,
  "one_rm_high": 131.5,
  "confidence": 0.78,
  "recommendation": "..."
}
```

### POST `/api/nutrition`

Calculate macro targets.

**Request:**
```json
{
  "weight": 80,
  "goal": "bulk",
  "activity_level": "active",
  "metabolism": "normal",
  "adherence": 0.8
}
```

**Response:**
```json
{
  "calories_low": 3200,
  "calories_mid": 3500,
  "calories_high": 3800,
  "protein_low": 165,
  "protein_mid": 176,
  "protein_high": 187,
  "carbs_low": 380,
  "carbs_mid": 420,
  "carbs_high": 460,
  "fat_low": 70,
  "fat_mid": 78,
  "fat_high": 86,
  "recommendation": "..."
}
```

## 🏗️ Project Structure

```
fuzzy-fitness-dashboard/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application
│   │   ├── models/
│   │   │   └── schemas.py       # Pydantic models
│   │   ├── fuzzy_engine/
│   │   │   ├── readiness.py     # Workout readiness calculator
│   │   │   ├── body_comp.py     # Body composition estimator
│   │   │   ├── strength.py      # 1RM estimator
│   │   │   └── nutrition.py     # Macro calculator
│   │   └── recommendations/
│   │       └── generator.py     # NL recommendation generator
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── FuzzySlider.jsx
│   │   │   ├── FuzzyGauge.jsx
│   │   │   ├── DistributionChart.jsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   └── InputForm.jsx
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 🎨 UI Components

| Component | Description |
|-----------|-------------|
| `FuzzySlider` | Slider with linguistic labels (e.g., "Low", "Medium", "High") |
| `FuzzyGauge` | Arc gauge showing value with confidence indicator |
| `DistributionChart` | Bell curve visualization for ranges |
| `FuzzyProgressBar` | Progress bar showing low-mid-high range |
| `RecommendationCard` | Natural language feedback display |

## 🔧 Configuration

### Backend Environment Variables

```bash
# Optional: Set custom host/port
HOST=0.0.0.0
PORT=8000
```

### Frontend Environment Variables

```bash
# In frontend/.env
REACT_APP_API_URL=http://localhost:8000
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📚 References

- [Fuzzy Logic - Stanford Encyclopedia](https://plato.stanford.edu/entries/logic-fuzzy/)
- [scikit-fuzzy Documentation](https://pythonhosted.org/scikit-fuzzy/)
- [Brzycki 1RM Formula](https://en.wikipedia.org/wiki/One-repetition_maximum)
- [RPE Scale](https://www.strongerbyscience.com/autoregulation/)

## 📄 License

MIT License - Feel free to use and modify for your fitness tracking needs!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
