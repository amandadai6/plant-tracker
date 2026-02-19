// Serverless proxy for Perenual plant API.
// Keeps the API key server-side so it's never exposed to the client.
// Usage: GET /api/plants/search?q=monstera

const PERENUAL_BASE_URL = 'https://perenual.com/api/v2/species-list';

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const query = req.query.q;

  if (!query || !query.trim()) {
    return res.status(400).json({ error: 'Missing search query parameter "q"' });
  }

  if (query.length > 100) {
    return res.status(400).json({ error: 'Search query is too long' });
  }

  const apiKey = process.env.PERENUAL_API_KEY;

  if (!apiKey) {
    console.error('PERENUAL_API_KEY is not configured');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const url = `${PERENUAL_BASE_URL}?key=${apiKey}&q=${encodeURIComponent(query.trim())}`;
    const controller = new AbortController();
    const fetchTimeout = setTimeout(() => controller.abort(), 5000);

    let response;
    try {
      response = await fetch(url, { signal: controller.signal });
    } finally {
      clearTimeout(fetchTimeout);
    }

    if (!response.ok) {
      console.error(`Perenual API returned ${response.status}`);
      return res.status(502).json({ error: 'Plant database unavailable' });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Perenual API request failed:', error.message);
    return res.status(502).json({ error: 'Failed to reach plant database' });
  }
}
