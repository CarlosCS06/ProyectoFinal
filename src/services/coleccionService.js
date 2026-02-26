import { igdbService } from './igdbService';

const URL_DB_LOCAL = 'http://localhost:3001';

const fetchLocal = async (endpoint, opciones = {}) => {
    try {
        const url = `${URL_DB_LOCAL}${endpoint}`;
        const respuesta = await fetch(url, opciones);
        if (!respuesta.ok) throw new Error(`Error al obtener ${url}`);
        return await respuesta.json();
    } catch (error) {
        console.error("Error en el Servicio de Colección:", error);
        return null;
    }
};

export const coleccionService = {
    // Obtener detalles completos de los juegos para la colección de un usuario
    obtenerColeccion: async (idUsuario) => {
        try {
            // 1. Obtener entradas de juegos guardados
            const juegosGuardados = await fetchLocal(`/savedGames?userId=${idUsuario}`);
            if (!juegosGuardados || juegosGuardados.length === 0) return [];

            // 2. Extraer IDs de juegos
            const idsJuegos = juegosGuardados.map(jg => jg.gameId);

            // 3. Obtener detalles de los juegos desde IGDB (proxy local)
            const detallesJuegos = await igdbService.obtenerJuegosPorId(idsJuegos);

            // 4. Fusionar detalles con la info de guardado (estado, fecha)
            return juegosGuardados.map(jg => {
                const detalles = detallesJuegos.find(j => j.id === jg.gameId);
                return detalles ? { ...detalles, idJuegoGuardado: jg.id, añadidoEn: jg.addedAt, estado: jg.status } : null;
            }).filter(j => j !== null);

        } catch (error) {
            console.error("Error al obtener la colección:", error);
            return [];
        }
    },

    agregarAColeccion: async (idUsuario, juego) => {
        // Verificar si ya existe
        const existente = await fetchLocal(`/savedGames?userId=${idUsuario}&gameId=${juego.id}`);
        if (existente && existente.length > 0) return null;

        const nuevaEntrada = {
            userId: idUsuario,
            gameId: juego.id,
            status: 'backlog',
            addedAt: new Date().toISOString(),
            isFavorite: false
        };

        return await fetchLocal('/savedGames', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaEntrada)
        });
    },

    eliminarDeColeccion: async (idUsuario, idJuego) => {
        // Encontrar la ID de la entrada primero
        const entradas = await fetchLocal(`/savedGames?userId=${idUsuario}&gameId=${idJuego}`);
        if (!entradas || entradas.length === 0) return false;

        const idEntrada = entradas[0].id;

        await fetchLocal(`/savedGames/${idEntrada}`, {
            method: 'DELETE'
        });
        return true;
    },

    // Aliases para compatibilidad
    getBacklog: (id) => coleccionService.obtenerColeccion(id),
    addToBacklog: (id, j) => coleccionService.agregarAColeccion(id, j),
    removeFromBacklog: (id, idJ) => coleccionService.eliminarDeColeccion(id, idJ)
};

export const backlogService = coleccionService;
