chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SHOW_DISCOUNT") {
    showDiscountNotification(message.store, message.discount);
  }
});
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
    @import url('https://fonts.googleapis.com/css2?family=Grandstander:ital,wght@1,800&family=Poppins:wght@400;500&display=swap');
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
      background: #311818;
      color: #f6c9c9;
      font-family: 'Poppins', sans-serif;
      padding: 12px 16px;
      border-radius: 10px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.3);
      min-width: 250px;
      max-width: 300px;
      animation: slideIn 0.5s ease-out;
      z-index: 999999;
    }

    .discount-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }

    .discount-header h2 {
      font-family: 'Grandstander', cursive;
      font-style: italic;
      font-weight: 800;
      font-size: 18px;
      margin: 0;
      color: #f9c9c9;
      text-shadow: 1px 1px 4px rgba(0,0,0,0.5);
      line-height: 1.2;
    }
    #close-discount-notification {
      background: none;
      border: none;
      color: #f9c9c9;
      font-size: 22px;
      cursor: pointer;
      padding: 0;
      line-height: 1;
      margin-left: 5px;
    }

    .discount-content {
      background: #cfb1b7;
      color: #311818;
      padding: 8px 10px;
      border-radius: 6px;
      box-shadow: 0 3px 6px rgba(0,0,0,0.2);
      transition: all 0.3s ease;
      text-align: left;
    }
    .discount-content strong {
      font-family: 'Grandstander', cursive;
      font-style: italic;
      font-weight: 800;
      font-size: 15px;
      display: block;
      margin-bottom: 4px;
    }

    .discount-content p {
      font-weight: 500;
      font-size: 13px;
      color: #311818;
      margin: 0;
      line-height: 1.4;
    }

    .discount-content:hover {
      background: #e3c6c9;
      transform: translateY(-1px);
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(notification);

  // close
  document.getElementById('close-discount-notification').addEventListener('click', () => {
    notification.querySelector('.discount-container').style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  });
  // autoclosing ayyyyy so smart
  setTimeout(() => {
    if (notification.parentElement) {
      notification.querySelector('.discount-container').style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }
  }, 8000);
}
