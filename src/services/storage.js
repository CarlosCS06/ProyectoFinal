const KEYS = {
    BACKLOG: 'vg_backlog',
    REVIEWS: 'vg_reviews',
    FAVORITES: 'vg_favorites',
};

export const storage = {
    get: (key) => {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    },

    save: (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
    },

    addToCollection: (key, item) => {
        const collection = storage.get(key);
        if (!collection.some(i => i.id === item.id)) {
            const updated = [...collection, item];
            storage.save(key, updated);
            return updated;
        }
        return collection;
    },

    removeFromCollection: (key, itemId) => {
        const collection = storage.get(key);
        const updated = collection.filter(i => i.id !== itemId);
        storage.save(key, updated);
        return updated;
    },

    KEYS,
};
