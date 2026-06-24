// api/tredict.js — runs on Vercel as a serverless function (server-side only).
// Your token NEVER reaches the browser; it lives in the host's env settings.

// The correct Tredict endpoint is pre-filled. You normally only need TREDICT_TOKEN.
// extendedSummary=1 is REQUIRED — without it the list has no distance/pace/HR.
const DEFAULT_URL =
  'https://www.tredict.com/api/oauth/v2/activityList?extendedSummary=1&pageSize=400';

export default async function handler(req, res) {
  const token = process.env.TREDICT_TOKEN;                     // your read-only Personal API token
  const url   = process.env.TREDICT_ACTIVITIES_URL || DEFAULT_URL; // override only if ever needed

  if (!token) {
    return res.status(503).json({
      error: 'not_configured',
      message: 'Set TREDICT_TOKEN in your Vercel project settings, then redeploy.'
    });
  }

  try {
    const r = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json;charset=UTF-8' }
    });
    if (!r.ok) {
      return res.status(r.status).json({ error: 'tredict_error', status: r.status });
    }
    const data = await r.json();
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=86400'); // 15-min edge cache
    return res.status(200).json(data);
  } catch (e) {
    return res.status(502).json({ error: 'fetch_failed', message: String(e) });
  }
}
