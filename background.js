chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    const hostname = new URL(tab.url).hostname;
    const discountSites = ["amazon.com", "nike.com", "bestbuy.com"];

    if (discountSites.includes(hostname)) {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/icon128.png",
        title: "Student Discount Available!",
        message: `This site (${hostname}) has student discounts.`,
        priority: 2
      });
    }
  }
});