/**
 * Vercel Serverless Function – GDELT GEO 2.0 proxy
 *
 * Forwards requests to the GDELT GEO API and adds
 * Cache-Control headers so Vercel Edge caches the result.
 *
 * Usage: GET /api/gdelt-geo?query=...&mode=PointData&format=GeoJSON&timespan=60min
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

const UPSTREAM = 'https://api.gdeltproject.org/api/v2/geo/geo';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Forward all query params to GDELT
  const qs = new URLSearchParams(req.query as Record<string, string>).toString();
  const url = `${UPSTREAM}?${qs}`;

  try {
    const upstream = await fetch(url, {
      headers: { 'User-Agent': 'FluxMap/1.0 (Vercel Serverless)' },
    });

    const body = await upstream.text();

    // Forward content-type from GDELT
    const ct = upstream.headers.get('content-type') ?? 'application/json';
    res.setHeader('Content-Type', ct);

    // CDN cache: 60 s fresh, serve stale up to 5 min while revalidating
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=300',
    );

    res.status(upstream.status).send(body);
  } catch (err: unknown) {
    console.error('[gdelt-geo] upstream error:', err);
    res.status(502).json({ error: 'Upstream request failed' });
  }
}
