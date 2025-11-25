"""Natural language recommendation generator."""


def generate_readiness_recommendation(intensity: float, label: str, inputs: dict) -> str:
    """
    Generate natural language recommendation for workout readiness.
    
    Args:
        intensity: Calculated intensity (0-100)
        label: Intensity label
        inputs: Original input values (sleep, energy, soreness, stress)
    
    Returns:
        Natural language recommendation string
    """
    sleep = inputs.get("sleep", 5)
    energy = inputs.get("energy", 5)
    soreness = inputs.get("soreness", 5)
    stress = inputs.get("stress", 5)
    
    recommendations = []
    
    if label == "Rest":
        recommendations.append(
            "Your body is signaling it needs recovery. "
            "Consider taking a rest day or doing very light mobility work."
        )
        if sleep < 4:
            recommendations.append("Prioritize getting quality sleep tonight.")
        if soreness > 7:
            recommendations.append("Focus on foam rolling and stretching to aid muscle recovery.")
        if stress > 7:
            recommendations.append("Try some meditation or breathing exercises to reduce stress.")
    
    elif label == "Light":
        recommendations.append(
            "A light workout would be beneficial today. "
            "Focus on technique work, mobility, or low-intensity cardio."
        )
        if soreness > 5:
            recommendations.append("Include extra warm-up time due to muscle soreness.")
        if energy < 5:
            recommendations.append("Consider a shorter session to conserve energy.")
    
    elif label == "Moderate":
        recommendations.append(
            "You're ready for a solid moderate workout. "
            "Aim for your regular training with normal intensity."
        )
        if sleep < 6:
            recommendations.append("Be mindful of fatigue as your sleep was suboptimal.")
        recommendations.append("Listen to your body and adjust intensity as needed.")
    
    elif label == "Hard":
        recommendations.append(
            "Great conditions for a challenging workout! "
            "Push yourself with higher weights or more volume."
        )
        if soreness < 3:
            recommendations.append("Your recovery is excellent - take advantage of it.")
        recommendations.append("This is a good day to attempt new PRs or progressive overload.")
    
    else:  # Beast
        recommendations.append(
            "🔥 You're in peak condition! "
            "Go all out today - this is your day for maximal effort."
        )
        recommendations.append(
            "Your sleep, energy, and recovery are all aligned. "
            "Attack your hardest lifts and challenge yourself!"
        )
    
    return " ".join(recommendations)


def generate_body_comp_recommendation(
    body_fat_mid: float,
    muscle_mass_category: str,
    bmi: float,
    bmi_interpretation: str
) -> str:
    """
    Generate natural language recommendation for body composition.
    
    Returns:
        Natural language recommendation string
    """
    recommendations = []
    
    # Body fat commentary
    if body_fat_mid < 12:
        recommendations.append(
            "Your estimated body fat is quite low. "
            "Ensure you're eating enough to support training and hormone health."
        )
    elif body_fat_mid < 18:
        recommendations.append(
            "You have an athletic level of body fat. "
            "This range is optimal for performance and aesthetics."
        )
    elif body_fat_mid < 25:
        recommendations.append(
            "Your body fat is in a healthy range. "
            "Focus on building lean muscle through progressive overload."
        )
    else:
        recommendations.append(
            "There's potential for body recomposition. "
            "A moderate caloric deficit combined with strength training would be beneficial."
        )
    
    # Muscle mass commentary
    if muscle_mass_category in ["Below Average", "Average"]:
        recommendations.append(
            "Consider increasing resistance training frequency to build more muscle mass."
        )
    elif muscle_mass_category == "Athletic":
        recommendations.append(
            "Your muscle development is excellent. Focus on maintenance and specific goals."
        )
    
    # Note about estimation
    recommendations.append(
        "Note: These are fuzzy estimates. For precise measurements, "
        "consider DEXA scanning or hydrostatic weighing."
    )
    
    return " ".join(recommendations)


def generate_strength_recommendation(
    one_rm_mid: float,
    confidence: float,
    form_quality: str,
    weight_lifted: float
) -> str:
    """
    Generate natural language recommendation for 1RM estimation.
    
    Returns:
        Natural language recommendation string
    """
    recommendations = []
    
    # Confidence commentary
    if confidence > 0.8:
        recommendations.append(
            "This estimate has high confidence based on your input data."
        )
    elif confidence > 0.6:
        recommendations.append(
            "This is a reasonable estimate, but actual max may vary by ±5-10%."
        )
    else:
        recommendations.append(
            "This estimate has higher uncertainty. Consider testing with a spotter present."
        )
    
    # Form quality feedback
    if form_quality == "poor":
        recommendations.append(
            "⚠️ Improving your form should be priority before attempting heavier loads. "
            "Poor form increases injury risk and limits strength expression."
        )
    elif form_quality == "fair":
        recommendations.append(
            "Work on refining your technique to safely express more strength."
        )
    elif form_quality == "excellent":
        recommendations.append(
            "Your excellent form allows for safe, maximal strength expression."
        )
    
    # Training suggestions based on 1RM
    recommendations.append(
        f"For strength training, work with 80-90% ({round(one_rm_mid * 0.8)}-{round(one_rm_mid * 0.9)} kg) "
        f"for 3-5 reps."
    )
    recommendations.append(
        f"For hypertrophy, use 65-75% ({round(one_rm_mid * 0.65)}-{round(one_rm_mid * 0.75)} kg) "
        f"for 8-12 reps."
    )
    
    return " ".join(recommendations)


def generate_nutrition_recommendation(
    calories_mid: float,
    protein_mid: float,
    goal: str,
    adherence: float
) -> str:
    """
    Generate natural language recommendation for nutrition.
    
    Returns:
        Natural language recommendation string
    """
    recommendations = []
    
    # Goal-specific advice
    if goal == "cut":
        recommendations.append(
            "For fat loss, you're in a caloric deficit. "
            "Prioritize protein to preserve muscle mass during the cut."
        )
        recommendations.append(
            f"Aim for at least {round(protein_mid)}g protein spread across 4-5 meals."
        )
    elif goal == "bulk":
        recommendations.append(
            "For muscle gain, you're in a caloric surplus. "
            "Focus on progressive overload to ensure the extra calories build muscle."
        )
        recommendations.append(
            "Time your largest meals around your workout for optimal nutrient partitioning."
        )
    else:
        recommendations.append(
            "For maintenance, focus on consistent protein intake and adjusting based on results."
        )
    
    # Adherence-based advice
    if adherence < 0.5:
        recommendations.append(
            "Given variable adherence, the ranges provided are wider to accommodate flexibility. "
            "Focus on hitting protein goals as the top priority."
        )
    elif adherence > 0.8:
        recommendations.append(
            "Your strong adherence allows for tighter targets. "
            "Track closely for optimal results."
        )
    
    # General tips
    recommendations.append(
        "These targets are estimates. Adjust based on weekly weight trends: "
        "aim for 0.5-1% body weight change per week when cutting/bulking."
    )
    
    return " ".join(recommendations)
