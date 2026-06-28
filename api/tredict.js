export default async function handler(req, res) {
  const key = process.env.TREDICT_TOKEN;
  if (!key) return res.status(500).json({ error: 'TREDICT_TOKEN not set' });
  const headers = {
    'Authorization': `Bearer ${key}`,
    'Accept': 'application/json;charset=UTF-8'
  };
  try {
    const listR = await fetch(
      'https://www.tredict.com/api/oauth/v2/activityList?pageSize=100',
      { headers }
    );
    if (!listR.ok) {
      const body = await listR.text();
      return res.status(listR.status).json({ error: 'list ' + listR.status, detail: body.slice(0,200) });
    }
    const list = await listR.json();
    const items = (list._embedded && list._embedded.activityList) || [];
    // Pull detail for the most recent 40 (covers ~3 months for our charts)
    const recent = items.slice(0, 40);
    const detailed = await Promise.all(recent.map(async a => {
      try {
        const dr = await fetch(
          `https://www.tredict.com/api/oauth/v2/activity/${a.id}`,
          { headers }
        );
        if (!dr.ok) return a;
        const full = await dr.json();
        return { ...a, ...full };
      } catch { return a; }
    }));
    res.setHeader('Cache-Control', 's-maxage=600');
    return res.status(200).json({ _embedded: { activityList: detailed } });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
