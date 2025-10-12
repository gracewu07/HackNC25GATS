// this one is for popups idk why i named it content
// background: listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SHOW_DISCOUNT") {
    showDiscountNotification(message.store, message.discount);
  }
});

function showDiscountNotification(store, discount) {
  // remove existing popup if it already exists
  const existing = document.getElementById('student-discount-notification');
  if (existing) existing.remove();

  // create the popup element
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

  // match popup theme: add CSS styling
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

  // append the popup to the page
  document.body.appendChild(notification);

  // close button functionality
  document.getElementById('close-discount-notification').addEventListener('click', () => {
    notification.querySelector('.discount-container').style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  });

  // auto close after 8 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.querySelector('.discount-container').style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }
  }, 8000);
}

