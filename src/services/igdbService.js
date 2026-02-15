const LOCAL_BASE_URL = 'http://localhost:3001';

// En Vercel, usamos las funciones serverless; en desarrollo con proxy
const API_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
    ? '/api/igdb' 
    : '/igdb-api';

// Mock data para Vercel como fallback - más completo
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
        return await response.json();
    } catch (error) {
        console.log('IGDB fetch failed, using mock data');
        // En Vercel, usar mock data como fallback
        if (isProduction) {
            return mockGames;
        }
        // Solo usamos el respaldo local en desarrollo ante fallos de red
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
        // En Vercel, filtrar datos mock localmente
        if (isProduction) {
            let results = mockGames.filter(game => 
                game.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            
            if (filters.genre) {
                results = results.filter(game => 
                    game.genres.some(g => g.name.toLowerCase().includes(filters.genre.toLowerCase()))
                );
            }
            
            if (filters.platform) {
                results = results.filter(game => 
                    game.platforms.some(p => p.name.toLowerCase().includes(filters.platform.toLowerCase()))
                );
            }
            
            return Promise.resolve(results.slice(0, 48));
        }

        // En desarrollo, usar API
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
        // En Vercel, filtrar y ordenar datos mock localmente
        if (isProduction) {
            let results = mockGames;
            
            if (filters.genre) {
                results = results.filter(game => 
                    game.genres.some(g => g.name.toLowerCase().includes(filters.genre.toLowerCase()))
                );
            }
            
            if (filters.platform) {
                results = results.filter(game => 
                    game.platforms.some(p => p.name.toLowerCase().includes(filters.platform.toLowerCase()))
                );
            }
            
            // Ordenar
            if (filters.sort === 'newest') {
                results.sort((a, b) => b.first_release_date - a.first_release_date);
            } else if (filters.sort === 'oldest') {
                results.sort((a, b) => a.first_release_date - b.first_release_date);
            } else {
                results.sort((a, b) => b.total_rating - a.total_rating);
            }
            
            return Promise.resolve(results.slice(0, 24));
        }

        // En desarrollo, usar API
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
