const http = require('http');
const https = require('https');
const url = require('url');

const port = 3000;

const requestHandler = (req, res) => {
  const apiUrl = 'https://random-word-api.vercel.app/api?words=24&length=9';
  const options = url.parse(apiUrl);
  options.method = req.method;
  options.headers = req.headers;

  const proxyReq = https.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  req.pipe(proxyReq, { end: true });
};

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
  if (err) {
    console.error('Error starting server:', err);
  } else {
    console.log(`Proxy server listening on port ${port}`);
  }
});
