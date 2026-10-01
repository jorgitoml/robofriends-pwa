import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('../build', import.meta.url)));
const basePath = '/robofriends-pwa';
const portArgumentIndex = process.argv.indexOf('--port');
const port = Number(portArgumentIndex >= 0 ? process.argv[portArgumentIndex + 1] : 4173);
const host = process.argv.includes('--host') ? '127.0.0.1' : '127.0.0.1';
const contentTypes = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
};

createServer((request, response) => {
  const requestPath = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
  const relativePath = requestPath === basePath
    ? '/'
    : requestPath.startsWith(`${basePath}/`)
      ? requestPath.slice(basePath.length)
      : requestPath;
  const candidate = normalize(join(root, relativePath));
  const safeCandidate = candidate.startsWith(`${root}/`) ? candidate : root;
  const filePath = existsSync(safeCandidate) && statSync(safeCandidate).isFile()
    ? safeCandidate
    : join(root, 'index.html');

  response.setHeader('Content-Type', contentTypes[extname(filePath)] ?? 'application/octet-stream');
  createReadStream(filePath).on('error', () => {
    response.writeHead(404);
    response.end();
  }).pipe(response);
}).listen(port, host, () => {
  process.stdout.write(`Preview server listening on http://${host}:${port}\n`);
});
