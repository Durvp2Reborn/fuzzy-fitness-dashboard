"""Pydantic models for all fuzzy fitness API inputs and outputs."""
from pydantic import BaseModel, Field
from typing import Optional, Literal


# Readiness Models
class ReadinessInput(BaseModel):
    """Input for workout readiness calculation."""
    sleep: float = Field(..., ge=0, le=10, description="Sleep quality (0-10)")
    energy: float = Field(..., ge=0, le=10, description="Energy level (0-10)")
    soreness: float = Field(..., ge=0, le=10, description="Muscle soreness (0-10, higher = more sore)")
    stress: float = Field(..., ge=0, le=10, description="Stress level (0-10, higher = more stressed)")


class ReadinessOutput(BaseModel):
    """Output for workout readiness calculation."""
    intensity: float = Field(..., ge=0, le=100, description="Recommended intensity (0-100)")
    label: str = Field(..., description="Intensity label (Rest/Light/Moderate/Hard/Beast)")
    confidence: float = Field(..., ge=0, le=1, description="Confidence in recommendation")
    recommendation: str = Field(..., description="Natural language recommendation")
    input_memberships: dict = Field(..., description="Membership values for inputs")


# Body Composition Models
class BodyCompInput(BaseModel):
    """Input for body composition estimation."""
    weight: float = Field(..., gt=0, description="Weight in kg")
    height: float = Field(..., gt=0, description="Height in cm")
    waist: float = Field(..., gt=0, description="Waist circumference in cm")
    activity_level: Literal["sedentary", "light", "moderate", "active", "very_active"] = Field(
        ..., description="Activity level"
    )
    build_type: Literal["ectomorph", "mesomorph", "endomorph"] = Field(
        ..., description="Body build type"
    )


class BodyCompOutput(BaseModel):
    """Output for body composition estimation."""
    body_fat_low: float = Field(..., description="Lower bound body fat %")
    body_fat_mid: float = Field(..., description="Mid estimate body fat %")
    body_fat_high: float = Field(..., description="Upper bound body fat %")
    muscle_mass_category: str = Field(..., description="Muscle mass category")
    bmi: float = Field(..., description="Body Mass Index")
    bmi_interpretation: str = Field(..., description="Fuzzy BMI interpretation")
    recommendation: str = Field(..., description="Natural language recommendation")


# Strength/1RM Models
class StrengthInput(BaseModel):
    """Input for 1RM estimation."""
    weight_lifted: float = Field(..., gt=0, description="Weight lifted in kg")
    reps: str = Field(..., description="Reps performed (can be fuzzy like 'around 6')")
    rpe: float = Field(..., ge=1, le=10, description="Rate of Perceived Exertion (1-10)")
    form_quality: Literal["poor", "fair", "good", "excellent"] = Field(
        ..., description="Form quality assessment"
    )


class StrengthOutput(BaseModel):
    """Output for 1RM estimation."""
    one_rm_low: float = Field(..., description="Lower bound 1RM estimate")
    one_rm_mid: float = Field(..., description="Mid 1RM estimate")
    one_rm_high: float = Field(..., description="Upper bound 1RM estimate")
    confidence: float = Field(..., ge=0, le=1, description="Confidence in estimate")
    recommendation: str = Field(..., description="Natural language recommendation")


# Nutrition Models
class NutritionInput(BaseModel):
    """Input for macro calculation."""
    weight: float = Field(..., gt=0, description="Weight in kg")
    goal: Literal["cut", "maintain", "bulk"] = Field(..., description="Fitness goal")
    activity_level: Literal["sedentary", "light", "moderate", "active", "very_active"] = Field(
        ..., description="Activity level"
    )
    metabolism: Literal["slow", "normal", "fast"] = Field(..., description="Metabolism type")
    adherence: float = Field(..., ge=0, le=1, description="Diet adherence ability (0-1)")


class NutritionOutput(BaseModel):
    """Output for macro calculation."""
    calories_low: float = Field(..., description="Lower bound daily calories")
    calories_mid: float = Field(..., description="Mid estimate daily calories")
    calories_high: float = Field(..., description="Upper bound daily calories")
    protein_low: float = Field(..., description="Lower bound protein (g)")
    protein_mid: float = Field(..., description="Mid estimate protein (g)")
    protein_high: float = Field(..., description="Upper bound protein (g)")
    carbs_low: float = Field(..., description="Lower bound carbs (g)")
    carbs_mid: float = Field(..., description="Mid estimate carbs (g)")
    carbs_high: float = Field(..., description="Upper bound carbs (g)")
    fat_low: float = Field(..., description="Lower bound fat (g)")
    fat_mid: float = Field(..., description="Mid estimate fat (g)")
    fat_high: float = Field(..., description="Upper bound fat (g)")
    recommendation: str = Field(..., description="Natural language recommendation")
