const BASE_URL = 'http://localhost:3001';
const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost';

export const reviewsService = {
    getReviews: async (gameId) => {
        if (isProduction) {
            // En Vercel, usar localStorage
            const allReviews = JSON.parse(localStorage.getItem('infogamer_reviews') || '[]');
            return allReviews.filter(r => r.gameId === gameId);
        }
        
        const response = await fetch(`${BASE_URL}/reviews?gameId=${gameId}`);
        if (!response.ok) throw new Error('Error fetching reviews');
        return await response.json();
    },

    addReview: async (review) => {
        if (isProduction) {
            // En Vercel, guardar en localStorage
            const allReviews = JSON.parse(localStorage.getItem('infogamer_reviews') || '[]');
            const newReview = { id: Date.now(), ...review, date: new Date().toISOString() };
            allReviews.push(newReview);
            localStorage.setItem('infogamer_reviews', JSON.stringify(allReviews));
            return newReview;
        }

        const response = await fetch(`${BASE_URL}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(review),
        });
        if (!response.ok) throw new Error('Error adding review');
        return await response.json();
    },

    deleteReview: async (reviewId) => {
        if (isProduction) {
            // En Vercel, eliminar de localStorage
            let allReviews = JSON.parse(localStorage.getItem('infogamer_reviews') || '[]');
            allReviews = allReviews.filter(r => r.id !== reviewId);
            localStorage.setItem('infogamer_reviews', JSON.stringify(allReviews));
            return true;
        }

        const response = await fetch(`${BASE_URL}/reviews/${reviewId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Error deleting review');
        return true;
    },
};
