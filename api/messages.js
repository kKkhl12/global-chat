// In-memory message store (resets on cold starts)
let messages = [];
const MAX_MESSAGES = 50;

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // Get messages
    const since = parseInt(req.query.since) || 0;
    const newMessages = messages.filter(m => m.id > since);
    return res.json({ messages: newMessages });
  }

  if (req.method === 'POST') {
    // Post new message
    const { username, message } = req.body;
    
    if (!username || !message) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const newMessage = {
      id: Date.now(),
      username: username.substring(0, 20),
      message: message.substring(0, 500),
      timestamp: new Date().toLocaleTimeString()
    };

    messages.push(newMessage);
    
    // Keep only last 50 messages
    if (messages.length > MAX_MESSAGES) {
      messages = messages.slice(-MAX_MESSAGES);
    }

    return res.json({ success: true, message: newMessage });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
