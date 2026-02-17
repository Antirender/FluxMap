/**
 * Vercel Serverless Function – GDELT DOC 2.0 proxy
 *
 * Forwards requests to the GDELT DOC API and adds
 * Cache-Control headers so Vercel Edge caches the result.
 * This also avoids GDELT's own per-IP rate limiting by
 * making all requests from Vercel's egress IPs instead.
 *
 * Usage: GET /api/gdelt-doc?query=...&mode=ArtList&format=json&timespan=60min
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

const UPSTREAM = 'https://api.gdeltproject.org/api/v2/doc/doc';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const qs = new URLSearchParams(req.query as Record<string, string>).toString();
  const url = `${UPSTREAM}?${qs}`;

  try {
    const upstream = await fetch(url, {
      headers: { 'User-Agent': 'FluxMap/1.0 (Vercel Serverless)' },
    });

    const body = await upstream.text();

    const ct = upstream.headers.get('content-type') ?? 'application/json';
    res.setHeader('Content-Type', ct);

    // CDN cache: 60 s fresh, serve stale up to 5 min while revalidating
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=300',
    );

    res.status(upstream.status).send(body);
  } catch (err: unknown) {
    console.error('[gdelt-doc] upstream error:', err);
    res.status(502).json({ error: 'Upstream request failed' });
  }
}
