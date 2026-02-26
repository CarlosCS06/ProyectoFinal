import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { execSync } from 'child_process'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      {
        name: 'igdb-proxy-bridge',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url?.startsWith('/igdb-api/') || req.url?.startsWith('/twitch-api/')) {
              let targetUrl = '';
              if (req.url.startsWith('/igdb-api/')) {
                const endpoint = req.url.replace('/igdb-api/', '');
                targetUrl = `https://api.igdb.com/v4/${endpoint}`;
              } else if (req.url.startsWith('/twitch-api/')) {
                const endpoint = req.url.replace('/twitch-api/', '');
                targetUrl = `https://id.twitch.tv/oauth2/${endpoint}`;
              }

              let body = '';
              req.on('data', chunk => { body += chunk; });
              req.on('end', () => {
                try {
                  const clientId = env.VITE_IGDB_CLIENT_ID;
                  // Handle Authorization header from client request
                  const clientAuth = req.headers['authorization'];
                  const authHeader = clientAuth ? `-H "Authorization: ${clientAuth}"` : '';

                  const sanitizedBody = body.replace(/\n/g, ' ').replace(/\r/g, ' ');
                  const escapedBody = sanitizedBody ? sanitizedBody.replace(/"/g, '\\"') : '';
                  const bodyFlag = escapedBody ? `-d "${escapedBody}"` : '';

                  // For Twitch token request, we might need query params which are in the URL already or body
                  // But for curl, we construct the command.

                  const curlCmd = `curl.exe -k -s -X POST "${targetUrl}" ` +
                    `-H "Client-ID: ${clientId}" ` +
                    `${authHeader} ` +
                    `-H "Content-Type: text/plain" ` +
                    `${bodyFlag}`;

                  console.log(`Proxying to: ${targetUrl}`);
                  const output = execSync(curlCmd, { stdio: 'pipe' }).toString();
                  res.setHeader('Content-Type', 'application/json');
                  res.setHeader('Access-Control-Allow-Origin', '*');
                  res.end(output);
                } catch (error) {
                  console.error('[CURL Bridge Error]:', error.message);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'Proxy failed', details: error.message }));
                }
              });
              return;
            }
            next();
          });
        }
      }
    ],
    server: {
      proxy: {}
    }
  }
})
