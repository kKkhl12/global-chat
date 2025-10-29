export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'POST') {
    const { answer, expected } = req.body;
    return res.status(200).json({ 
      success: parseInt(answer) === parseInt(expected) 
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
