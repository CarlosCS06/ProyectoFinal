const URL_DB_LOCAL = 'http://localhost:3001';

export const reviewsService = {
    obtenerReseñas: async (idJuego) => {
        const respuesta = await fetch(`${URL_DB_LOCAL}/reviews?gameId=${idJuego}`);
        if (!respuesta.ok) throw new Error('Error al obtener reseñas');
        return await respuesta.json();
    },

    agregarReseña: async (reseña) => {
        const respuesta = await fetch(`${URL_DB_LOCAL}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reseña),
        });
        if (!respuesta.ok) throw new Error('Error al añadir reseña');
        return await respuesta.json();
    },

    borrarReseña: async (idReseña) => {
        const respuesta = await fetch(`${URL_DB_LOCAL}/reviews/${idReseña}`, {
            method: 'DELETE',
        });
        if (!respuesta.ok) throw new Error('Error al borrar reseña');
        return true;
    },

    // Aliases para compatibilidad
    getReviews: (id) => reviewsService.obtenerReseñas(id),
    addReview: (r) => reviewsService.agregarReseña(r),
    deleteReview: (id) => reviewsService.borrarReseña(id)
};
