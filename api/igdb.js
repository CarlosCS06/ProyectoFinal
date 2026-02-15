export default async function handler(req, res) {
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

    const clientId = process.env.IGDB_CLIENT_ID;
    const clientSecret = process.env.IGDB_CLIENT_SECRET;

    console.log('=== API DEBUG ===');
    console.log('Endpoint:', endpoint);
    console.log('Client ID:', clientId ? clientId.substring(0, 5) + '...' : 'MISSING');
    console.log('Client Secret:', clientSecret ? clientSecret.substring(0, 5) + '...' : 'MISSING');
    console.log('Body length:', bodyText.length);

    if (!clientId || !clientSecret) {
      console.error('MISSING CREDENTIALS!');
      return res.status(500).json({ 
        error: 'Missing IGDB credentials',
        hasClientId: !!clientId,
        hasClientSecret: !!clientSecret
      });
    }

    // Obtener token de Twitch
    const tokenUrl = `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`;
    console.log('Requesting token from Twitch...');
    
    const tokenResp = await fetch(tokenUrl, { method: 'POST' });
    const tokenJson = await tokenResp.json();
    
    console.log('Token response status:', tokenResp.status);
    
    if (!tokenResp.ok) {
      console.error('Token error:', tokenJson);
      return res.status(tokenResp.status).json({ 
        error: 'Token error', 
        details: tokenJson 
      });
    }

    const accessToken = tokenJson.access_token;
    console.log('Token obtained successfully');

    // Llamar a IGDB
    console.log('Calling IGDB endpoint:', endpoint);
    const igdbResp = await fetch(`https://api.igdb.com/v4/${endpoint}`, {
      method: 'POST',
      headers: {
        'Client-ID': clientId,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'text/plain',
      },
      body: bodyText,
    });

    const text = await igdbResp.text();
    console.log('IGDB Response Status:', igdbResp.status);
    
    res.status(igdbResp.status);
    res.setHeader('Content-Type', 'application/json');
    return res.send(text);
  } catch (e) {
    console.error('API Error:', e.message);
    return res.status(500).json({ 
      error: 'Server error', 
      details: String(e?.message || e) 
    });
  }
}
}
