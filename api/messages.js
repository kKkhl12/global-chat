let messages = [];
const MAX_MESSAGES = 50;

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const since = parseInt(req.query.since) || 0;
    const newMessages = messages.filter(m => m.id > since);
    return res.status(200).json({ messages: newMessages });
  }

  if (req.method === 'POST') {
    const { username, message, type } = req.body;
    
    const newMessage = {
      id: Date.now(),
      username: username?.substring(0, 20) || 'Anonymous',
      message: message?.substring(0, 500) || '',
      timestamp: new Date().toLocaleTimeString(),
      type: type || 'message'
    };

    messages.push(newMessage);
    
    if (messages.length > MAX_MESSAGES) {
      messages = messages.slice(-MAX_MESSAGES);
    }

    return res.status(200).json({ success: true, message: newMessage });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
