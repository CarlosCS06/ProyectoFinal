/**
 * Script de semillas: Obtiene TODOS los juegos populares de la API de IGDB en lotes masivos
 * y rellena api/db.json.
 * 
 * IGDB permite un máximo de 500 por petición. Hacemos múltiples lotes con offset
 * para obtener tantos juegos valorados como sea posible.
 *
 * Uso: node scripts/seed-games.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

// --- Configuración ---
const CLIENT_ID = '8jdmsei3ftzoamlgrku1updly5umcj';
const CLIENT_SECRET = '75zgqch6g9sp6awe11intki86pfyd4';
const BATCH_SIZE = 500;   // Máximo por petición en IGDB
const MAX_BATCHES = 1;    // 1 lote = 500 juegos top

// --- Ayudantes ---
async function getTwitchToken() {
    const url = `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`;
    const res = await fetch(url, { method: 'POST' });
    const data = await res.json();
    if (!res.ok) throw new Error(`Token error: ${JSON.stringify(data)}`);
    console.log('✅ Token obtenido');
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

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    console.log('🎮 IGDB Bulk Game Seeder (Spanish Edition)\n');

    const token = await getTwitchToken();
    const allGames = [];
    const seenIds = new Set();

    for (let batch = 0; batch < MAX_BATCHES; batch++) {
        const offset = batch * BATCH_SIZE;
        console.log(`📦 Lote ${batch + 1}/${MAX_BATCHES} (desplazamiento ${offset})...`);

        try {
            // Obtener juegos que tengan portada, valoración y sean juegos principales (no DLC/mods)
            const query = `
                fields name, cover.url, genres.id, genres.name,
                       platforms.id, platforms.name,
                       total_rating, total_rating_count,
                       first_release_date, summary,
                       screenshots.url, videos.video_id, videos.name,
                       involved_companies.company.name, involved_companies.developer,
                       involved_companies.publisher,
                       game_modes.name, themes.name;
                where cover != null & total_rating != null & total_rating_count > 1 
                      & version_parent = null;
                sort total_rating_count desc;
                limit ${BATCH_SIZE};
                offset ${offset};
            `;

            const games = await queryIGDB(token, query);

            if (games.length === 0) {
                console.log('   No más juegos disponibles. Parando.');
                break;
            }

            let added = 0;
            for (const game of games) {
                if (!seenIds.has(game.id)) {
                    seenIds.add(game.id);
                    // 1. Fix URLs in English object
                    const fixedGame = fixUrls(game);
                    // 2. Map to Spanish object
                    const spanishGame = mapToSpanish(fixedGame);

                    allGames.push(spanishGame);
                    added++;
                }
            }

            console.log(`   ✅ ${added} juegos nuevos (total acumulado: ${allGames.length})`);

            // Rate limit: wait between requests
            await delay(300);
        } catch (err) {
            console.log(`   ❌ Error en lote ${batch + 1}: ${err.message}`);
            await delay(1000);
        }
    }

    console.log(`\n📊 Total juegos obtenidos: ${allGames.length}`);

    // Read existing db.json and update games
    const dbPath = path.join(ROOT, 'api', 'db.json');
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

    // Update games
    db.games = allGames;

    // Migrate genres -> generos if needed
    if (db.genres) {
        db.generos = db.genres.map(g => ({ id: g.id, nombre: g.name || g.nombre }));
        delete db.genres;
        console.log('   🔄 Migrado db.genres -> db.generos');
    }

    // Migrate platforms -> plataformas if needed
    if (db.platforms) {
        db.plataformas = db.platforms.map(p => ({ id: p.id, nombre: p.name || p.nombre }));
        delete db.platforms;
        console.log('   🔄 Migrado db.platforms -> db.plataformas');
    }

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
    console.log(`✅ Guardados ${allGames.length} juegos en api/db.json (Estructura en Español)`);

    // Print some stats
    const withScreenshots = allGames.filter(g => g.capturas && g.capturas.length > 0).length;
    console.log(`\n📈 Estadísticas:`);
    console.log(`   Juegos con portada: ${allGames.filter(g => g.portada).length}`);
    console.log(`   Juegos con capturas: ${withScreenshots}`);
    console.log(`   Juegos con resumen: ${allGames.filter(g => g.resumen).length}`);
}

main().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
