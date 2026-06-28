export default async function handler(req, res) {
  const key = process.env.TREDICT_TOKEN;
  if (!key) {
    return res.status(500).json({ error: 'TREDICT_TOKEN not set' });
  }
  try {
    const r = await fetch(
      'https://www.tredict.com/api/oauth/v2/activityList?pageSize=200',
      {
        headers: {
          'Authorization': `Bearer ${key}`,
          'Accept': 'application/json;charset=UTF-8'
        }
      }
    );
    if (!r.ok) {
      const body = await r.text();
      return res.status(r.status).json({ error: 'Tredict ' + r.status, detail: body.slice(0,200) });
    }
    const data = await r.json();
    res.setHeader('Cache-Control', 's-maxage=300');
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
