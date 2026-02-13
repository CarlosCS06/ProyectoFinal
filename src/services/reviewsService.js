const BASE_URL = 'http://localhost:3001';

export const reviewsService = {
    getReviews: async (gameId) => {
        const response = await fetch(`${BASE_URL}/reviews?gameId=${gameId}`);
        if (!response.ok) throw new Error('Error fetching reviews');
        return await response.json();
    },

    addReview: async (review) => {
        const response = await fetch(`${BASE_URL}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(review),
        });
        if (!response.ok) throw new Error('Error adding review');
        return await response.json();
    },

    deleteReview: async (reviewId) => {
        const response = await fetch(`${BASE_URL}/reviews/${reviewId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Error deleting review');
        return true;
    },
};
