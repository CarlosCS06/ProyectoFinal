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
            if (req.url?.startsWith('/igdb-api/')) {
              const endpoint = req.url.replace('/igdb-api/', '');
              let body = '';

              req.on('data', chunk => { body += chunk; });
              req.on('end', () => {
                try {
                  const targetUrl = `https://api.igdb.com/v4/${endpoint}`;
                  const clientId = env.VITE_IGDB_CLIENT_ID;
                  const token = env.VITE_IGDB_BEARER_TOKEN;

                  // Limpiamos el cuerpo de saltos de línea para evitar errores en CMD de Windows
                  const sanitizedBody = body.replace(/\n/g, ' ').replace(/\r/g, ' ');
                  const escapedBody = sanitizedBody ? sanitizedBody.replace(/"/g, '\\"') : '';
                  const bodyFlag = escapedBody ? `-d "${escapedBody}"` : '';

                  const curlCmd = `curl.exe -k -X POST "${targetUrl}" ` +
                    `-H "Client-ID: ${clientId}" ` +
                    `-H "Authorization: Bearer ${token}" ` +
                    `-H "Content-Type: text/plain" ` +
                    `${bodyFlag}`;

                  const output = execSync(curlCmd, { stdio: 'pipe' }).toString();
                  res.setHeader('Content-Type', 'application/json');
                  res.setHeader('Access-Control-Allow-Origin', '*');
                  res.end(output);
                } catch (error) {
                  console.error('[CURL Bridge Error]:', error.message);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'Proxy implementation failed', details: error.message }));
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
