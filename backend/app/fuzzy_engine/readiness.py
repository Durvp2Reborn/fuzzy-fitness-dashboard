"""Fuzzy logic workout readiness calculator."""
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


def calculate_readiness(sleep: float, energy: float, soreness: float, stress: float) -> dict:
    """
    Calculate workout readiness using fuzzy logic.
    
    Args:
        sleep: Sleep quality (0-10)
        energy: Energy level (0-10)
        soreness: Muscle soreness (0-10, higher = more sore)
        stress: Stress level (0-10, higher = more stressed)
    
    Returns:
        Dictionary with intensity recommendation and memberships
    """
    # Define membership function parameters
    # Sleep membership (higher = better)
    sleep_mf = {
        "poor": [0, 0, 4],
        "fair": [2, 5, 8],
        "good": [6, 10, 10],
    }
    
    # Energy membership (higher = better)
    energy_mf = {
        "low": [0, 0, 4],
        "medium": [2, 5, 8],
        "high": [6, 10, 10],
    }
    
    # Soreness membership (higher = worse)
    soreness_mf = {
        "low": [0, 0, 4],
        "medium": [2, 5, 8],
        "high": [6, 10, 10],
    }
    
    # Stress membership (higher = worse)
    stress_mf = {
        "low": [0, 0, 4],
        "medium": [2, 5, 8],
        "high": [6, 10, 10],
    }
    
    # Output intensity membership functions
    intensity_mf = {
        "rest": [0, 0, 25],
        "light": [10, 30, 50],
        "moderate": [35, 50, 65],
        "hard": [50, 70, 90],
        "beast": [75, 100, 100],
    }
    
    # Calculate memberships for each input
    sleep_mem = {k: trimf(sleep, v) for k, v in sleep_mf.items()}
    energy_mem = {k: trimf(energy, v) for k, v in energy_mf.items()}
    soreness_mem = {k: trimf(soreness, v) for k, v in soreness_mf.items()}
    stress_mem = {k: trimf(stress, v) for k, v in stress_mf.items()}
    
    # Fuzzy rules using min (AND) operator
    # Each rule maps to an output category with a firing strength
    rules = []
    
    # Beast mode rules
    rules.append((min(sleep_mem["good"], energy_mem["high"], 
                     soreness_mem["low"], stress_mem["low"]), "beast"))
    
    # Hard workout rules
    rules.append((min(sleep_mem["good"], energy_mem["high"], 
                     soreness_mem["low"], stress_mem["medium"]), "hard"))
    rules.append((min(sleep_mem["good"], energy_mem["high"], 
                     soreness_mem["medium"], stress_mem["low"]), "hard"))
    rules.append((min(sleep_mem["good"], energy_mem["medium"], 
                     soreness_mem["low"], stress_mem["low"]), "hard"))
    rules.append((min(energy_mem["high"], soreness_mem["low"]), "hard"))
    
    # Moderate workout rules
    rules.append((min(sleep_mem["fair"], energy_mem["medium"], 
                     soreness_mem["medium"], stress_mem["medium"]), "moderate"))
    rules.append((min(sleep_mem["good"], energy_mem["medium"], 
                     soreness_mem["medium"], stress_mem["medium"]), "moderate"))
    rules.append((min(sleep_mem["fair"], energy_mem["high"], 
                     soreness_mem["medium"], stress_mem["medium"]), "moderate"))
    rules.append((min(sleep_mem["good"], energy_mem["medium"], 
                     soreness_mem["low"]), "moderate"))
    
    # Light workout rules
    rules.append((min(sleep_mem["fair"], energy_mem["low"], 
                     soreness_mem["medium"], stress_mem["medium"]), "light"))
    rules.append((min(sleep_mem["poor"], energy_mem["medium"], 
                     soreness_mem["medium"], stress_mem["medium"]), "light"))
    rules.append((min(sleep_mem["fair"], energy_mem["medium"], 
                     soreness_mem["high"], stress_mem["medium"]), "light"))
    rules.append((min(sleep_mem["good"], energy_mem["low"]), "light"))
    rules.append((min(sleep_mem["fair"], soreness_mem["high"]), "light"))
    
    # Rest rules
    rules.append((min(sleep_mem["poor"], energy_mem["low"], 
                     soreness_mem["high"], stress_mem["high"]), "rest"))
    rules.append((min(sleep_mem["poor"], energy_mem["low"], 
                     soreness_mem["medium"], stress_mem["high"]), "rest"))
    rules.append((min(sleep_mem["poor"], energy_mem["low"], 
                     soreness_mem["high"], stress_mem["medium"]), "rest"))
    rules.append((min(sleep_mem["poor"], stress_mem["high"]), "rest"))
    rules.append((min(soreness_mem["high"], stress_mem["high"]), "rest"))
    
    # Aggregate output using max for each category
    output_strengths = {"rest": 0, "light": 0, "moderate": 0, "hard": 0, "beast": 0}
    for strength, category in rules:
        output_strengths[category] = max(output_strengths[category], strength)
    
    # Defuzzification using centroid method (simplified)
    # Calculate centroid of combined output
    intensity_range = np.arange(0, 101, 1)
    aggregated = np.zeros_like(intensity_range, dtype=float)
    
    for category, strength in output_strengths.items():
        if strength > 0:
            params = intensity_mf[category]
            for i, x in enumerate(intensity_range):
                membership = trimf(x, params)
                # Apply rule strength (min operation)
                aggregated[i] = max(aggregated[i], min(membership, strength))
    
    # Centroid defuzzification
    if np.sum(aggregated) > 0:
        intensity = np.sum(intensity_range * aggregated) / np.sum(aggregated)
    else:
        # Fallback calculation if no rules fired
        positive_factors = (sleep + energy) / 20
        negative_factors = (soreness + stress) / 20
        intensity = max(0, min(100, 50 + (positive_factors - negative_factors) * 50))
    
    # Determine label based on intensity
    if intensity < 20:
        label = "Rest"
    elif intensity < 40:
        label = "Light"
    elif intensity < 60:
        label = "Moderate"
    elif intensity < 80:
        label = "Hard"
    else:
        label = "Beast"
    
    # Calculate input memberships for visualization
    input_memberships = {
        "sleep": {k: float(v) for k, v in sleep_mem.items()},
        "energy": {k: float(v) for k, v in energy_mem.items()},
        "soreness": {k: float(v) for k, v in soreness_mem.items()},
        "stress": {k: float(v) for k, v in stress_mem.items()},
    }
    
    # Calculate confidence based on how well inputs match the rules
    total_membership = sum(
        max(input_memberships[key].values()) for key in input_memberships
    )
    confidence = min(1.0, total_membership / 4)
    
    return {
        "intensity": round(float(intensity), 1),
        "label": label,
        "confidence": round(confidence, 2),
        "input_memberships": input_memberships,
    }
