const username = sessionStorage.getItem('username');
if (!username) {
  window.location.href = '/';
}

document.getElementById('username-display').textContent = `@${username}`;

const messagesDiv = document.getElementById('messages');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');

let lastMessageId = 0;
let isFirstLoad = true;

// Send join message
sendSystemMessage(`${username} joined the chat`);

// Poll for messages
setInterval(fetchMessages, 2000);
fetchMessages();

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  
  if (message) {
    await sendMessage(message);
    messageInput.value = '';
  }
});

async function sendMessage(message) {
  try {
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, message, type: 'message' })
    });
    await fetchMessages();
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

async function sendSystemMessage(message) {
  try {
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'System', message, type: 'system' })
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

async function fetchMessages() {
  try {
    const response = await fetch(`/api/messages?since=${lastMessageId}`);
    const data = await response.json();
    
    data.messages.forEach(msg => {
      if (msg.type === 'system') {
        addSystemMessage(msg.message);
      } else {
        addMessage(msg.username, msg.message, msg.timestamp);
      }
      lastMessageId = Math.max(lastMessageId, msg.id);
    });

    if (isFirstLoad && data.messages.length === 0) {
      addSystemMessage('Welcome to Global Chat! 🌍');
      isFirstLoad = false;
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
  }
}

document.getElementById('logout-btn').addEventListener('click', async () => {
  await sendSystemMessage(`${username} left the chat`);
  sessionStorage.removeItem('username');
  window.location.href = '/';
});

function addMessage(username, message, timestamp) {
  const messageEl = document.createElement('div');
  messageEl.className = 'message';
  messageEl.innerHTML = `
    <div class="message-header">
      <span class="username">${escapeHtml(username)}</span>
      <span class="timestamp">${timestamp}</span>
    </div>
    <div class="message-text">${escapeHtml(message)}</div>
  `;
  messagesDiv.appendChild(messageEl);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function addSystemMessage(text) {
  const messageEl = document.createElement('div');
  messageEl.className = 'system-message';
  messageEl.textContent = text;
  messagesDiv.appendChild(messageEl);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
