export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  const decoded = decodeURIComponent(url);
  const allowed = [
    'query1.finance.yahoo.com',
    'query2.finance.yahoo.com',
    'feeds.finance.yahoo.com',
  ];

  const isAllowed = allowed.some(domain => decoded.includes(domain));
  if (!isAllowed) {
    return res.status(403).json({ error: 'URL not allowed' });
  }

  try {
    const response = await fetch(decoded, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://finance.yahoo.com',
        'Referer': 'https://finance.yahoo.com/',
      },
    });

    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const data = await response.json();
      return res.status(200).json(data);
    } else {
      const text = await response.text();
      res.setHeader('Content-Type', contentType || 'text/plain');
      return res.status(200).send(text);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
