
/**
 * Obtener juegos próximos (aún no lanzados) desde IGDB y añadirlos a db.json
 * Uso: node scripts/seed-upcoming.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const CLIENT_ID = '8jdmsei3ftzoamlgrku1updly5umcj';
const CLIENT_SECRET = '75zgqch6g9sp6awe11intki86pfyd4';

async function getTwitchToken() {
    const url = `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`;
    const res = await fetch(url, { method: 'POST' });
    const data = await res.json();
    if (!res.ok) throw new Error(`Token error: ${JSON.stringify(data)}`);
    return data.access_token;
}

async function queryIGDB(token, body) {
    const res = await fetch('https://api.igdb.com/v4/games', {
        method: 'POST',
        headers: {
            'Client-ID': CLIENT_ID,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'text/plain',
        },
        body,
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`IGDB error (${res.status}): ${text}`);
    return JSON.parse(text);
}

function fixUrls(game) {
    if (game.cover && game.cover.url) {
        let url = game.cover.url;
        if (url.startsWith('//')) url = 'https:' + url;
        url = url.replace(/\/t_[^/]+\//, '/t_cover_big/');
        game.cover.url = url;
    }
    if (game.screenshots) {
        game.screenshots = game.screenshots.map(s => {
            let url = s.url;
            if (url && url.startsWith('//')) url = 'https:' + url;
            if (url) url = url.replace(/\/t_[^/]+\//, '/t_screenshot_big/');
            return { ...s, url };
        });
    }
    return game;
}

function mapToSpanish(game) {
    return {
        id: game.id,
        nombre: game.name,
        resumen: game.summary,
        generos: game.genres ? game.genres.map(g => ({ id: g.id, nombre: g.name })) : [],
        plataformas: game.platforms ? game.platforms.map(p => ({ id: p.id, nombre: p.name })) : [],
        valoracion: game.total_rating,
        valoracion_cuenta: game.total_rating_count,
        fecha_lanzamiento: game.first_release_date,
        portada: game.cover,
        capturas: game.screenshots,
        videos: game.videos,
        modos_juego: game.game_modes ? game.game_modes.map(gm => ({ id: gm.id, nombre: gm.name })) : [],
        temas: game.themes ? game.themes.map(t => ({ id: t.id, nombre: t.name })) : [],
        hype: game.hypes,
        companias: game.involved_companies ? game.involved_companies.map(ic => ({
            id: ic.id,
            compania: { id: ic.company.id, nombre: ic.company.name },
            desarrollador: ic.developer,
            editor: ic.publisher
        })) : []
    };
}

async function main() {
    console.log('🚀 Fetching upcoming games from IGDB (Spanish)\n');

    const token = await getTwitchToken();

    // Timestamp actual en segundos (IGDB usa timestamps Unix)
    const nowUnix = Math.floor(Date.now() / 1000);

    // Obtener juegos próximos: fecha de lanzamiento > ahora, ordenados por fecha ascendente
    // Hacemos 2 lotes de 500 = hasta 1000 juegos próximos
    const allUpcoming = [];
    const seenIds = new Set();

    for (let batch = 0; batch < 2; batch++) {
        const offset = batch * 500;
        console.log(`📦 Batch ${batch + 1}/2 (offset ${offset})...`);

        const query = `
            fields name, cover.url, genres.id, genres.name,
                   platforms.id, platforms.name,
                   total_rating, total_rating_count,
                   first_release_date, summary,
                   screenshots.url, videos.video_id, videos.name,
                   involved_companies.company.name, involved_companies.developer,
                   involved_companies.publisher,
                   game_modes.name, themes.name, hypes;
            where first_release_date > ${nowUnix} & cover != null & version_parent = null;
            sort first_release_date asc;
            limit 500;
            offset ${offset};
        `;

        const games = await queryIGDB(token, query);

        if (games.length === 0) {
            console.log('   No hay más juegos próximos.');
            break;
        }

        for (const game of games) {
            if (!seenIds.has(game.id)) {
                seenIds.add(game.id);
                const fixedGame = fixUrls(game);
                const spanishGame = mapToSpanish(fixedGame);
                allUpcoming.push(spanishGame);
            }
        }

        console.log(`   ✅ ${games.length} juegos próximos (total: ${allUpcoming.length})`);
        await new Promise(r => setTimeout(r, 300));
    }

    console.log(`\n📊 Total juegos próximos: ${allUpcoming.length}`);

    // Leer db.json existente y fusionar
    const dbPath = path.join(ROOT, 'api', 'db.json');
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

    // Check if db.games exists and has items
    const existingIds = new Set((db.games || []).map(g => g.id));
    let added = 0;

    // Ensure db.games exists
    if (!db.games) db.games = [];

    for (const game of allUpcoming) {
        if (!existingIds.has(game.id)) {
            db.games.push(game);
            existingIds.add(game.id);
            added++;
        }
    }

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
    console.log(`✅ Añadidos ${added} juegos próximos (total en db: ${db.games.length})`);
}

main().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
