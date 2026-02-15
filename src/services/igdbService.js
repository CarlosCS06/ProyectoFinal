const LOCAL_BASE_URL = 'http://localhost:3001';

// En Vercel, usamos las funciones serverless; en desarrollo con proxy
const API_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
    ? '/api/igdb' 
    : '/igdb-api';

// Mock data para Vercel como fallback
const mockGames = [
  { id: 1, name: 'Elden Ring', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co2n7k.jpg' }, total_rating: 96, first_release_date: 1646092800, platforms: [{ name: 'PC' }], genres: [{ name: 'RPG' }] },
  { id: 2, name: 'Baldur\'s Gate 3', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co5mof.jpg' }, total_rating: 96, first_release_date: 1691539200, platforms: [{ name: 'PC' }], genres: [{ name: 'RPG' }] },
  { id: 3, name: 'Starfield', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co68qn.jpg' }, total_rating: 83, first_release_date: 1694995200, platforms: [{ name: 'Xbox Series X|S' }], genres: [{ name: 'RPG' }] },
  { id: 4, name: 'Final Fantasy XVI', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co5sfb.jpg' }, total_rating: 87, first_release_date: 1687305600, platforms: [{ name: 'PlayStation 5' }], genres: [{ name: 'RPG' }] },
  { id: 5, name: 'Hogwarts Legacy', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co5vqs.jpg' }, total_rating: 81, first_release_date: 1675382400, platforms: [{ name: 'PC' }, { name: 'PlayStation 5' }], genres: [{ name: 'RPG' }] },
  { id: 6, name: 'Cyberpunk 2077', cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co2z2a.jpg' }, total_rating: 77, first_release_date: 1607644800, platforms: [{ name: 'PC' }], genres: [{ name: 'RPG' }] },
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
