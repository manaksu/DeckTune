export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { term } = req.query;
  if (!term) return res.status(400).json({ error: 'Missing search term' });

  const apiKey = process.env.RAWG_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'RAWG_API_KEY not set' });

  try {
    const url = `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(term)}&page_size=12&platforms=4&ordering=-rating`;
    // platforms=4 = PC
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error('RAWG returned ' + response.status);
    const data = await response.json();

    const items = (data.results || []).map(g => ({
      id: g.id,
      name: g.name,
      image: g.background_image || null,
      genre: (g.genres || []).map(x => x.name).slice(0,2).join(', ') || 'Game',
      rating: g.metacritic || null,
      released: g.released ? g.released.split('-')[0] : null,
      demand: g.genres?.some(x => ['Action','Shooter','Fighting'].includes(x.name)) ? 'high'
             : g.genres?.some(x => ['Indie','Casual','Puzzle'].includes(x.name)) ? 'low'
             : 'med',
    }));

    return res.status(200).json({ items });
  } catch (err) {
    console.error('RAWG error:', err.message);
    return res.status(200).json({ items: [] });
  }
}
