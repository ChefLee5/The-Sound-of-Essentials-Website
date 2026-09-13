import http from 'http';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLIENT_ID = 'psEpNiMLYgt3xhrefBZJX4Py1TczQYkfOxh5ac14waw';
const PORT = 3333;
const REDIRECT_URI = `http://localhost:${PORT}/callback`;

// Generate PKCE
const verifier = crypto.randomBytes(32).toString('base64url');
const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');

const authUrl = `https://mcp.pushowl.io/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&code_challenge=${challenge}&code_challenge_method=S256`;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  
  if (url.pathname === '/callback') {
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');
    const errorDesc = url.searchParams.get('error_description');

    if (error) {
      res.writeHead(400, { 'Content-Type': 'text/html' });
      res.end(`<h2>Authorization Failed</h2><p>${error}: ${errorDesc}</p>`);
      console.error('❌ Authorization error:', error, errorDesc);
      return;
    }

    if (code) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <div style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: #16a34a;">🎉 Brevo PushOwl Connected!</h1>
          <p>Authorization code received. Exchanging for token and saving configuration...</p>
          <p>You can close this browser window and return to chat.</p>
        </div>
      `);

      console.log('✓ Received authorization code:', code);
      console.log('🔄 Exchanging for access token...');

      try {
        const tokenRes = await fetch('https://mcp.pushowl.io/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            code: code,
            redirect_uri: REDIRECT_URI,
            code_verifier: verifier,
          }),
        });

        const tokenData = await tokenRes.json();
        console.log('✓ Token Response:', tokenData);

        if (tokenData.access_token) {
          const configPath = path.resolve(__dirname, '../.pushowl-token.json');
          fs.writeFileSync(configPath, JSON.stringify(tokenData, null, 2));
          console.log(`\n🎉 SUCCESS! Access token saved to ${configPath}`);
          console.log('Token:', tokenData.access_token);
        } else {
          console.error('❌ Failed to get access token:', tokenData);
        }
      } catch (err) {
        console.error('❌ Token exchange error:', err);
      } finally {
        setTimeout(() => {
          server.close();
          process.exit(0);
        }, 1500);
      }
    }
  }
});

server.listen(PORT, () => {
  console.log(`\n🚀 Brevo PushOwl OAuth Helper running on port ${PORT}`);
  console.log(`\n👉 PLEASE OPEN THIS URL IN YOUR BROWSER TO AUTHORIZE:\n\n${authUrl}\n`);
});
