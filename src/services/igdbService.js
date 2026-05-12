
// Importar datos locales
import { gamesData } from '../data/gamesData.js';

// Funciones auxiliares
export const formatearImagenIGDB = (url, tamano = 't_cover_big') => {
    // Si no hay URL o es inválida, retornar un placeholder fiable
    if (!url || typeof url !== 'string') return `https://placehold.co/400x600?text=Sin+Portada`;

    // Si es una URL completa (como en nuestra bd local), usarla ajustando el tamaño
    if (url.startsWith('http')) {
        // Intentar reemplazar el tamaño si sigue el patrón de IGDB
        if (url.includes('/t_')) {
            return url.replace(/\/t_[^/]+\//, `/${tamano}/`);
        }
        return url;
    }

    // Fallback para IDs simples
    return `https://images.igdb.com/igdb/image/upload/${tamano}/${url}.jpg`;
};

// Alias para compatibilidad
export const formatIGDBImage = formatearImagenIGDB;

export const obtenerUrlYoutube = (idVideo) => {
    return `https://www.youtube.com/embed/${idVideo}`;
};

// Alias para compatibilidad
export const getYoutubeUrl = obtenerUrlYoutube;

export const igdbService = {
    // --- MÉTODOS DE DATOS LOCALES ---

    // Obtener juegos paginados
    obtenerTodosLosJuegos: async (pagina = 1, porPagina = 50) => {
        const inicio = (pagina - 1) * porPagina;
        const fin = inicio + porPagina;
        return gamesData.slice(inicio, fin).map(g => ({ ...g, id: String(g.id) }));
    },

    // Obtener todos los juegos sin paginación
    _obtenerTodosLosJuegosRaw: async () => {
        return gamesData.map(g => ({ ...g, id: String(g.id) }));
    },

    obtenerJuegosTendencia: async (limite = 20) => {
        const datos = [...gamesData].sort((a, b) => (b.valoracion || 0) - (a.valoracion || 0));
        return datos.slice(0, limite).map(g => ({ ...g, id: String(g.id) }));
    },

    obtenerProximosLanzamientos: async (limite = 50) => {
        const ahoraUnix = Math.floor(Date.now() / 1000);
        const proximos = gamesData
            .filter(j => j.fecha_lanzamiento && j.fecha_lanzamiento > ahoraUnix)
            .sort((a, b) => a.fecha_lanzamiento - b.fecha_lanzamiento)
            .slice(0, limite)
            .map(g => ({ ...g, id: String(g.id) }));
        return proximos;
    },

    obtenerProximos: async (limite = 50) => {
        return await igdbService.obtenerProximosLanzamientos(limite);
    },

    buscarJuegos: async (cadenaBusqueda, filtros = {}) => {
        let datos = [...gamesData];

        // 1. Filtrar por búsqueda (Nombre)
        if (cadenaBusqueda) {
            const busquedaMinusculas = cadenaBusqueda.toLowerCase();
            datos = datos.filter(juego =>
                juego.nombre.toLowerCase().includes(busquedaMinusculas)
            );
        }

        // 2. Aplicar otros filtros (Género)
        if (filtros.genre) {
            datos = datos.filter(juego =>
                juego.generos && juego.generos.some(g => g === filtros.genre || g.nombre === filtros.genre)
            );
        }

        // 2. Aplicar otros filtros (Plataforma)
        if (filtros.platform) {
            datos = datos.filter(juego =>
                juego.plataformas && juego.plataformas.some(p => p === filtros.platform || p.nombre === filtros.platform)
            );
        }

        // 3. Ordenamiento
        if (filtros.sort === 'newest') {
            datos.sort((a, b) => (b.fecha_lanzamiento || 0) - (a.fecha_lanzamiento || 0));
        } else if (filtros.sort === 'oldest') {
            datos.sort((a, b) => (a.fecha_lanzamiento || 0) - (b.fecha_lanzamiento || 0));
        } else {
            // por defecto rating - desc
            datos.sort((a, b) => (b.valoracion || 0) - (a.valoracion || 0));
        }

        return datos.map(g => ({ ...g, id: String(g.id) }));
    },

    descubrirJuegos: async (filtros = {}) => {
        return igdbService.buscarJuegos('', filtros);
    },

    obtenerDetallesJuego: async (id) => {
        const juego = gamesData.find(g => String(g.id) === String(id));
        return juego ? { ...juego, id: String(juego.id) } : null;
    },

    obtenerMejoresRankings: async (limite = 50) => {
        const datos = [...gamesData]
            .filter(g => g.valoracion >= 1)
            .sort((a, b) => (b.valoracion || 0) - (a.valoracion || 0))
            .slice(0, limite);
        return datos.map(g => ({ ...g, id: String(g.id) }));
    },

    obtenerMejoresValorados: async (limite = 50) => {
        return await igdbService.obtenerMejoresRankings(limite);
    },

    obtenerJuegosPorId: async (ids) => {
        if (!ids || ids.length === 0) return [];
        return gamesData
            .filter(g => ids.includes(String(g.id)) || ids.includes(g.id))
            .map(g => ({ ...g, id: String(g.id) }));
    },

    // --- REVIEWS & USERS ---
    obtenerReseñas: async (idJuego) => {
        // Por ahora retornar array vacío (sin backend de reviews)
        return [];
    },

    agregarReseña: async (reseña) => {
        // Sin backend de reviews en Vercel
        return null;
    },

    // --- GENRES & PLATFORMS ---
    obtenerGeneros: async () => {
        const generos = new Set();
        gamesData.forEach(g => {
            if (g.generos && Array.isArray(g.generos)) {
                g.generos.forEach(genero => generos.add(genero));
            }
        });
        return Array.from(generos).map((g, i) => ({ id: i, nombre: g }));
    },

    obtenerPlataformas: async () => {
        const plataformas = new Set();
        gamesData.forEach(g => {
            if (g.plataformas && Array.isArray(g.plataformas)) {
                g.plataformas.forEach(plat => plataformas.add(plat));
            }
        });
        return Array.from(plataformas).map((p, i) => ({ id: i, nombre: p }));
    },

    // Aliases para compatibilidad
    getAllGames: (p, pp) => igdbService.obtenerTodosLosJuegos(p, pp),
    getTrendingGames: (l) => igdbService.obtenerJuegosTendencia(l),
    getUpcomingReleases: (l) => igdbService.obtenerProximosLanzamientos(l),
    searchGames: (q, f) => igdbService.buscarJuegos(q, f),
    discoverGames: (f) => igdbService.descubrirJuegos(f),
    getGameDetails: (id) => igdbService.obtenerDetallesJuego(id),
    getTopRankings: (l) => igdbService.obtenerMejoresRankings(l),
    getGamesByIds: (ids) => igdbService.obtenerJuegosPorId(ids),
    getReviews: (id) => igdbService.obtenerReseñas(id),
    addReview: (r) => igdbService.agregarReseña(r),
    getGenres: () => igdbService.obtenerGeneros(),
    getPlatforms: () => igdbService.obtenerPlataformas()
};
