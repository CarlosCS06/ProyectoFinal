const https = require('https');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const CLIENT_ID = '8jdmsei3ftzoamlgrku1updly5umcj';
const BEARER_TOKEN = 'q4jfm4jkc1902wzzxs30v5l8jtlj5d';

const options = {
    method: 'POST',
    headers: {
        'Client-ID': CLIENT_ID,
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Content-Type': 'text/plain',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
};
console.log('Using Token:', BEARER_TOKEN.substring(0, 5) + '...');

const targetUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://httpbin.org/post');

const req = https.request(targetUrl, options, (res) => {
    console.log('Status Code:', res.statusCode);
    console.log('Proxy Headers:', res.headers);
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log('IGDB Response:', data);
        if (data.includes('Authorization Failure')) {
            console.log('HINT: The headers might not be reaching IGDB. Checking AllOrigins docs...');
        }
    });
});

req.on('error', (e) => {
    console.error('Error:', e);
});

req.write('fields name; limit 5;');
req.end();
