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
  @keyframes sparkle {
    0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
    50% { opacity: 0.6; transform: scale(1.3) rotate(20deg); }
  }

  .discount-container {
    position: fixed;
    top: 15px;
    right: 15px;
    background: #fff7d5;
    color: #112556;
    font-family: 'Montserrat', sans-serif;
    padding: 20px;
    border-radius: 32px;
    box-shadow: 0 12px 35px rgba(0,0,0,0.5), 0 0 0 4px rgba(17,37,86,0.15);
    min-width: 200px;
    max-width: 300px;
    animation: slideIn 0.5s ease-out;
    z-index: 999999;
    text-align: center;
    overflow: hidden;
  }

  .discount-container header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 10px;
  }

  .discount-container .logo {
    width: 110px;
    height: auto;
    margin-bottom: 12px;
    transition: transform 0.4s;
    filter: drop-shadow(0 4px 10px rgba(17,37,86,0.25));
  }

  .discount-container .logo:hover {
    transform: scale(1.12) rotate(-2deg);
  }

  .discount-container h2 {
    font-weight: 800;
    font-size: 26px;
    margin: 5px 0 15px;
    color: #112556;
    letter-spacing: 2px;
    text-transform: uppercase;
    position: relative;
  }

  .discount-container h2::after {
    content: '✨';
    margin-left: 8px;
    font-size: 20px;
    display: inline-block;
    animation: sparkle 2s ease-in-out infinite;
  }

  #site {
    background: #112556;
    color: #fff7d5;
    font-weight: 600;
    font-size: 12px;
    margin: 20px 0 0;
    padding: 10px 12px;
    border-radius: 20px;
    box-shadow: 0 5px 12px rgba(0,0,0,0.25);
  }

  #discount-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  #discount-list li {
    background: #112556;
    padding: 14px 16px;
    margin: 8px 0;
    border-radius: 20px;
    font-weight: 600;
    font-size: 14px;
    color: #fff7d5;
    transition: all 0.35s;
    box-shadow: 0 5px 12px rgba(0,0,0,0.25);
  }

  #discount-list li:first-child { margin-top: 0; }
  #discount-list li:last-child { margin-bottom: 0; }

  #discount-list li:hover {
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 8px 20px rgba(0,0,0,0.35);
  }

  #discount-list li span {
    font-weight: 800;
    color: #fff7d5;
    font-size: 16px;
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

