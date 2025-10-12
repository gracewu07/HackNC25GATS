from datetime import datetime

def detect_nighttime_purchases(logs, night_start=22, night_end=5):

    insights = []  

    # convert string to datetime
    for log in logs:
        try:
            log["time"] = datetime.fromisoformat(log["time"].replace("Z", ""))
        except Exception:
            # if something goes wrong, skip this log
            continue

    # find purchases made during late night hours
    nighttime_purchases = [
        p for p in logs
        if p["action"] == "purchase" and (
            p["time"].hour >= night_start or p["time"].hour < night_end
        )
    ]

    if nighttime_purchases:
        times = [p["time"].strftime("%I:%M %p") for p in nighttime_purchases]

        insights.append(
            f"You’ve made {len(nighttime_purchases)} purchases late at night "
            f"({', '.join(times)}). Late-night shopping can sometimes lead to impulsive decisions — "
            "maybe revisit these in the morning!"
        )

    return insights

