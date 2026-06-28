export default async function handler(req, res) {
  const key = process.env.TREDICT_TOKEN;
  if (!key) {
    return res.status(500).json({ error: 'TREDICT_TOKEN not set' });
  }
  try {
    const r = await fetch(
      'https://www.tredict.com/api/v2/activities?pageSize=200',
      { headers: { Authorization: `Bearer ${key}` } }
    );
    if (!r.ok) return res.status(r.status).json({ error: 'Tredict error' });
    const data = await r.json();
    res.setHeader('Cache-Control', 's-maxage=300');
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
