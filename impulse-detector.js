// impulse-detector.js
//we had to turn this into javascript cuz chrome only runs in javascript not python we found this out very late and had to change our ML thingy
class ImpulseDetector {
  constructor() {
    this.purchaseHistory = [];
    this.browsingHistory = [];
    this.cartAdditions = [];
    this.loadHistory();
  }
  async loadHistory() {
    try {
      const data = await chrome.storage.local.get(['purchaseHistory', 'browsingHistory', 'cartAdditions']);
      this.purchaseHistory = data.purchaseHistory || [];
      this.browsingHistory = data.browsingHistory || [];
      this.cartAdditions = data.cartAdditions || [];
    } catch (error) {
      console.log('Error loading history:', error);
    }
  }
  async saveHistory() {
    try {
      await chrome.storage.local.set({
        purchaseHistory: this.purchaseHistory,
        browsingHistory: this.browsingHistory,
        cartAdditions: this.cartAdditions
      });
    } catch (error) {
      console.log('Error saving history:', error);
    }
  }
  async addEvent(eventType, data) {
    const event = {
      time: new Date().toISOString(),
      type: eventType,
      data: data
    };

    if (eventType === 'purchase') {
      this.purchaseHistory.push(event);
    } else if (eventType === 'browse') {
      this.browsingHistory.push(event);
    } else if (eventType === 'add_to_cart') {
      this.cartAdditions.push(event);
    }

    await this.saveHistory();
  }
  isNighttimePurchase(nightStart = 22, nightEnd = 5) {
    const currentHour = new Date().getHours();
    return currentHour >= nightStart || currentHour < nightEnd;
  }
    // check for multiple purchases in short time
  checkRapidPurchases(timeWindowMinutes = 10) {
    if (this.purchaseHistory.length < 2) return false;

    const now = new Date();
    const recentPurchases = this.purchaseHistory.filter(p => {
      const purchaseTime = new Date(p.time);
      const diffMinutes = (now - purchaseTime) / (1000 * 60);
      return diffMinutes <= timeWindowMinutes;
    });

    return recentPurchases.length >= 2;
  }
  // check if buying too quickly after adding to cart
  checkQuickDecision(itemId, maxSeconds = 30) {
    // find item add cart time
    let cartTime = null;
    for (let i = this.cartAdditions.length - 1; i >= 0; i--) {
      if (this.cartAdditions[i].data.itemId === itemId) {
        cartTime = new Date(this.cartAdditions[i].time);
        break;
      }
    }
    if (cartTime) {
      const timeElapsed = (new Date() - cartTime) / 1000;
      return timeElapsed < maxSeconds;
    }
    return false;
  }

  // user triggered by discounts?
  checkDiscountTrigger(hasDiscount) {
    const recentPurchases = this.purchaseHistory.slice(-5);
    const discountPurchases = recentPurchases.filter(p => p.data.hasDiscount);
    
    return hasDiscount && discountPurchases.length >= 3;
  }
  // check unusual high spend
  checkHighSpending(amount, usualAverage = 50) {
    return amount > usualAverage * 2;
  }
  // main function
  analyzePurchase(itemId, amount, hasDiscount = false) {
    const reasons = [];

    if (this.isNighttimePurchase()) {
      reasons.push({
        text: "You're shopping late at night (10PM-5AM)"
      });
    }

    if (this.checkRapidPurchases()) {
      reasons.push({
        text: "You've made multiple purchases in the last 10 minutes"
      });
    }

    if (this.checkQuickDecision(itemId)) {
      reasons.push({
        text: "You added this to cart less than 30 seconds ago"
      });
    }

    if (this.checkDiscountTrigger(hasDiscount)) {
      reasons.push({
        text: "Most of your recent purchases were discount-driven"
      });
    }

    if (this.checkHighSpending(amount)) {
      reasons.push({
        text: `This amount ($${amount}) is much higher than your usual spending`
      });
    }

    return reasons;
  }
}

// global
window.ImpulseDetector = ImpulseDetector;
