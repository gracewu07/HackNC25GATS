// again hardcode the data
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
  ]
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url.includes("nike.com")) {
    chrome.tabs.sendMessage(tabId, {
      type: "SHOW_DISCOUNT",
      store: "Nike",
      discount: "10% off for students with UNiDAYS!"
    });
  }
});


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    try {
      const hostname = new URL(tab.url).hostname.replace("www.", "");
      
      // matching part
      const generalDiscount = discountData.general_discounts.find(
        discount => hostname.includes(discount.url) || discount.url.includes(hostname)
      );
      
      if (generalDiscount) {
        console.log("Discount found for:", hostname, generalDiscount);
        
        // content script thing that lets the thing pop
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['content.js']
        }).then(() => {
          console.log("Content script injected, sending message...");
          chrome.tabs.sendMessage(tabId, {
            type: "SHOW_DISCOUNT",
            store: generalDiscount.store,
            discount: generalDiscount.discount
          });
        }).catch(err => {
          console.log('Error injecting script:', err);
        });
      } else {
        console.log("No discount found for:", hostname);
      }
    } catch (error) {
      console.log("Error processing tab:", error);
    }
  }
});
