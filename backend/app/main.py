"""FastAPI application for Fuzzy Fitness Dashboard."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.models.schemas import (
    ReadinessInput, ReadinessOutput,
    BodyCompInput, BodyCompOutput,
    StrengthInput, StrengthOutput,
    NutritionInput, NutritionOutput,
)
from app.fuzzy_engine.readiness import calculate_readiness
from app.fuzzy_engine.body_comp import estimate_body_composition
from app.fuzzy_engine.strength import estimate_one_rep_max
from app.fuzzy_engine.nutrition import calculate_nutrition
from app.recommendations.generator import (
    generate_readiness_recommendation,
    generate_body_comp_recommendation,
    generate_strength_recommendation,
    generate_nutrition_recommendation,
)

app = FastAPI(
    title="Fuzzy Fitness Dashboard API",
    description="A fuzzy logic-based fitness calculation API",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Welcome to Fuzzy Fitness Dashboard API",
        "docs": "/docs",
        "endpoints": [
            "/api/readiness",
            "/api/body-composition",
            "/api/one-rep-max",
            "/api/nutrition",
        ],
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


@app.post("/api/readiness", response_model=ReadinessOutput)
async def workout_readiness(data: ReadinessInput):
    """
    Calculate workout readiness using fuzzy logic.
    
    Takes sleep quality, energy level, soreness, and stress as inputs
    and returns an intensity recommendation.
    """
    result = calculate_readiness(
        sleep=data.sleep,
        energy=data.energy,
        soreness=data.soreness,
        stress=data.stress,
    )
    
    recommendation = generate_readiness_recommendation(
        intensity=result["intensity"],
        label=result["label"],
        inputs={
            "sleep": data.sleep,
            "energy": data.energy,
            "soreness": data.soreness,
            "stress": data.stress,
        },
    )
    
    return ReadinessOutput(
        intensity=result["intensity"],
        label=result["label"],
        confidence=result["confidence"],
        recommendation=recommendation,
        input_memberships=result["input_memberships"],
    )


@app.post("/api/body-composition", response_model=BodyCompOutput)
async def body_composition(data: BodyCompInput):
    """
    Estimate body composition using fuzzy logic.
    
    Takes weight, height, waist, activity level, and build type as inputs
    and returns body fat estimates and BMI interpretation.
    """
    result = estimate_body_composition(
        weight=data.weight,
        height=data.height,
        waist=data.waist,
        activity_level=data.activity_level,
        build_type=data.build_type,
    )
    
    recommendation = generate_body_comp_recommendation(
        body_fat_mid=result["body_fat_mid"],
        muscle_mass_category=result["muscle_mass_category"],
        bmi=result["bmi"],
        bmi_interpretation=result["bmi_interpretation"],
    )
    
    return BodyCompOutput(
        body_fat_low=result["body_fat_low"],
        body_fat_mid=result["body_fat_mid"],
        body_fat_high=result["body_fat_high"],
        muscle_mass_category=result["muscle_mass_category"],
        bmi=result["bmi"],
        bmi_interpretation=result["bmi_interpretation"],
        recommendation=recommendation,
    )


@app.post("/api/one-rep-max", response_model=StrengthOutput)
async def one_rep_max(data: StrengthInput):
    """
    Estimate 1RM using fuzzy logic with uncertainty.
    
    Takes weight lifted, reps (can be fuzzy), RPE, and form quality as inputs
    and returns 1RM estimates with confidence.
    """
    result = estimate_one_rep_max(
        weight_lifted=data.weight_lifted,
        reps=data.reps,
        rpe=data.rpe,
        form_quality=data.form_quality,
    )
    
    recommendation = generate_strength_recommendation(
        one_rm_mid=result["one_rm_mid"],
        confidence=result["confidence"],
        form_quality=data.form_quality,
        weight_lifted=data.weight_lifted,
    )
    
    return StrengthOutput(
        one_rm_low=result["one_rm_low"],
        one_rm_mid=result["one_rm_mid"],
        one_rm_high=result["one_rm_high"],
        confidence=result["confidence"],
        recommendation=recommendation,
    )


@app.post("/api/nutrition", response_model=NutritionOutput)
async def nutrition(data: NutritionInput):
    """
    Calculate macro targets using fuzzy logic.
    
    Takes weight, goal, activity level, metabolism, and adherence as inputs
    and returns calorie and macro ranges.
    """
    result = calculate_nutrition(
        weight=data.weight,
        goal=data.goal,
        activity_level=data.activity_level,
        metabolism=data.metabolism,
        adherence=data.adherence,
    )
    
    recommendation = generate_nutrition_recommendation(
        calories_mid=result["calories_mid"],
        protein_mid=result["protein_mid"],
        goal=data.goal,
        adherence=data.adherence,
    )
    
    return NutritionOutput(
        calories_low=result["calories_low"],
        calories_mid=result["calories_mid"],
        calories_high=result["calories_high"],
        protein_low=result["protein_low"],
        protein_mid=result["protein_mid"],
        protein_high=result["protein_high"],
        carbs_low=result["carbs_low"],
        carbs_mid=result["carbs_mid"],
        carbs_high=result["carbs_high"],
        fat_low=result["fat_low"],
        fat_mid=result["fat_mid"],
        fat_high=result["fat_high"],
        recommendation=recommendation,
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
