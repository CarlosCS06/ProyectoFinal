module.exports = async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const endpoint = (req.query.endpoint || 'games').toString();
    const bodyText = typeof req.body === 'string' ? req.body : req.body || '';

    console.log('API Call:', endpoint);
    console.log('Client ID available:', !!process.env.IGDB_CLIENT_ID);
    console.log('Client Secret available:', !!process.env.IGDB_CLIENT_SECRET);

    if (!process.env.IGDB_CLIENT_ID || !process.env.IGDB_CLIENT_SECRET) {
      return res.status(500).json({ 
        error: 'Missing IGDB credentials in environment variables',
        clientIdExists: !!process.env.IGDB_CLIENT_ID,
        clientSecretExists: !!process.env.IGDB_CLIENT_SECRET
      });
    }

    // Obtener token de Twitch
    const tokenResp = await fetch(
      `https://id.twitch.tv/oauth2/token?client_id=${process.env.IGDB_CLIENT_ID}` +
      `&client_secret=${process.env.IGDB_CLIENT_SECRET}&grant_type=client_credentials`,
      { method: 'POST' }
    );
    
    const tokenJson = await tokenResp.json();
    if (!tokenResp.ok) {
      console.error('Token error:', tokenJson);
      return res.status(tokenResp.status).json({ 
        error: 'Token error', 
        details: tokenJson 
      });
    }

    const accessToken = tokenJson.access_token;

    // Llamar a IGDB
    const igdbResp = await fetch(`https://api.igdb.com/v4/${endpoint}`, {
      method: 'POST',
      headers: {
        'Client-ID': process.env.IGDB_CLIENT_ID,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'text/plain',
      },
      body: bodyText,
    });

    const text = await igdbResp.text();
    res.status(igdbResp.status);
    res.setHeader('Content-Type', 'application/json');
    return res.send(text);
  } catch (e) {
    console.error('API Error:', e);
    return res.status(500).json({ 
      error: 'Server error', 
      details: String(e?.message || e) 
    });
  }
};
