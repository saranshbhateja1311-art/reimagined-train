// JEE One Shot OS local server — same lightweight Node serving layer as JEE OS.
'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const ROOT = __dirname;
const PORT = Number(process.env.PORT || 4000);
const MIME = {
  '.html':'text/html; charset=utf-8',
  '.js':'application/javascript; charset=utf-8',
  '.json':'application/json; charset=utf-8',
  '.css':'text/css; charset=utf-8',
  '.txt':'text/plain; charset=utf-8',
  '.ico':'image/x-icon',
  '.png':'image/png',
  '.svg':'image/svg+xml',
  '.webmanifest':'application/manifest+json; charset=utf-8'
};
const server = http.createServer((req,res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, `http://127.0.0.1:${PORT}`).pathname); }
  catch { res.writeHead(400); return res.end('Bad request'); }
  if (pathname === '/health') {
    res.writeHead(200, {'content-type':'application/json','cache-control':'no-store'});
    return res.end(JSON.stringify({ok:true,app:'JEE One Shot OS',port:PORT,curriculum:'116 chapters'}));
  }
  if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405); return res.end('Method Not Allowed'); }
  if (pathname === '/') pathname = '/index.html';
  const file = path.resolve(ROOT, '.' + pathname);
  if (!file.startsWith(ROOT + path.sep)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.stat(file,(err,stat) => {
    if (err || !stat.isFile()) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, {
      'content-type':MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'cache-control':'no-store',
      'content-length':stat.size,
      'x-content-type-options':'nosniff'
    });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(file).pipe(res);
  });
});
server.listen(PORT,'127.0.0.1',() => console.log(`JEE One Shot OS → http://localhost:${PORT}`));
server.on('error', e => {
  if(e.code==='EADDRINUSE') console.error(`Port ${PORT} is already in use. Close the other app or set PORT.`);
  else console.error(e.message);
  process.exitCode=1;
});
