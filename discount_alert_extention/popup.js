//As we didnt scrape- this is the placeholder for the harcoded discounts data section
const discounts = {
  "amazon.com": ["10% off Student Prime", "15% off Textbooks"],
  "nike.com": ["20% off Student Discount Program"],
  "bestbuy.com": ["Free shipping for students"],
  "apple.com": ["Education pricing for Macs and iPads"],
  "adidas.com": ["15% off with student verification"],
  "spotify.com": ["Spotify Premium Student: $5.99/month"]
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
