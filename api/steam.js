export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { term } = req.query;
  if (!term) return res.status(400).json({ error: 'Missing search term' });

  try {
    const response = await fetch(
      `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(term)}&cc=us&l=en&count=15`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(8000),
      }
    );
    if (!response.ok) throw new Error('Steam returned ' + response.status);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error('Steam error:', err.message);
    return res.status(200).json({ items: [] });
  }
}
