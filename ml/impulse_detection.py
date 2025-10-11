from datetime import datetime, timedelta
import json
import os

# helper function: parse_time
# turns text time into Python datetime object
def parse_time(t):
    try:
        return datetime.fromisoformat(t.replace("Z", ""))  # removing 'Z' and convert
    except Exception:
        return None  # If something goes wrong, just return nothing

# main function: detect_impulses
def detect_impulses(
    logs, #list of dicts where each dict is a shopping event
    window_minutes=10, #time window to check for rapid actions
    rapid_threshold=3, #number of actions within window to trigger rapid browsing alert
    large_purchase_threshold=100, #amount to consider a large purchase
    night_start=23, #11 PM
    night_end=5): #5 AM
    
    # 1. no data case
    if not logs:
        return ["No shopping activity recorded yet."]

    # 2. ensure times are real and sorted
    processed = []
    for entry in logs:
        t = parse_time(entry.get("time", ""))  # convert to real time
        if t is None:
            continue  # skip broken entries
        processed.append({
            "time": t,
            "action": entry.get("action", ""),
            "amount_spent": float(entry.get("amount_spent", 0.0))
        })
    processed.sort(key=lambda x: x["time"])  # earliest first

    # if all times were bad, return friendly message
    if not processed:
        return ["No valid timestamps found in activity."]

    # 3. start checking for patterns
    insights = []  # this will hold the messages
    now = processed[-1]["time"]  # most recent event

    # too many actions in a short time (rapid browsing)
    window_start = now - timedelta(minutes=window_minutes)
    recent = [p for p in processed if p["time"] >= window_start]
    if len(recent) >= rapid_threshold:
        insights.append(f"You’ve made {len(recent)} shopping actions in the last {window_minutes} minutes. Maybe take a short break to think before buying!")

    # large purchases
    large_purchases = [
        p for p in processed
        if p["amount_spent"] >= large_purchase_threshold]
    if large_purchases:
        amounts = [f"${p['amount_spent']:.2f}" for p in large_purchases]
        insights.append(f"Big purchase detected ({', '.join(amounts)}) without discounts. Consider reviewing if these were planned or spontaneous buys, or if you can wait for discounts!")

    # nighttime purchases
    night_purchases = [
        p for p in processed
        if (p["time"].hour >= night_start or p["time"].hour < night_end)
        ]
    if night_purchases:
        times = [p["time"].strftime("%I:%M %p") for p in night_purchases]
        insights.append(
            f"You’ve made {len(night_purchases)} purchases late at night ({', '.join(times)}). "
            "Late-night shopping can sometimes lead to impulsive decisions. Maybe revisit these in the morning!"
        )

    # summary
    total_spent = sum(p["amount_spent"] for p in purchases)
    discounts_used = sum(1 for p in purchases if p["discount_used"])
    total_purchases = len(purchases)
    discount_ratio = discounts_used / total_purchases if total_purchases > 0 else 0

    if total_spent > 200:
        insights.append(f"Total spent so far: ${total_spent:.2f}. Try to cut back a bit this week — small changes add up!")
    else:
        insights.append(f"Total spent so far: ${total_spent:.2f}. You’re doing great at managing your budget and being thoughtful about purchases!")

    # if no warnings triggered, say something nice
    if len(insights) == 1:
        insights = ["No impulsive patterns found — great job!"]

    return insights

# helper function: load_logs_from_file
def load_logs_from_file(path="data/activity.json"):
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except Exception:
            return []
