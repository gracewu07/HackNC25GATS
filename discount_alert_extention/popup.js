document.addEventListener("DOMContentLoaded", async () => {
  const siteElement = document.getElementById("site");
  const discountList = document.getElementById("discount-list");

  // Get current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const hostname = new URL(tab.url).hostname;
  siteElement.textContent = `Site: ${hostname}`;

  // Example: Simulated discount data
  const discounts = {
    "www.microsoft.com": []
  };

  const siteDiscounts = discounts[hostname] || ["No student discounts found."];

  siteDiscounts.forEach(discount => {
    const li = document.createElement("li");
    li.textContent = discount;
    discountList.appendChild(li);
  });
});
