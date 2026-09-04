export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url = '' } = req.query;
  if (!url) return res.status(400).json({ status: false, message: 'Missing parameter: url' });

  try {
    const upstream = await fetch(`https://api.siputzx.my.id/api/d/tiktok?url=${encodeURIComponent(url)}`);
    const data = await upstream.json();
    return res.status(200).json({ status: true, creator: 'dinstore', data });
  } catch (err) {
    return res.status(500).json({ status: false, error: err.message });
  }
}
