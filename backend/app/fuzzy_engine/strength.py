"""Fuzzy logic 1RM estimator."""
import re
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


def parse_fuzzy_reps(reps_str: str) -> tuple[float, float]:
    """
    Parse fuzzy rep input like "around 6" or "5-7" or "about 8".
    
    Returns:
        Tuple of (estimated_reps, uncertainty)
    """
    reps_str = reps_str.lower().strip()
    
    # Check for range like "5-7" or "5 to 7"
    range_match = re.match(r"(\d+)\s*[-to]+\s*(\d+)", reps_str)
    if range_match:
        low = int(range_match.group(1))
        high = int(range_match.group(2))
        return ((low + high) / 2, (high - low) / 2)
    
    # Check for fuzzy terms
    fuzzy_terms = ["around", "about", "approximately", "roughly", "~", "maybe"]
    for term in fuzzy_terms:
        if term in reps_str:
            # Extract number
            num_match = re.search(r"(\d+\.?\d*)", reps_str)
            if num_match:
                return (float(num_match.group(1)), 1.0)
    
    # Check for exact number
    num_match = re.search(r"(\d+\.?\d*)", reps_str)
    if num_match:
        return (float(num_match.group(1)), 0.5)
    
    # Default fallback
    return (5.0, 1.5)


def estimate_one_rep_max(
    weight_lifted: float,
    reps: str,
    rpe: float,
    form_quality: str
) -> dict:
    """
    Estimate 1RM using fuzzy logic with uncertainty.
    
    Args:
        weight_lifted: Weight lifted in kg
        reps: Reps performed (can be fuzzy like "around 6")
        rpe: Rate of Perceived Exertion (1-10)
        form_quality: poor, fair, good, excellent
    
    Returns:
        Dictionary with 1RM estimates and confidence
    """
    # Parse fuzzy reps
    estimated_reps, rep_uncertainty = parse_fuzzy_reps(reps)
    
    # Form quality adjustments
    form_adjustments = {
        "poor": {"multiplier": 0.85, "confidence_penalty": 0.3},
        "fair": {"multiplier": 0.92, "confidence_penalty": 0.15},
        "good": {"multiplier": 1.0, "confidence_penalty": 0.05},
        "excellent": {"multiplier": 1.05, "confidence_penalty": 0.0},
    }
    form_adj = form_adjustments.get(form_quality, {"multiplier": 1.0, "confidence_penalty": 0.1})
    
    # RPE adjustment - higher RPE means set was harder, closer to true max
    # RPE 10 = couldn't do more, RPE 5 = could do 5 more
    reps_in_reserve = 10 - rpe
    effective_reps = estimated_reps + reps_in_reserve
    
    # Brzycki formula: 1RM = weight × (36 / (37 - reps))
    # Modified for fuzzy reps
    if effective_reps >= 36:
        effective_reps = 35  # Cap to avoid division issues
    
    brzycki_1rm = weight_lifted * (36 / (37 - effective_reps))
    
    # Epley formula: 1RM = weight × (1 + reps/30)
    epley_1rm = weight_lifted * (1 + effective_reps / 30)
    
    # Lombardi formula: 1RM = weight × reps^0.1
    lombardi_1rm = weight_lifted * (effective_reps ** 0.1)
    
    # Average of formulas
    base_1rm = (brzycki_1rm + epley_1rm + lombardi_1rm) / 3
    
    # Apply form adjustment
    adjusted_1rm = base_1rm * form_adj["multiplier"]
    
    # Calculate uncertainty range using fuzzy logic
    # RPE affects confidence - higher RPE = more confident estimate
    low_rpe_params = [1, 1, 5]
    med_rpe_params = [3, 6, 8]
    high_rpe_params = [7, 10, 10]
    
    low_rpe_deg = float(trimf(rpe, low_rpe_params))
    med_rpe_deg = float(trimf(rpe, med_rpe_params))
    high_rpe_deg = float(trimf(rpe, high_rpe_params))
    
    # Base uncertainty from rep count and fuzziness
    rep_uncertainty_factor = 1 + (rep_uncertainty * 0.02)
    rpe_uncertainty_factor = 1 + (low_rpe_deg * 0.1) + (med_rpe_deg * 0.05)
    
    total_uncertainty = 0.05 * rep_uncertainty_factor * rpe_uncertainty_factor
    
    # Calculate range
    one_rm_low = adjusted_1rm * (1 - total_uncertainty)
    one_rm_high = adjusted_1rm * (1 + total_uncertainty)
    
    # Calculate confidence
    base_confidence = 0.7
    confidence = base_confidence + (high_rpe_deg * 0.2) - form_adj["confidence_penalty"]
    confidence = max(0.3, min(1.0, confidence))
    
    return {
        "one_rm_low": round(one_rm_low, 1),
        "one_rm_mid": round(adjusted_1rm, 1),
        "one_rm_high": round(one_rm_high, 1),
        "confidence": round(confidence, 2),
    }
