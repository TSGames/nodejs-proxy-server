const http = require('http');
const httpProxy = require('http-proxy');

const thisUrl = process.env.PROXY_SOURCE_URL
const replaceUrl = process.env.PROXY_REPLACE_URL

// Ziel-URL, an die alle Anfragen weitergeleitet werden sollen
const targetUrl = process.env.PROXY_TARGET_URL

const proxy = httpProxy.createProxyServer({ target: targetUrl, selfHandleResponse: true, changeOrigin: true });

proxy.on('proxyReq', (proxyReq, req, res) => {
    const encoding = proxyReq.getHeader('Accept-Encoding');
    if (encoding) {
      proxyReq.removeHeader('Accept-Encoding');
    }
  });

// Antwort-Interceptor einrichten
proxy.on('proxyRes', (proxyRes, req, res) => {
  let body = [];

  
  // Datenstücke vom Zielserver sammeln
  proxyRes.on('data', (chunk) => {
    body.push(chunk);
  });

  // Wenn die gesamte Antwort empfangen wurde
  proxyRes.on('end', () => {
    body = Buffer.concat(body).toString();

    // Hier kannst du die Antwort modifizieren

    // Beispiel: Ersetze einen bestimmten Text in der Antwort
    let modifiedBody = body.replaceAll(replaceUrl, thisUrl);


    // Antwort zurück an den Client senden
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    res.end(modifiedBody);
  });
});

// Erstellen eines HTTP-Servers
const server = http.createServer((req, res) => {

  // Weiterleiten der Anfrage an den Zielserver
  proxy.web(req, res, {}, (err) => {
    console.error('Proxy-Fehler:', err);
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('Proxy-Fehler');
  });
});

// Server auf Port 3000 starten
server.listen(80, () => {
  console.log('Proxy-Server läuft auf 80');
});
