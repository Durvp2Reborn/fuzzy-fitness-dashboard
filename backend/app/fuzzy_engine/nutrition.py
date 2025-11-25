"""Fuzzy logic macro calculator."""
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


def calculate_nutrition(
    weight: float,
    goal: str,
    activity_level: str,
    metabolism: str,
    adherence: float
) -> dict:
    """
    Calculate macro targets using fuzzy logic.
    
    Args:
        weight: Weight in kg
        goal: cut, maintain, bulk
        activity_level: sedentary, light, moderate, active, very_active
        metabolism: slow, normal, fast
        adherence: Diet adherence ability (0-1)
    
    Returns:
        Dictionary with calorie and macro ranges
    """
    # Activity level multipliers for TDEE calculation
    activity_multipliers = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very_active": 1.9,
    }
    activity_mult = activity_multipliers.get(activity_level, 1.55)
    
    # Base metabolic rate estimate (simplified Mifflin-St Jeor)
    # Assuming average height and age for simplicity
    base_bmr = weight * 22  # Simplified approximation
    
    # Metabolism adjustment using fuzzy logic
    slow_params = [0, 0, 4]
    normal_params = [2, 5, 8]
    fast_params = [6, 10, 10]
    
    metabolism_value = {"slow": 2, "normal": 5, "fast": 8}.get(metabolism, 5)
    
    slow_deg = float(trimf(metabolism_value, slow_params))
    normal_deg = float(trimf(metabolism_value, normal_params))
    fast_deg = float(trimf(metabolism_value, fast_params))
    
    # Apply fuzzy metabolism adjustment
    metabolism_mult = 0.9 * slow_deg + 1.0 * normal_deg + 1.1 * fast_deg
    if metabolism_mult == 0:
        metabolism_mult = 1.0
    
    # Calculate TDEE
    tdee = base_bmr * activity_mult * metabolism_mult
    
    # Goal adjustments
    goal_adjustments = {
        "cut": {"cal_mult": 0.8, "protein_mult": 1.2, "fat_mult": 0.8},
        "maintain": {"cal_mult": 1.0, "protein_mult": 1.0, "fat_mult": 1.0},
        "bulk": {"cal_mult": 1.15, "protein_mult": 1.1, "fat_mult": 1.1},
    }
    goal_adj = goal_adjustments.get(goal, goal_adjustments["maintain"])
    
    # Calculate target calories
    target_calories = tdee * goal_adj["cal_mult"]
    
    # Adherence affects the range width - lower adherence = wider range
    range_factor = 0.05 + (1 - adherence) * 0.1
    
    # Calorie range
    calories_low = target_calories * (1 - range_factor)
    calories_high = target_calories * (1 + range_factor)
    
    # Protein calculation: 1.6-2.2g per kg for training individuals
    base_protein = weight * 2.0 * goal_adj["protein_mult"]
    protein_range = base_protein * range_factor * 0.5
    
    protein_low = base_protein - protein_range
    protein_high = base_protein + protein_range
    
    # Fat calculation: 0.7-1.0g per kg
    base_fat = weight * 0.85 * goal_adj["fat_mult"]
    fat_range = base_fat * range_factor
    
    fat_low = base_fat - fat_range
    fat_high = base_fat + fat_range
    
    # Carbs fill remaining calories
    # Calories: protein and carbs = 4cal/g, fat = 9cal/g
    fat_calories = base_fat * 9
    protein_calories = base_protein * 4
    remaining_calories = target_calories - fat_calories - protein_calories
    
    base_carbs = remaining_calories / 4
    carbs_range = base_carbs * range_factor
    
    carbs_low = max(50, base_carbs - carbs_range)  # Minimum 50g carbs
    carbs_high = base_carbs + carbs_range
    
    return {
        "calories_low": round(calories_low),
        "calories_mid": round(target_calories),
        "calories_high": round(calories_high),
        "protein_low": round(protein_low),
        "protein_mid": round(base_protein),
        "protein_high": round(protein_high),
        "carbs_low": round(carbs_low),
        "carbs_mid": round(base_carbs),
        "carbs_high": round(carbs_high),
        "fat_low": round(fat_low),
        "fat_mid": round(base_fat),
        "fat_high": round(fat_high),
    }
