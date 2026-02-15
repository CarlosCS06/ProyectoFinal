const https = require("https");

const CLIENT_ID = process.env.IGDB_CLIENT_ID;
const TOKEN = process.env.IGDB_BEARER_TOKEN;

if (!CLIENT_ID || !TOKEN) {
    console.error("Faltan variables: IGDB_CLIENT_ID y/o IGDB_BEARER_TOKEN");
    process.exit(1);
}

const options = {
    hostname: "api.igdb.com",
    path: "/v4/games",
    method: "POST",
    headers: {
        "Client-ID": CLIENT_ID,
        "Authorization": `Bearer ${TOKEN}`,
        "Content-Type": "text/plain",
        "Accept": "application/json",
    },
};

const req = https.request(options, (res) => {
    let data = "";
    console.log("Status:", res.statusCode);
    res.on("data", (chunk) => (data += chunk));
    res.on("end", () => console.log("Body:", data));
});

req.on("error", (e) => console.error("Error:", e));

req.write("fields name,rating; limit 5;");
req.end();
