// Embed discount data directly
const discountData = {
  "general_discounts": [
    {
      "store": "Hollister",
      "discount": "10% off",
      "url": "hollisterco.com"
    },
    {
      "store": "Adidas",
      "discount": "10% off",
      "url": "adidas.com"
    },
    {
      "store": "SHEIN",
      "discount": "15% off",
      "url": "shein.com"
    },
    {
      "store": "Aerie",
      "discount": "20% off",
      "url": "aerie.com"
    },
    {
      "store": "Pacsun",
      "discount": "10% off",
      "url": "pacsun.com"
    },
    {
      "store": "American Eagle",
      "discount": "20% off",
      "url": "ae.com"
    },
    {
      "store": "Gymshark",
      "discount": "15% off",
      "url": "gymshark.com"
    },
    {
      "store": "AEROPOSTALE",
      "discount": "15% off",
      "url": "aeropostale.com"
    },
    {
      "store": "Under Armour",
      "discount": "20% off",
      "url": "underarmour.com"
    },
    {
      "store": "ASOS",
      "discount": "10% off",
      "url": "asos.com"
    },
    {
      "store": "Ray-Ban",
      "discount": "25% off",
      "url": "ray-ban.com"
    },
    {
      "store": "Free People",
      "discount": "15% off",
      "url": "freepeople.com"
    },
    {
      "store": "Cotton On",
      "discount": "15% off",
      "url": "cottonon.com"
    },
    {
      "store": "Kate Spade",
      "discount": "15% off",
      "url": "katespade.com"
    },
    {
      "store": "Halara",
      "discount": "10% off",
      "url": "thehalara.com"
    },
    {
      "store": "Merit Beauty",
      "discount": "15% off",
      "url": "meritbeauty.com"
    },
    {
      "store": "Olive & June",
      "discount": "25% off",
      "url": "oliveandjune.com"
    },
    {
      "store": "ColourPop",
      "discount": "15% off",
      "url": "colourpop.com"
    },
    {
      "store": "Amazon Prime",
      "discount": "2-month Trial of Audible",
      "url": "audible.com"
    },
    {
      "store": "Grubhub",
      "discount": "Free Delivery",
      "url": "grubhub.com"
    }
  ],
  "chapel_discounts": [
    {
      "store": "Buns Chapel Hill",
      "discount": "10% off",
      "address": "107 N Columbia St, Chapel Hill, NC 27514",
      "coordinates": ["35.9049 N", "-79.0470 W"]
    },
    {
      "store": "CycleBar Chapel Hill",
      "discount": "Discounted Class Packs",
      "address": "201 S. Estes Dr., Suite E1, Chapel Hill, NC 27514",
      "coordinates": ["35.9186 N", "-79.0477 W"]
    },
    {
      "store": "Carolina Performing Arts",
      "discount": "20% off tickets",
      "address": "114 E Cameron Ave, Chapel Hill, NC 27514",
      "coordinates": ["35.9066 N", "-79.0469 W"]
    },
    {
      "store": "Spicy 9 Chapel Hill",
      "discount": "15% off",
      "address": "1140 W Franklin St, Suite 150, Chapel Hill, NC 27516",
      "coordinates": ["35.9128 N", "-79.0563 W"]
    },
    {
      "store": "Moe's Southwest Grill Chapel Hill",
      "discount": "Discounted Meals",
      "address": "110 W Franklin St, Chapel Hill, NC 27516",
      "coordinates": ["35.91 N", "-79.06 W"]
    },
    {
      "store": "Regal Cinemas Chapel Hill",
      "discount": "Discounted Movie Tickets",
      "address": "201 S Estes Dr, Chapel Hill, NC 27514",
      "coordinates": ["35.9186 N", "-79.0477 W"]
    }
  ]
};

document.addEventListener("DOMContentLoaded", async () => {
  const siteElement = document.getElementById("site");
  const discountList = document.getElementById("discount-list");

  // Get current tab's URL
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const hostname = new URL(tab.url).hostname.replace("www.", "");
  siteElement.textContent = `Site: ${hostname}`;

  // Search for matching discounts in general_discounts
  const matchingDiscounts = discountData.general_discounts.filter(
    discount => hostname.includes(discount.url) || discount.url.includes(hostname)
  );
  
  if (matchingDiscounts.length > 0) {
    matchingDiscounts.forEach(discount => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${discount.store}</span>: ${discount.discount}`;
      discountList.appendChild(li);
    });
  } else {
    const li = document.createElement("li");
    li.textContent = "No student discounts found for this site.";
    li.style.background = "#e0e0e0";
    discountList.appendChild(li);
  }
});
