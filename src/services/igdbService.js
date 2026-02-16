const LOCAL_BASE_URL = 'http://localhost:3001';

// En Vercel, usamos las funciones serverless; en desarrollo con proxy
const API_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
    ? '/api/igdb' 
    : '/igdb-api';

// Mock data para Vercel - Librería extensa de juegos
const mockGames = [
  { id: 1, name: 'Elden Ring', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co2n7k.jpg' }, total_rating: 96, first_release_date: 1646092800, platforms: [{ name: 'PC' }, { name: 'PlayStation 5' }], genres: [{ name: 'RPG' }, { name: 'Action' }] },
  { id: 2, name: 'Baldur\'s Gate 3', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co5mof.jpg' }, total_rating: 96, first_release_date: 1691539200, platforms: [{ name: 'PC' }, { name: 'PlayStation 5' }], genres: [{ name: 'RPG' }] },
  { id: 3, name: 'Starfield', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co68qn.jpg' }, total_rating: 83, first_release_date: 1694995200, platforms: [{ name: 'Xbox Series X|S' }, { name: 'PC' }], genres: [{ name: 'RPG' }, { name: 'Adventure' }] },
  { id: 4, name: 'Final Fantasy XVI', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co5sfb.jpg' }, total_rating: 87, first_release_date: 1687305600, platforms: [{ name: 'PlayStation 5' }], genres: [{ name: 'RPG' }, { name: 'Action' }] },
  { id: 5, name: 'Hogwarts Legacy', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co5vqs.jpg' }, total_rating: 81, first_release_date: 1675382400, platforms: [{ name: 'PC' }, { name: 'PlayStation 5' }, { name: 'Xbox Series X|S' }], genres: [{ name: 'RPG' }, { name: 'Adventure' }] },
  { id: 6, name: 'Cyberpunk 2077', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co2z2a.jpg' }, total_rating: 77, first_release_date: 1607644800, platforms: [{ name: 'PC' }, { name: 'PlayStation 5' }, { name: 'Xbox Series X|S' }], genres: [{ name: 'RPG' }, { name: 'Action' }] },
  { id: 7, name: 'The Legend of Zelda: Tears of the Kingdom', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co5w8i.jpg' }, total_rating: 88, first_release_date: 1684108800, platforms: [{ name: 'Nintendo Switch' }], genres: [{ name: 'Adventure' }, { name: 'Action' }] },
  { id: 8, name: 'Forspoken', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co5z1g.jpg' }, total_rating: 66, first_release_date: 1675209600, platforms: [{ name: 'PC' }, { name: 'PlayStation 5' }], genres: [{ name: 'RPG' }, { name: 'Action' }] },
  { id: 9, name: 'Persona 5 Royal', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co1tey.jpg' }, total_rating: 94, first_release_date: 1579824000, platforms: [{ name: 'PlayStation 4' }, { name: 'PC' }], genres: [{ name: 'RPG' }, { name: 'Social Simulation' }] },
  { id: 10, name: 'Dark Souls III', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co1xzn.jpg' }, total_rating: 89, first_release_date: 1459468800, platforms: [{ name: 'PC' }, { name: 'PlayStation 4' }, { name: 'Xbox One' }], genres: [{ name: 'RPG' }, { name: 'Action' }] },
  { id: 11, name: 'Sekiro: Shadows Die Twice', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co1r2d.jpg' }, total_rating: 90, first_release_date: 1552608000, platforms: [{ name: 'PC' }, { name: 'PlayStation 4' }, { name: 'Xbox One' }], genres: [{ name: 'Action' }, { name: 'Adventure' }] },
  { id: 12, name: 'Hollow Knight', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co2k0l.jpg' }, total_rating: 85, first_release_date: 1519257600, platforms: [{ name: 'PC' }, { name: 'Nintendo Switch' }], genres: [{ name: 'Indie' }, { name: 'Metroidvania' }] },
  { id: 13, name: 'Palworld', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co5ygz.jpg' }, total_rating: 75, first_release_date: 1705276800, platforms: [{ name: 'PC' }, { name: 'Xbox Series X|S' }], genres: [{ name: 'Action' }, { name: 'Adventure' }] },
  { id: 14, name: 'Dragon\'s Dogma 2', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co5ygn.jpg' }, total_rating: 85, first_release_date: 1710806400, platforms: [{ name: 'PC' }, { name: 'PlayStation 5' }, { name: 'Xbox Series X|S' }], genres: [{ name: 'RPG' }, { name: 'Action' }] },
  { id: 15, name: 'Metaphor: ReFantazio', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co5yow.jpg' }, total_rating: 86, first_release_date: 1696569600, platforms: [{ name: 'PC' }, { name: 'PlayStation 5' }, { name: 'Xbox Series X|S' }], genres: [{ name: 'RPG' }, { name: 'Strategy' }] },
  { id: 16, name: 'Tekken 8', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co5z0q.jpg' }, total_rating: 84, first_release_date: 1704067200, platforms: [{ name: 'PC' }, { name: 'PlayStation 5' }, { name: 'Xbox Series X|S' }], genres: [{ name: 'Fighting' }] },
  { id: 17, name: 'Street Fighter 6', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co5y3h.jpg' }, total_rating: 88, first_release_date: 1685577600, platforms: [{ name: 'PC' }, { name: 'PlayStation 5' }, { name: 'Xbox Series X|S' }], genres: [{ name: 'Fighting' }] },
  { id: 18, name: 'Armored Core VI Fires of Rubicon', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co5zu9.jpg' }, total_rating: 84, first_release_date: 1693526400, platforms: [{ name: 'PC' }, { name: 'PlayStation 5' }, { name: 'Xbox Series X|S' }], genres: [{ name: 'Action' }, { name: 'Mecha' }] },
  { id: 19, name: 'Diablo IV', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co5z5v.jpg' }, total_rating: 82, first_release_date: 1686182400, platforms: [{ name: 'PC' }, { name: 'PlayStation 5' }, { name: 'Xbox Series X|S' }], genres: [{ name: 'RPG' }, { name: 'Action' }] },
  { id: 20, name: 'Helldivers 2', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co5z1y.jpg' }, total_rating: 88, first_release_date: 1705363200, platforms: [{ name: 'PC' }, { name: 'PlayStation 5' }], genres: [{ name: 'Action' }, { name: 'Shooter' }] },
  { id: 21, name: 'Ghosts of Tsushima', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co1xbv.jpg' }, total_rating: 85, first_release_date: 1594857600, platforms: [{ name: 'PlayStation 4' }], genres: [{ name: 'Action' }, { name: 'Adventure' }] },
  { id: 22, name: 'God of War Ragnarök', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co5fom.jpg' }, total_rating: 90, first_release_date: 1667520000, platforms: [{ name: 'PlayStation 4' }, { name: 'PlayStation 5' }], genres: [{ name: 'Action' }, { name: 'Adventure' }] },
  { id: 23, name: 'Starfield', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co68qn.jpg' }, total_rating: 83, first_release_date: 1694995200, platforms: [{ name: 'PC' }, { name: 'Xbox Series X|S' }], genres: [{ name: 'RPG' }, { name: 'Adventure' }] },
  { id: 24, name: 'The Witcher 3: Wild Hunt', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co1sml.jpg' }, total_rating: 92, first_release_date: 1431979200, platforms: [{ name: 'PC' }, { name: 'PlayStation 4' }, { name: 'Xbox One' }], genres: [{ name: 'RPG' }, { name: 'Action' }] },
  { id: 25, name: 'Monster Hunter: World', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co1rqb.jpg' }, total_rating: 90, first_release_date: 1516118400, platforms: [{ name: 'PC' }, { name: 'PlayStation 4' }, { name: 'Xbox One' }], genres: [{ name: 'Action' }, { name: 'RPG' }] },
  { id: 26, name: 'Final Fantasy VII Remake', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co1tcp.jpg' }, total_rating: 86, first_release_date: 1587081600, platforms: [{ name: 'PlayStation 4' }, { name: 'PlayStation 5' }, { name: 'PC' }], genres: [{ name: 'RPG' }, { name: 'Action' }] },
  { id: 27, name: 'Kingdom Come: Deliverance', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co1xwk.jpg' }, total_rating: 76, first_release_date: 1520035200, platforms: [{ name: 'PC' }, { name: 'PlayStation 4' }, { name: 'Xbox One' }], genres: [{ name: 'RPG' }, { name: 'Action' }] },
  { id: 28, name: 'Starfield', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co68qn.jpg' }, total_rating: 83, first_release_date: 1694995200, platforms: [{ name: 'PC' }, { name: 'Xbox Series X|S' }], genres: [{ name: 'RPG' }, { name: 'Adventure' }] },
  { id: 29, name: 'Hades', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co1qcm.jpg' }, total_rating: 85, first_release_date: 1568505600, platforms: [{ name: 'PC' }, { name: 'Nintendo Switch' }], genres: [{ name: 'Indie' }, { name: 'Action' }] },
  { id: 30, name: 'Nier: Automata', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co1rrx.jpg' }, total_rating: 88, first_release_date: 1488067200, platforms: [{ name: 'PC' }, { name: 'PlayStation 4' }], genres: [{ name: 'RPG' }, { name: 'Action' }] },
  { id: 31, name: 'Bloodborne', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co1x9m.jpg' }, total_rating: 88, first_release_date: 1394409600, platforms: [{ name: 'PlayStation 4' }], genres: [{ name: 'Action' }, { name: 'RPG' }] },
  { id: 32, name: 'Red Dead Redemption 2', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co1q32.jpg' }, total_rating: 97, first_release_date: 1539129600, platforms: [{ name: 'PC' }, { name: 'PlayStation 4' }, { name: 'Xbox One' }], genres: [{ name: 'Action' }, { name: 'Adventure' }] },
  { id: 33, name: 'The Last of Us Part I', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co51xe.jpg' }, total_rating: 90, first_release_date: 1662336000, platforms: [{ name: 'PlayStation 5' }, { name: 'PC' }], genres: [{ name: 'Action' }, { name: 'Adventure' }] },
  { id: 34, name: 'Uncharted 4: A Thief\'s End', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co1v3m.jpg' }, total_rating: 90, first_release_date: 1462060800, platforms: [{ name: 'PlayStation 4' }], genres: [{ name: 'Action' }, { name: 'Adventure' }] },
  { id: 35, name: 'Demon\'s Souls', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co21l1.jpg' }, total_rating: 87, first_release_date: 1602026400, platforms: [{ name: 'PlayStation 5' }], genres: [{ name: 'RPG' }, { name: 'Action' }] },
  { id: 36, name: 'Tales of Arise', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co23hy.jpg' }, total_rating: 76, first_release_date: 1630541100, platforms: [{ name: 'PC' }, { name: 'PlayStation 4' }, { name: 'Xbox One' }], genres: [{ name: 'RPG' }, { name: 'Action' }] },
  { id: 37, name: 'Stellar Blade', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co5kth.jpg' }, total_rating: 82, first_release_date: 1713052800, platforms: [{ name: 'PlayStation 5' }], genres: [{ name: 'Action' }] },
  { id: 38, name: 'Like a Dragon: Infinite Wealth', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co5zmh.jpg' }, total_rating: 82, first_release_date: 1672531200, platforms: [{ name: 'PC' }, { name: 'PlayStation 4' }, { name: 'PlayStation 5' }, { name: 'Xbox Series X|S' }], genres: [{ name: 'RPG' }, { name: 'Action' }] },
  { id: 39, name: 'Wo Long: Fallen Dynasty', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co5yti.jpg' }, total_rating: 75, first_release_date: 1678320000, platforms: [{ name: 'PC' }, { name: 'PlayStation 5' }, { name: 'Xbox Series X|S' }], genres: [{ name: 'Action' }, { name: 'Adventure' }] },
  { id: 40, name: 'Rise of the Tomb Raider', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co1w7l.jpg' }, total_rating: 86, first_release_date: 1447718400, platforms: [{ name: 'PC' }, { name: 'PlayStation 4' }, { name: 'Xbox One' }], genres: [{ name: 'Action' }, { name: 'Adventure' }] },
  { id: 41, name: 'Horizon Zero Dawn', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co1qz2.jpg' }, total_rating: 89, first_release_date: 1488067200, platforms: [{ name: 'PC' }, { name: 'PlayStation 4' }], genres: [{ name: 'Action' }, { name: 'RPG' }] },
  { id: 42, name: 'Horizon Forbidden West', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co3c26.jpg' }, total_rating: 85, first_release_date: 1644451200, platforms: [{ name: 'PC' }, { name: 'PlayStation 4' }, { name: 'PlayStation 5' }], genres: [{ name: 'Action' }, { name: 'Adventure' }] },
  { id: 43, name: 'Soulslikes Collection', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co1xzn.jpg' }, total_rating: 89, first_release_date: 1459468800, platforms: [{ name: 'PC' }, { name: 'PlayStation 4' }], genres: [{ name: 'RPG' }, { name: 'Action' }] },
  { id: 44, name: 'Greedfall', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co2ib1.jpg' }, total_rating: 77, first_release_date: 1597190400, platforms: [{ name: 'PC' }, { name: 'PlayStation 4' }, { name: 'Xbox One' }], genres: [{ name: 'RPG' }, { name: 'Action' }] },
  { id: 45, name: 'Outlander', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co2n8e.jpg' }, total_rating: 68, first_release_date: 1554681600, platforms: [{ name: 'PC' }, { name: 'PlayStation 4' }, { name: 'Xbox One' }], genres: [{ name: 'RPG' }, { name: 'Action' }] },
  { id: 46, name: 'Code Vein', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co1xb5.jpg' }, total_rating: 71, first_release_date: 1568592000, platforms: [{ name: 'PC' }, { name: 'PlayStation 4' }, { name: 'Xbox One' }], genres: [{ name: 'RPG' }, { name: 'Action' }] },
  { id: 47, name: 'Nioh 2', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co2cak.jpg' }, total_rating: 87, first_release_date: 1583020800, platforms: [{ name: 'PC' }, { name: 'PlayStation 5' }], genres: [{ name: 'RPG' }, { name: 'Action' }] },
  { id: 48, name: 'Nioh', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co1xj2.jpg' }, total_rating: 87, first_release_date: 1487635200, platforms: [{ name: 'PC' }, { name: 'PlayStation 4' }], genres: [{ name: 'RPG' }, { name: 'Action' }] },
  { id: 49, name: 'Stray', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co2qak.jpg' }, total_rating: 81, first_release_date: 1658188800, platforms: [{ name: 'PC' }, { name: 'PlayStation 5' }], genres: [{ name: 'Adventure' }, { name: 'Puzzle' }] },
  { id: 50, name: 'A Plague Tale: Innocence', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co22ql.jpg' }, total_rating: 80, first_release_date: 1557360000, platforms: [{ name: 'PC' }, { name: 'PlayStation 4' }, { name: 'Xbox One' }], genres: [{ name: 'Adventure' }, { name: 'Action' }] },
];

const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost';

const fetchFromIGDB = async (endpoint, query) => {
    try {
        // En Vercel, el endpoint va como query parameter
        const url = API_URL === '/api/igdb' 
            ? `${API_URL}?endpoint=${endpoint.replace('/', '')}`
            : `${API_URL}${endpoint}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: query,
        });

        if (!response.ok) throw new Error(`Status ${response.status}`);
        const data = await response.json();
        
        // Validar que sea un array
        if (Array.isArray(data)) {
            return data;
        }
        
        throw new Error('Response is not an array');
    } catch (error) {
        console.log('IGDB fetch failed, trying local fallback:', error.message);
        // Intentar local fallback
        return await handleLocalFallback(endpoint, query);
    }
};

const handleLocalFallback = async (endpoint, query) => {
    try {
        let url = `${LOCAL_BASE_URL}${endpoint}`;

        if (endpoint === '/games') {
            if (query.includes('search')) {
                const searchMatch = query.match(/search "([^"]+)"/);
                if (searchMatch) url += `?q=${encodeURIComponent(searchMatch[1])}`;
            } else if (query.includes('where id =')) {
                const idMatch = query.match(/where id = (\d+)/);
                if (idMatch) url += `/${idMatch[1]}`;
            }
        }

        const res = await fetch(url);
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [data];
    } catch (e) {
        return [];
    }
};

export const igdbService = {
    getTrendingGames: () => fetchFromIGDB('/games',
        `fields name, cover.url, total_rating, first_release_date, platforms.name, genres.name; 
     where total_rating > 80 & total_rating_count > 50 & cover != null; 
     sort total_rating desc; 
     limit 12;`
    ),

    searchGames: (searchQuery, filters = {}) => {
        let whereClause = 'where cover != null';
        if (filters.genre) whereClause += ` & genres = (${filters.genre})`;
        if (filters.platform) whereClause += ` & platforms = (${filters.platform})`;

        return fetchFromIGDB('/games',
            `fields name, cover.url, total_rating, first_release_date, platforms.name, genres.name; 
             search "${searchQuery}";
             ${whereClause};
             limit 48;`
        );
    },

    discoverGames: (filters = {}) => {
        let whereClause = 'where cover != null & total_rating != null';
        if (filters.genre) whereClause += ` & genres = (${filters.genre})`;
        if (filters.platform) whereClause += ` & platforms = (${filters.platform})`;

        let sortClause = 'sort total_rating desc';
        if (filters.sort === 'newest') sortClause = 'sort first_release_date desc';
        if (filters.sort === 'oldest') sortClause = 'sort first_release_date asc';

        return fetchFromIGDB('/games',
            `fields name, cover.url, total_rating, first_release_date, platforms.name, genres.name; 
       ${whereClause};
       ${sortClause};
       limit 24;`
        );
    },

    getGameDetails: (id) => fetchFromIGDB('/games',
        `fields name, summary, storyline, cover.url, total_rating, first_release_date, 
     platforms.name, genres.name, screenshots.url, 
     involved_companies.company.name, involved_companies.developer, involved_companies.publisher,
     videos.video_id, similar_games.name, similar_games.cover.url; 
     where id = ${id};`
    ),

    getGenres: () => fetchFromIGDB('/genres', 'fields name; limit 50; sort name asc;'),
    getPlatforms: () => fetchFromIGDB('/platforms', 'fields name; where id = (6,167,169,130,165);'), // PC, PS5, Xbox Series, Switch, PS4

    getTopRankings: (limit = 50) => fetchFromIGDB('/games',
        `fields name, cover.url, total_rating, first_release_date, platforms.name, genres.name; 
     where total_rating > 85 & total_rating_count > 100 & cover != null; 
     sort total_rating desc; 
     limit ${limit};`
    ),

    getUpcomingReleases: () => {
        const now = Math.floor(Date.now() / 1000);
        return fetchFromIGDB('/games',
            `fields name, cover.url, first_release_date, platforms.name, genres.name, total_rating; 
       where first_release_date > ${now} & cover != null; 
       sort first_release_date asc; 
       limit 24;`
        );
    }
};

export const formatIGDBImage = (url, size = 't_cover_big') => {
    if (!url) return 'https://via.placeholder.com/400x600?text=No+Cover';
    const fullUrl = url.startsWith('//') ? `https:${url}` : url;
    return fullUrl.replace('t_thumb', size);
};

export const getYoutubeUrl = (videoId) => `https://www.youtube.com/embed/${videoId}?autoplay=0&mute=1`;
