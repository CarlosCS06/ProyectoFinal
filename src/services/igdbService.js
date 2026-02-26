
// URL de la base de datos local
const URL_DB_LOCAL = 'http://localhost:3001';

// Helper para obtener datos del json-server local
const fetchLocal = async (endpoint, params = '') => {
    try {
        const url = `${URL_DB_LOCAL}${endpoint}${params ? '?' + params : ''}`;
        const respuesta = await fetch(url);
        if (!respuesta.ok) {
            throw new Error(`Error al obtener desde ${url}`);
        }
        let datos = await respuesta.json();

        // Manejar el objeto de paginación de json-server v1 (se extrae la propiedad data)
        if (!Array.isArray(datos) && datos.data && Array.isArray(datos.data)) {
            datos = datos.data;
        }

        // IDs transformados en números para mantener consistencia
        if (Array.isArray(datos)) {
            return datos.map(item => ({ ...item, id: Number(item.id) }));
        } else if (datos && datos.id && !isNaN(datos.id)) {
            return { ...datos, id: Number(datos.id) };
        }

        return datos;
    } catch (error) {
        console.error('Error al obtener datos locales:', error);
        return [];
    }
};

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

    // Obtener juegos paginados desde json-server
    obtenerTodosLosJuegos: async (pagina = 1, porPagina = 50) => {
        return await fetchLocal('/games', `_page=${pagina}&_per_page=${porPagina}`);
    },

    // Obtener todos los juegos sin paginación (para filtrado/búsqueda)
    _obtenerTodosLosJuegosRaw: async () => {
        return await fetchLocal('/games');
    },

    obtenerJuegosTendencia: async (limite = 20) => {
        const datos = await fetchLocal('/games', `_sort=-valoracion&valoracion_gte=1&_per_page=${limite}&_page=1`);
        return datos.sort((a, b) => (b.valoracion || 0) - (a.valoracion || 0));
    },

    obtenerProximosLanzamientos: async (limite = 50) => {
        const datos = await fetchLocal('/games');
        const ahoraUnix = Math.floor(Date.now() / 1000);
        const proximos = datos.filter(j => j.fecha_lanzamiento && j.fecha_lanzamiento > ahoraUnix);
        proximos.sort((a, b) => a.fecha_lanzamiento - b.fecha_lanzamiento);
        return limite ? proximos.slice(0, limite) : proximos;
    },

    obtenerProximos: async (limite = 50) => {
        return await igdbService.obtenerProximosLanzamientos(limite);
    },

    buscarJuegos: async (cadenaBusqueda, filtros = {}) => {
        let datos = await igdbService._obtenerTodosLosJuegosRaw();

        // 1. Filtrar por búsqueda (Nombre)
        if (cadenaBusqueda) {
            const busquedaMinusculas = cadenaBusqueda.toLowerCase();
            datos = datos.filter(juego =>
                juego.nombre.toLowerCase().includes(busquedaMinusculas)
            );
        }

        // 2. Aplicar otros filtros (Género, Plataforma)
        if (filtros.genre) {
            datos = datos.filter(juego =>
                juego.generos && juego.generos.some(g => g.id === parseInt(filtros.genre))
            );
        }

        if (filtros.platform) {
            datos = datos.filter(juego =>
                juego.plataformas && juego.plataformas.some(p => p.id === parseInt(filtros.platform))
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

        return datos;
    },

    descubrirJuegos: async (filtros = {}) => {
        return igdbService.buscarJuegos('', filtros);
    },

    obtenerDetallesJuego: async (id) => {
        const datos = await fetchLocal(`/games/${id}`);
        if (datos && datos.id) {
            return datos;
        }
        return null;
    },

    obtenerMejoresRankings: async (limite = 50) => {
        const datos = await fetchLocal('/games', `_sort=-valoracion&valoracion_gte=1&_per_page=${limite}&_page=1`);
        return datos.sort((a, b) => (b.valoracion || 0) - (a.valoracion || 0));
    },

    obtenerMejoresValorados: async (limite = 50) => {
        return await igdbService.obtenerMejoresRankings(limite);
    },

    obtenerJuegosPorId: async (ids) => {
        if (!ids || ids.length === 0) return [];
        const consulta = ids.map(id => `id=${id}`).join('&');
        return await fetchLocal('/games', consulta);
    },

    // --- REVIEWS & USERS ---
    obtenerReseñas: async (idJuego) => {
        return await fetchLocal('/reviews', `gameId=${idJuego}`);
    },

    agregarReseña: async (reseña) => {
        try {
            const respuesta = await fetch(`${URL_DB_LOCAL}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reseña)
            });
            return await respuesta.json();
        } catch (e) { return null; }
    },

    // --- GENRES & PLATFORMS ---
    obtenerGeneros: async () => {
        return await fetchLocal('/generos');
    },

    obtenerPlataformas: async () => {
        return await fetchLocal('/plataformas');
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
