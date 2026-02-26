
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../api/db.json');

async function inspect() {
    try {
        const data = await fs.readFile(dbPath, 'utf-8');
        const db = JSON.parse(data);

        const names = ["The Forgotten Castle", "Lost in Space", "Frontier Paladin"];

        for (const name of names) {
            const game = db.games.find(g => g.name.includes(name));
            if (game) {
                console.log(`\nGame Found: ${game.name} (ID: ${game.id})`);
                console.log("Keys:", Object.keys(game));
                console.log("Total Rating:", game.total_rating);
            } else {
                console.log(`\nGame '${name}' not found.`);
            }
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

inspect();
