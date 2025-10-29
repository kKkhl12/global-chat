const username = sessionStorage.getItem('username');
if (!username) window.location.href = '/';

document.getElementById('username-display').textContent = `@${username}`;

const messagesDiv = document.getElementById('messages');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
let lastMessageId = 0;

setInterval(fetchMessages, 2000);
fetchMessages();

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (message) {
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, message })
    });
    messageInput.value = '';
    fetchMessages();
  }
});

async function fetchMessages() {
  try {
    const response = await fetch(`/api/messages?since=${lastMessageId}`);
    const data = await response.json();
    data.messages.forEach(msg => {
      addMessage(msg.username, msg.message, msg.timestamp);
      lastMessageId = Math.max(lastMessageId, msg.id);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

document.getElementById('logout-btn').addEventListener('click', () => {
  sessionStorage.removeItem('username');
  window.location.href = '/';
});

function addMessage(user, msg, time) {
  const el = document.createElement('div');
  el.className = 'message';
  el.innerHTML = `
    <div class="message-header">
      <span class="username">${escape(user)}</span>
      <span class="timestamp">${time}</span>
    </div>
    <div class="message-text">${escape(msg)}</div>
  `;
  messagesDiv.appendChild(el);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function escape(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
