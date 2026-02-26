
async function test() {
    console.log("Testing with _sort=-total_rating&total_rating_gte=1");
    // Note: json-server operators use _gte
    try {
        const res = await fetch('http://localhost:3001/games?_sort=-total_rating&total_rating_gte=1&_per_page=5&_page=1');
        const data = await res.json();

        let games;
        if (!Array.isArray(data) && data.data) {
            games = data.data;
        } else if (Array.isArray(data)) {
            games = data;
        } else {
            console.log("Unexpected format:", data);
            return;
        }

        if (games.length > 0) {
            console.log("First item:", games[0].name);
            console.log("First item rating:", games[0].total_rating);
        } else {
            console.log("No games found with rating >= 1");
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

test();
