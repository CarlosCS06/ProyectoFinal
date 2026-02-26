let cachedToken = null;
let cachedTokenExpiresAt = 0;

async function getAppAccessToken(clientId, clientSecret) {
  const now = Date.now();
  // Reutilizamos token
  if (cachedToken && now < cachedTokenExpiresAt - 60_000) {
    return cachedToken;
  }

  const tokenUrl =
    `https://id.twitch.tv/oauth2/token` +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&client_secret=${encodeURIComponent(clientSecret)}` +
    `&grant_type=client_credentials`;

  const tokenResp = await fetch(tokenUrl, { method: "POST" });
  const tokenJson = await tokenResp.json();

  if (!tokenResp.ok) {
    const msg = tokenJson?.message || tokenJson?.error || "Token request failed";
    throw new Error(`Twitch token error (${tokenResp.status}): ${msg}`);
  }

  // { access_token, expires_in, token_type }
  cachedToken = tokenJson.access_token;
  cachedTokenExpiresAt = Date.now() + (tokenJson.expires_in * 1000);
  return cachedToken;
}

export default async function handler(req, res) {
  // CORS (para local vale con '*'; si quieres, pon tu origen)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 1) Endpoint permitido (evita que te llamen a cualquier cosa rara)
    const allowedEndpoints = new Set([
      "games",
      "genres",
      "platforms",
      "covers",
      "involved_companies",
      "companies",
      "release_dates"
    ]);

    const endpoint = String(req.query.endpoint || "games");
    if (!allowedEndpoints.has(endpoint)) {
      return res.status(400).json({
        error: "Invalid endpoint",
        allowed: Array.from(allowedEndpoints)
      });
    }

    // 2) Body en texto plano 
    const bodyText =
      typeof req.body === "string"
        ? req.body
        : req.body
          ? JSON.stringify(req.body)
          : "";

    if (!bodyText || bodyText.trim().length === 0) {
      return res.status(400).json({ error: "Empty IGDB query body" });
    }

    // 3) Credenciales del server (NO VITE_)
    const clientId = process.env.TWITCH_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return res.status(500).json({
        error: "Missing server credentials",
        hasClientId: !!clientId,
        hasClientSecret: !!clientSecret
      });
    }

    // 4) Token app de Twitch (cacheado)
    const accessToken = await getAppAccessToken(clientId, clientSecret);

    // 5) Llamada a IGDB
    const igdbResp = await fetch(`https://api.igdb.com/v4/${endpoint}`, {
      method: "POST",
      headers: {
        "Client-ID": clientId,
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "text/plain"
      },
      body: bodyText
    });

    const text = await igdbResp.text();

    // Pasamos status tal cual y devolvemos JSON (IGDB responde JSON)
    res.status(igdbResp.status);
    res.setHeader("Content-Type", "application/json");
    return res.send(text);
  } catch (e) {
    console.error("IGDB API Error:", e);
    return res.status(500).json({
      error: "Server error",
      details: String(e?.message || e)
    });
  }
}
