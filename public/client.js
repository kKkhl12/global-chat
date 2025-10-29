// Check if user is logged in
const username = sessionStorage.getItem('username');
if (!username) {
  window.location.href = '/';
}

const socket = io();
const messagesDiv = document.getElementById('messages');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const userCountSpan = document.getElementById('user-count');

// Join the chat
socket.emit('join', username);

// Send message
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  
  if (message) {
    socket.emit('chat-message', { message });
    messageInput.value = '';
  }
});

// Receive messages
socket.on('chat-message', (data) => {
  addMessage(data.username, data.message, data.timestamp);
});

// User joined
socket.on('user-joined', (data) => {
  addSystemMessage(`${data.username} joined the chat`);
});

// User left
socket.on('user-left', (data) => {
  addSystemMessage(`${data.username} left the chat`);
});

// Update user count
socket.on('user-count', (count) => {
  userCountSpan.textContent = `${count} user${count !== 1 ? 's' : ''} online`;
});

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
  sessionStorage.removeItem('username');
  window.location.href = '/';
});

// Helper functions
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
