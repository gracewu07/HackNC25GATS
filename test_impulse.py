from impulse_detection import detect_impulses

sample_logs = [
    {"time": "2025-10-11T23:45:00Z", "action": "purchase", "discount_used": True, "amount_spent": 45},
    {"time": "2025-10-12T00:30:00Z", "action": "purchase", "discount_used": False, "amount_spent": 20},
    {"time": "2025-10-12T14:10:00Z", "action": "checkout", "discount_used": False, "amount_spent": 60},
]

insights = detect_impulses(sample_logs)
print("\n".join(insights))
