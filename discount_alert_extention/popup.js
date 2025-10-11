document.addEventListener("DOMContentLoaded", async () => {
  const siteElement = document.getElementById("site");
  const discountList = document.getElementById("discount-list");

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const hostname = new URL(tab.url).hostname;
  siteElement.textContent = `Site: ${hostname}`;

  try {
    const response = await fetch(chrome.runtime.getURL("discounts.json"));
    const discounts = await response.json();

    const siteDiscounts = discounts[hostname] || ["No discounts found."];

    siteDiscounts.forEach(discount => {
      const li = document.createElement("li");
      li.textContent = discount;
      discountList.appendChild(li);
    });
  } catch (error) {
    console.error("Error loading discounts:", error);
  }
});