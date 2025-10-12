// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SHOW_DISCOUNT") {
    showDiscountNotification(message.store, message.discount);
  }
});

function showDiscountNotification(store, discount) {
  // Remove any existing notification
  const existing = document.getElementById('student-discount-notification');
  if (existing) {
    existing.remove();
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.id = 'student-discount-notification';
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px 25px;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-width: 320px;
      animation: slideIn 0.5s ease-out;
    ">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
        <div style="font-size: 18px; font-weight: bold; display: flex; align-items: center;">
          🎓 Student Discount Available!
        </div>
        <button id="close-discount-notification" style="
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          padding: 0;
          margin-left: 10px;
          line-height: 1;
        ">×</button>
      </div>
      <div style="font-size: 16px; margin-bottom: 8px;">
        <strong>${store}</strong>
      </div>
      <div style="font-size: 14px; opacity: 0.95;">
        ${discount}
      </div>
    </div>
  `;

  // Add animation keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // Add to page
  document.body.appendChild(notification);

  // Close button functionality
  document.getElementById('close-discount-notification').addEventListener('click', () => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  });

  // Auto-close after 8 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }
  }, 8000);
}
