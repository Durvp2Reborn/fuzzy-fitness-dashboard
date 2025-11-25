"""Fuzzy logic body composition estimator."""
import numpy as np


def trimf(x: float, params: list) -> float:
    """
    Calculate triangular membership function value.
    
    Args:
        x: Input value
        params: [a, b, c] where a is left foot, b is peak, c is right foot
    
    Returns:
        Membership value between 0 and 1
    """
    a, b, c = params
    if x <= a or x >= c:
        return 0.0
    elif a < x <= b:
        return (x - a) / (b - a) if b != a else 1.0
    else:  # b < x < c
        return (c - x) / (c - b) if c != b else 1.0


def estimate_body_composition(
    weight: float, 
    height: float, 
    waist: float, 
    activity_level: str, 
    build_type: str
) -> dict:
    """
    Estimate body composition using fuzzy logic.
    
    Args:
        weight: Weight in kg
        height: Height in cm
        waist: Waist circumference in cm
        activity_level: sedentary, light, moderate, active, very_active
        build_type: ectomorph, mesomorph, endomorph
    
    Returns:
        Dictionary with body composition estimates
    """
    # Calculate BMI
    height_m = height / 100
    bmi = weight / (height_m ** 2)
    
    # Waist-to-height ratio
    waist_height_ratio = waist / height
    
    # Activity level multiplier
    activity_multipliers = {
        "sedentary": 0.0,
        "light": 0.25,
        "moderate": 0.5,
        "active": 0.75,
        "very_active": 1.0,
    }
    activity_factor = activity_multipliers.get(activity_level, 0.5)
    
    # Build type adjustments
    build_adjustments = {
        "ectomorph": {"bf_adj": -3, "muscle": "lean"},
        "mesomorph": {"bf_adj": 0, "muscle": "athletic"},
        "endomorph": {"bf_adj": 3, "muscle": "powerful"},
    }
    build_adj = build_adjustments.get(build_type, {"bf_adj": 0, "muscle": "average"})
    
    # BMI membership functions
    underweight_params = [10, 10, 18.5]
    normal_params = [17, 22, 27]
    overweight_params = [25, 28, 32]
    obese_params = [30, 40, 50]
    
    # Clamp BMI for membership calculation
    clamped_bmi = min(max(bmi, 10), 49.9)
    
    # Calculate memberships
    underweight_deg = float(trimf(clamped_bmi, underweight_params))
    normal_deg = float(trimf(clamped_bmi, normal_params))
    overweight_deg = float(trimf(clamped_bmi, overweight_params))
    obese_deg = float(trimf(clamped_bmi, obese_params))
    
    # Fuzzy BMI interpretation
    memberships = {
        "underweight": underweight_deg,
        "normal": normal_deg,
        "overweight": overweight_deg,
        "obese": obese_deg,
    }
    max_membership = max(memberships, key=memberships.get)
    
    # Create fuzzy interpretation string
    significant_memberships = [(k, v) for k, v in memberships.items() if v > 0.1]
    if len(significant_memberships) > 1:
        sorted_memberships = sorted(significant_memberships, key=lambda x: x[1], reverse=True)
        bmi_interpretation = f"{int(sorted_memberships[0][1] * 100)}% {sorted_memberships[0][0]}"
        for k, v in sorted_memberships[1:]:
            bmi_interpretation += f", {int(v * 100)}% {k}"
    else:
        bmi_interpretation = max_membership
    
    # Estimate body fat using Navy method approximation with fuzzy adjustments
    # Base body fat estimate using waist-to-height ratio
    if waist_height_ratio < 0.4:
        base_bf = 8 + waist_height_ratio * 30
    elif waist_height_ratio < 0.5:
        base_bf = 12 + (waist_height_ratio - 0.4) * 80
    elif waist_height_ratio < 0.6:
        base_bf = 20 + (waist_height_ratio - 0.5) * 100
    else:
        base_bf = 30 + (waist_height_ratio - 0.6) * 50
    
    # Apply adjustments
    bf_mid = base_bf + build_adj["bf_adj"] - (activity_factor * 5)
    bf_mid = max(5, min(50, bf_mid))  # Clamp to reasonable range
    
    # Create fuzzy range
    uncertainty = 3 + (1 - activity_factor) * 2  # More uncertainty with less activity
    bf_low = max(5, bf_mid - uncertainty)
    bf_high = min(50, bf_mid + uncertainty)
    
    # Muscle mass category based on build type and activity
    muscle_score = activity_factor * 0.6 + {
        "ectomorph": 0.2,
        "mesomorph": 0.4,
        "endomorph": 0.3,
    }.get(build_type, 0.3)
    
    if muscle_score < 0.3:
        muscle_mass_category = "Below Average"
    elif muscle_score < 0.5:
        muscle_mass_category = "Average"
    elif muscle_score < 0.7:
        muscle_mass_category = "Above Average"
    else:
        muscle_mass_category = "Athletic"
    
    return {
        "body_fat_low": round(bf_low, 1),
        "body_fat_mid": round(bf_mid, 1),
        "body_fat_high": round(bf_high, 1),
        "muscle_mass_category": muscle_mass_category,
        "bmi": round(bmi, 1),
        "bmi_interpretation": bmi_interpretation,
    }
