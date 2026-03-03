/**
 * Vercel Serverless Function – GDELT GEO 2.0 proxy
 *
 * Forwards requests to the GDELT GEO API and adds
 * Cache-Control headers so Vercel Edge caches the result.
 * Includes timeout + catch-all error handling to prevent 502s.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

const UPSTREAM = 'https://api.gdeltproject.org/api/v2/geo/geo';

function pickTimeout(qs: string): number {
  if (qs.includes('timespan=7d') || qs.includes('timespan=1w')) return 22_000;
  if (qs.includes('timespan=24h') || qs.includes('timespan=1440')) return 16_000;
  return 12_000;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const qs = new URLSearchParams(req.query as Record<string, string>).toString();
  const url = `${UPSTREAM}?${qs}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), pickTimeout(qs));

  try {
    const upstream = await fetch(url, {
      headers: { 'User-Agent': 'FluxMap/1.0 (Vercel Serverless)' },
      signal: controller.signal,
    });
    clearTimeout(timer);

    const body = await upstream.text();
    const ct = upstream.headers.get('content-type') ?? 'application/json';
    res.setHeader('Content-Type', ct);

    // CDN cache: 90 s fresh, serve stale up to 10 min while revalidating
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=90, stale-while-revalidate=600',
    );

    return res.status(upstream.status).send(body);
  } catch (err: unknown) {
    clearTimeout(timer);
    const isTimeout =
      err instanceof Error &&
      (err.name === 'AbortError' || err.message.includes('abort'));

    console.error('[gdelt-geo]', isTimeout ? 'TIMEOUT' : err);

    if (isTimeout) {
      return res.status(504).json({
        error: 'Upstream timeout',
        message: 'GDELT did not respond in time. Try a shorter time window.',
      });
    }
    return res.status(502).json({
      error: 'Upstream request failed',
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}
