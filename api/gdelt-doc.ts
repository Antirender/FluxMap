/**
 * Vercel Serverless Function – GDELT DOC 2.0 proxy
 *
 * Uses Node.js native http/https modules (NOT fetch/undici) because
 * GDELT's server sometimes has SSL/TLS handshake issues that cause
 * undici's fetch to fail entirely. We try HTTP first (fastest), then
 * HTTPS as fallback, with retry logic.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import http from 'node:http';
import https from 'node:https';

const UPSTREAM_HTTP  = 'http://api.gdeltproject.org/api/v2/doc/doc';
const UPSTREAM_HTTPS = 'https://api.gdeltproject.org/api/v2/doc/doc';

/** Pick timeout based on the timespan param */
function pickTimeout(qs: string): number {
  if (qs.includes('timespan=7d') || qs.includes('timespan=1w')) return 25_000;
  if (qs.includes('timespan=24h')) return 20_000;
  return 15_000;
}

/** Make a GET request using Node.js core http/https module */
function httpGet(url: string, timeoutMs: number): Promise<{ status: number; body: string; contentType: string }> {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, { timeout: timeoutMs, headers: { 'User-Agent': 'FluxMap/1.0' } }, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (chunk: Buffer) => chunks.push(chunk));
      res.on('end', () => {
        resolve({
          status: res.statusCode ?? 500,
          body: Buffer.concat(chunks).toString('utf-8'),
          contentType: res.headers['content-type'] ?? 'application/json',
        });
      });
      res.on('error', reject);
    });
    req.on('timeout', () => { req.destroy(); reject(new Error('TIMEOUT')); });
    req.on('error', reject);
  });
}

/** Try fetching with retries, HTTP first then HTTPS */
async function fetchWithRetry(qs: string, timeoutMs: number) {
  const urls = [
    `${UPSTREAM_HTTP}?${qs}`,
    `${UPSTREAM_HTTPS}?${qs}`,
  ];

  let lastErr: Error | null = null;

  for (const url of urls) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        console.log(`[gdelt-doc] attempt ${attempt + 1} → ${url.slice(0, 60)}…`);
        return await httpGet(url, timeoutMs);
      } catch (e) {
        lastErr = e instanceof Error ? e : new Error(String(e));
        console.warn(`[gdelt-doc] attempt ${attempt + 1} failed:`, lastErr.message);
        // small backoff before retry
        if (attempt === 0) await new Promise(r => setTimeout(r, 500));
      }
    }
  }

  throw lastErr ?? new Error('All fetch attempts failed');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const qs = new URLSearchParams(req.query as Record<string, string>).toString();

  try {
    const result = await fetchWithRetry(qs, pickTimeout(qs));

    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=600');

    return res.status(result.status).send(result.body);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[gdelt-doc] all attempts failed:', msg);

    return res.status(502).json({
      error: 'GDELT API unreachable',
      message: msg,
      hint: 'The GDELT API server may be temporarily down. Try again in a few minutes.',
    });
  }
}
