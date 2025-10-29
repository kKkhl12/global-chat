export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { answer, expected } = req.body;
  res.json({ success: parseInt(answer) === parseInt(expected) });
}
