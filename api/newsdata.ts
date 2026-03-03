/**
 * Vercel Serverless Function – NewsData.io proxy
 *
 * Fallback news source when GDELT is down.
 * Free tier: 200 credits/day, articles up to 12 h old.
 *
 * Env var required: NEWSDATA_API_KEY
 *
 * Query params (from client):
 *   q        – search query keywords
 *   category – news category (optional)
 *   language – default "en"
 *   size     – max results (default 10, max 50 on free tier)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

const NEWSDATA_BASE = 'https://newsdata.io/api/1/latest';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.NEWSDATA_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'NewsData API key not configured' });
  }

  // Build upstream URL
  const params = new URLSearchParams();
  params.set('apikey', apiKey);
  params.set('language', (req.query.language as string) || 'en');

  const q = req.query.q as string | undefined;
  if (q) params.set('q', q);

  const category = req.query.category as string | undefined;
  if (category) params.set('category', category);

  const size = req.query.size as string | undefined;
  params.set('size', size || '25');

  const url = `${NEWSDATA_BASE}?${params.toString()}`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12_000);

    const upstream = await fetch(url, {
      headers: { 'User-Agent': 'FluxMap/1.0' },
      signal: controller.signal,
    });
    clearTimeout(timer);

    const body = await upstream.text();

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

    return res.status(upstream.status).send(body);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[newsdata] request failed:', msg);

    return res.status(502).json({
      error: 'NewsData API request failed',
      message: msg,
    });
  }
}
