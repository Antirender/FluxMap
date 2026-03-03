/**
 * Vercel Serverless Function – The Guardian Open Platform proxy
 *
 * Second live news source in the provider chain.
 * Free tier with "test" key; higher-rate keys available at:
 * https://open-platform.theguardian.com/access/
 *
 * Env var required: GUARDIAN_API_KEY
 *
 * Query params (from client):
 *   q          – search keywords
 *   page-size  – max results (default 20)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

const GUARDIAN_BASE = 'https://content.guardianapis.com/search';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GUARDIAN_API_KEY || 'test';

  // Build upstream URL
  const params = new URLSearchParams();
  params.set('api-key', apiKey);
  params.set('show-fields', 'trailText,thumbnail');
  params.set('order-by', 'newest');

  const q = req.query.q as string | undefined;
  if (q) params.set('q', q);

  const pageSize = req.query['page-size'] as string | undefined;
  params.set('page-size', pageSize || '20');

  const url = `${GUARDIAN_BASE}?${params.toString()}`;

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
    console.error('[guardian] request failed:', msg);

    return res.status(502).json({
      error: 'Guardian API request failed',
      message: msg,
    });
  }
}
