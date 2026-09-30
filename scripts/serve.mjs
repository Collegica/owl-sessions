// A static server for running the app locally: `npm start`, then open the
// address it prints. No dependencies.

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, normalize, extname } from 'node:path';
import { ROOT } from './bundle.mjs';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.mp4': 'video/mp4',
  '.wasm': 'application/wasm',
};

const port = Number(process.env.PORT) || 8000;

createServer(async (req, res) => {
  let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (path.endsWith('/')) path += 'index.html';
  const file = normalize(join(ROOT, path));
  if (!file.startsWith(ROOT)) {
    res.writeHead(403).end();
    return;
  }
  try {
    const body = await readFile(file);
    const headers = { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-store', 'Accept-Ranges': 'bytes' };
    // Safari plays video only from servers that answer byte ranges.
    const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range ?? '');
    if (range) {
      const start = range[1] === '' ? Math.max(0, body.length - Number(range[2])) : Number(range[1]);
      const end = range[1] !== '' && range[2] !== '' ? Math.min(Number(range[2]), body.length - 1) : body.length - 1;
      if (start > end || start >= body.length) {
        res.writeHead(416, { 'Content-Range': `bytes */${body.length}` }).end();
        return;
      }
      res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${body.length}` });
      res.end(body.subarray(start, end + 1));
      return;
    }
    res.writeHead(200, headers);
    res.end(body);
  } catch {
    res.writeHead(404).end('Not found');
  }
}).listen(port, () => console.log(`http://localhost:${port}/`));
