let messages = [];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'GET') {
    const since = parseInt(req.query.since) || 0;
    const newMessages = messages.filter(m => m.id > since);
    return res.status(200).json({ messages: newMessages });
  }

  if (req.method === 'POST') {
    const { username, message } = req.body;
    
    const newMessage = {
      id: Date.now(),
      username: username?.substring(0, 20) || 'Anonymous',
      message: message?.substring(0, 500) || '',
      timestamp: new Date().toLocaleTimeString()
    };

    messages.push(newMessage);
    if (messages.length > 100) messages = messages.slice(-100);

    return res.status(200).json({ success: true, message: newMessage });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
