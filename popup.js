//As we didnt scrape- this is the placeholder for the harcoded discounts data section
const discounts = {

};

document.addEventListener("DOMContentLoaded", async () => {
  const siteElement = document.getElementById("site");
  const discountList = document.getElementById("discount-list");

  // Get current tab’s URL
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const hostname = new URL(tab.url).hostname.replace("www.", "");
  siteElement.textContent = `Site: ${hostname}`;

  // Check for discounts
  const siteDiscounts = discounts[hostname] || ["No student discounts found."];

  // Display them in the popup
  siteDiscounts.forEach(discount => {
    const li = document.createElement("li");
    li.textContent = discount;
    discountList.appendChild(li);
  });
});