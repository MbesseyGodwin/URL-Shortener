const http = require('http');
const { parse } = require('querystring');

const PORT = 3000;
const baseUrl = 'http://localhost:3000/';

// Object to store the mappings between short codes and long URLs
const urlDatabase = {};

// Function to generate a random short code
function generateShortCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let shortCode = '';
  for (let i = 0; i < 6; i++) {
    shortCode += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return shortCode;
}

const server = http.createServer((req, res) => {
  const { url, method } = req;

  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'GET' && url.startsWith('/api/shorten')) {
    const parsedUrl = new URL(`http://${url}`);
    const longUrl = parsedUrl.searchParams.get('longUrl');

    if (!longUrl) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Bad Request: Missing longUrl parameter');
      return;
    }

    // Check if the long URL already has a corresponding short code
    let shortCode = Object.keys(urlDatabase).find(key => urlDatabase[key] === longUrl);

    // If not, generate a new short code
    if (!shortCode) {
      do {
        shortCode = generateShortCode();
      } while (urlDatabase[shortCode]); // Ensure the short code is unique

      // Store the mapping between the short code and the long URL
      urlDatabase[shortCode] = longUrl;
    }

    const shortUrl = baseUrl + shortCode;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ shortUrl }));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
