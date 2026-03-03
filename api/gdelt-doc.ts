/**
 * Vercel Serverless Function – GDELT DOC 2.0 proxy
 *
 * Forwards requests to the GDELT DOC API and adds
 * Cache-Control headers so Vercel Edge caches the result.
 * Includes timeout + catch-all error handling to prevent 502s.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

const UPSTREAM = 'https://api.gdeltproject.org/api/v2/doc/doc';
const TIMEOUT_MS = 8_000; // 8 s upstream timeout (Vercel free-tier cap = 10 s)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const qs = new URLSearchParams(req.query as Record<string, string>).toString();
  const url = `${UPSTREAM}?${qs}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

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

    console.error('[gdelt-doc]', isTimeout ? 'TIMEOUT' : err);

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
