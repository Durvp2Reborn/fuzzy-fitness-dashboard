"""Shared fuzzy logic utilities."""


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
