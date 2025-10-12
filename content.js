// initiate or initialize idk
let detector;
if (window.ImpulseDetector) {
  detector = new window.ImpulseDetector();
}

// discount yo yo
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SHOW_DISCOUNT") {
    showDiscountNotification(message.store, message.discount);
  } else if (message.type === "CONTINUE_PURCHASE") {
    // continue purchase if u must
    allowPurchaseToContinue();
  }
});

document.addEventListener('click', async (e) => {
  if (!detector) return;
  
  const target = e.target;
  
  // add to cart question mark
  if (target.matches('button[class*="add"], button[id*="add"], button[class*="cart"], a[class*="add-to-cart"]') ||
      target.textContent.toLowerCase().includes('add to cart') ||
      target.textContent.toLowerCase().includes('add to bag')) {
    
    const itemId = extractItemId();
    const amount = extractPrice();
    
    if (detector && itemId) {
      await detector.addEvent('add_to_cart', { itemId, amount });
      console.log('Item added to cart tracked:', itemId);
    }
  }
  
  // detect
  if (target.matches('button[class*="checkout"], button[class*="buy"], button[id*="checkout"], button[id*="buy"], a[class*="checkout"]') ||
      target.textContent.toLowerCase().includes('checkout') ||
      target.textContent.toLowerCase().includes('buy now') ||
      target.textContent.toLowerCase().includes('place order')) {
    
    console.log('Checkout detected, analyzing purchase...');
    
    const itemId = extractItemId();
    const amount = extractPrice();
    const hasDiscount = checkIfDiscounted();
    
    if (detector && amount) {
      const reasons = detector.analyzePurchase(itemId, amount, hasDiscount);
      
      if (reasons.length > 0) {
        // NO MORE IMMEDIATE PURCHASES
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        console.log('Impulse purchase detected! Showing warning...');
        showImpulseWarning(reasons, amount, extractItemName());
        
        // store button
        window.pendingPurchaseButton = target;
      }
    }
  }
}, true); // ??

// extract id
function extractItemId() {
  // find item id
  const url = window.location.href;
  
  // way number 1 look for patterns Damn grace you locked in
  const urlPatterns = [
    /\/dp\/([A-Z0-9]+)/i,  // Amazon
    /\/product\/([^/?]+)/i,
    /\/item\/([^/?]+)/i,
    /[\?&]id=([^&]+)/i,
    /\/([0-9]+)\/?$/
  ];
  
  for (const pattern of urlPatterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  // way. number 2 meta tags
  const metaId = document.querySelector('meta[property="product:id"]');
  if (metaId) return metaId.content;
  
  // url fallback
  return url.split('?')[0];
}

// price from page ayy
function extractPrice() {
  const priceSelectors = [
    '[class*="price"]',
    '[id*="price"]',
    '[class*="cost"]',
    '[data-price]',
    '.a-price-whole', 
    '.product-price',
    '.price-current'
  ];
  
  for (const selector of priceSelectors) {
    const priceElement = document.querySelector(selector);
    if (priceElement) {
      const priceText = priceElement.textContent || priceElement.getAttribute('data-price') || '';
      const priceMatch = priceText.match(/[\d,]+\.?\d*/);
      if (priceMatch) {
        const price = parseFloat(priceMatch[0].replace(/,/g, ''));
        if (price > 0) return price;
      }
    }
  }
  
  return 0;
}
function extractItemName() {
  const nameSelectors = [
    'h1[class*="title"]',
    'h1[class*="product"]',
    'h1[id*="title"]',
    '[class*="product-title"]',
    '.product-name',
    'h1'
  ];
  
  for (const selector of nameSelectors) {
    const nameElement = document.querySelector(selector);
    if (nameElement) {
      // Get only the direct text content, not all nested elements
      let name = '';
      for (let node of nameElement.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          name += node.textContent.trim() + ' ';
        }
      }
      name = name.trim();
      
      // If we didn't get text from child nodes, fall back to textContent
      if (!name) {
        name = nameElement.textContent.trim();
      }
      
      // Clean up the name - remove extra whitespace and duplicates
      name = name.replace(/\s+/g, ' ');
      
      if (name.length > 0 && name.length < 200) {
        return name;
      }
    }
  }
  
  return 'This item';
}
function checkIfDiscounted() {
  const discountKeywords = ['sale', 'discount', 'off', 'deal', 'save'];
  const pageText = document.body.textContent.toLowerCase();
  
  return discountKeywords.some(keyword => pageText.includes(keyword));
}
// show warning this important dont touch anybody ok this is the java thing that took foreverf
function showImpulseWarning(reasons, amount, itemName) {
  const existing = document.getElementById('impulse-warning-notification');
  if (existing) existing.remove();
  const warning = document.createElement('div');
  warning.id = 'impulse-warning-notification';
  warning.innerHTML = `
    <div class="impulse-warning-container">
      <div class="impulse-warning-header">
        <h2>Take a Moment</h2>
        <button id="close-impulse-warning">×</button>
      </div>
      <div class="impulse-warning-content">
        <p class="impulse-item"><strong>${itemName}</strong></p>
        <p class="impulse-amount">Amount: $${amount.toFixed(2)}</p>
        <div class="impulse-reasons">
          <p><strong>We noticed:</strong></p>
          ${reasons.map(r => `<div class="impulse-reason">${r.icon} ${r.text}</div>`).join('')}
        </div>
        <div class="impulse-reflection">
          <p><strong>Before you buy:</strong></p>
          <ul>
            <li>Do you really need this right now?</li>
            <li>Will you still want this tomorrow?</li>
            <li>Does this fit your budget?</li>
          </ul>
        </div>
        <div class="impulse-actions">
          <button id="impulse-cancel" class="impulse-btn-cancel">Wait & Think</button>
          <button id="impulse-continue" class="impulse-btn-continue">Continue Anyway</button>
        </div>
      </div>
    </div>
  `;
  
  // css (This was AI)
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800&display=swap');

    @keyframes impulseSlideIn {
      from { transform: translate(-50%, -60%); opacity: 0; }
      to { transform: translate(-50%, -50%); opacity: 1; }
    }

    .impulse-warning-container {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #fff7d5;
      color: #112556;
      font-family: 'Montserrat', sans-serif;
      padding: 20px 24px;
      border-radius: 24px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 0 6px rgba(17,37,86,0.2);
      min-width: 400px;
      max-width: 500px;
      animation: impulseSlideIn 0.4s ease-out;
      z-index: 9999999;
    }

    .impulse-warning-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .impulse-warning-header h2 {
      font-family: 'Montserrat', sans-serif;
      font-weight: 800;
      font-size: 24px;
      margin: 0;
      color: #112556;
      letter-spacing: 1px;
    }

    #close-impulse-warning {
      background: none;
      border: none;
      color: #112556;
      font-size: 32px;
      cursor: pointer;
      padding: 0;
      line-height: 1;
      transition: transform 0.2s;
    }

    #close-impulse-warning:hover {
      transform: scale(1.2) rotate(90deg);
    }

    .impulse-warning-content {
      background: white;
      padding: 16px;
      border-radius: 16px;
      margin-bottom: 12px;
    }

    .impulse-item {
      font-weight: 800;
      font-size: 16px;
      color: #112556;
      margin: 0 0 8px 0;
    }

    .impulse-amount {
      font-weight: 600;
      font-size: 18px;
      color: #112556;
      margin: 0 0 16px 0;
    }

    .impulse-reasons {
      background: #112556;
      color: #fff7d5;
      padding: 12px;
      border-radius: 12px;
      margin-bottom: 16px;
    }

    .impulse-reasons p {
      margin: 0 0 8px 0;
      font-weight: 800;
      font-size: 14px;
    }

    .impulse-reason {
      padding: 6px 0;
      font-size: 13px;
      font-weight: 600;
      line-height: 1.4;
    }

    .impulse-reflection {
      background: #f0e6b8;
      padding: 12px;
      border-radius: 12px;
    }

    .impulse-reflection p {
      margin: 0 0 8px 0;
      font-weight: 800;
      font-size: 14px;
      color: #112556;
    }

    .impulse-reflection ul {
      margin: 0;
      padding-left: 20px;
      font-size: 13px;
      font-weight: 600;
      color: #112556;
    }

    .impulse-reflection li {
      margin: 4px 0;
      line-height: 1.4;
    }

    .impulse-actions {
      display: flex;
      gap: 12px;
      margin-top: 16px;
    }

    .impulse-actions button {
      flex: 1;
      padding: 12px 20px;
      border: none;
      border-radius: 16px;
      font-family: 'Montserrat', sans-serif;
      font-weight: 800;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .impulse-btn-cancel {
      background: #112556;
      color: #fff7d5;
      box-shadow: 0 4px 12px rgba(17,37,86,0.4);
    }

    .impulse-btn-cancel:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(17,37,86,0.5);
    }

    .impulse-btn-continue {
      background: transparent;
      color: #112556;
      border: 2px solid #112556;
    }

    .impulse-btn-continue:hover {
      background: #112556;
      color: #fff7d5;
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(warning);
  document.getElementById('close-impulse-warning').addEventListener('click', () => {
    warning.remove();
  });
  document.getElementById('impulse-cancel').addEventListener('click', () => {
    warning.remove();
  });
  document.getElementById('impulse-continue').addEventListener('click', async () => {
    warning.remove();
    if (detector) {
      await detector.addEvent('purchase', {
        itemId: extractItemId(),
        amount: amount,
        hasDiscount: checkIfDiscounted(),
        warningsIgnored: reasons.length
      });
    }
    allowPurchaseToContinue();
  });
}
function allowPurchaseToContinue() {
  if (window.pendingPurchaseButton) {
    const originalDetector = detector;
    detector = null;
    window.pendingPurchaseButton.click();
    setTimeout(() => {
      detector = originalDetector;
      window.pendingPurchaseButton = null;
    }, 1000);
  }
}
function showDiscountNotification(store, discount) {
  const existing = document.getElementById('student-discount-notification');
  if (existing) existing.remove();
  const notification = document.createElement('div');
  notification.id = 'student-discount-notification';
  notification.innerHTML = `
    <div class="discount-container">
      <div class="discount-header">
        <h2>Pocketed.</h2>
        <button id="close-discount-notification">×</button>
      </div>
      <div class="discount-content">
        <strong>${store}</strong>
        <p>${discount}</p>
      </div>
    </div>
  `;
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800&display=swap');

    @keyframes slideIn {
      from { transform: translateX(400px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(400px); opacity: 0; }
    }
    .discount-container {
      position: fixed;
      top: 15px;
      right: 15px;
      background: #fff7d5;
      color: #112556;
      font-family: 'Montserrat', sans-serif;
      padding: 12px 16px;
      border-radius: 20px;
      box-shadow: 0 12px 35px rgba(0,0,0,0.5), 0 0 0 4px rgba(17,37,86,0.15);
      min-width: 250px;
      max-width: 300px;
      animation: slideIn 0.5s ease-out;
      z-index: 999999;
    }

    .discount-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .discount-header h2 {
      font-family: 'Montserrat', sans-serif;
      font-weight: 800;
      font-size: 22px;
      margin: 0;
      color: #112556;
      letter-spacing: 2px;
      text-transform: uppercase;
      line-height: 1.2;
      text-shadow: none;
    }

    #close-discount-notification {
      background: none;
      border: none;
      color: #112556;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      line-height: 1;
      margin-left: 8px;
      transition: transform 0.2s;
    }

    #close-discount-notification:hover {
      transform: scale(1.2);
    }

    .discount-content {
      background: #112556;
      color: #fff7d5;
      padding: 14px 16px;
      border-radius: 20px;
      box-shadow: 0 5px 12px rgba(0,0,0,0.25);
      transition: all 0.35s ease;
      text-align: left;
    }

    .discount-content strong {
      font-family: 'Montserrat', sans-serif;
      font-weight: 800;
      font-size: 16px;
      display: block;
      margin-bottom: 6px;
      color: #fff7d5;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .discount-content p {
      font-weight: 600;
      font-size: 14px;
      color: #fff7d5;
      margin: 0;
      line-height: 1.4;
    }

    .discount-content:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 8px 20px rgba(0,0,0,0.35);
    }
  `;
  document.head.appendChild(style);

  //notififififi
  document.body.appendChild(notification);
  
  //closesesese
  document.getElementById('close-discount-notification').addEventListener('click', () => {
    notification.querySelector('.discount-container').style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  });
  
  // Autoclose
  setTimeout(() => {
    if (notification.parentElement) {
      notification.querySelector('.discount-container').style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }
  }, 8000);
}
