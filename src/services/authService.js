const BASE_URL = 'http://localhost:3001';
const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost';

// Mock users para Vercel (guest mode)
const mockUsers = {
    'test@test.com': {
        id: 1,
        email: 'test@test.com',
        password: 'test123',
        username: 'TestUser',
        avatar: 'https://via.placeholder.com/150',
        joinedDate: new Date().toISOString()
    }
};

export const authService = {
    login: async (email, password) => {
        if (isProduction) {
            // En Vercel, usar mock
            const user = mockUsers[email];
            if (!user || user.password !== password) {
                throw new Error('Credenciales inválidas');
            }
            return { id: user.id, email: user.email, username: user.username, avatar: user.avatar };
        }
        
        // En desarrollo, usar API local
        const response = await fetch(`${BASE_URL}/users?email=${email}&password=${password}`);
        const users = await response.json();
        if (users.length === 0) throw new Error('Credenciales inválidas');
        return users[0];
    },

    register: async (userData) => {
        if (isProduction) {
            // En Vercel, simular registro con localStorage
            const allUsers = JSON.parse(localStorage.getItem('infogamer_all_users') || '{}');
            if (allUsers[userData.email]) {
                throw new Error('El correo ya está registrado');
            }
            const newUser = {
                id: Date.now(),
                ...userData,
                joinedDate: new Date().toISOString()
            };
            allUsers[userData.email] = newUser;
            localStorage.setItem('infogamer_all_users', JSON.stringify(allUsers));
            return newUser;
        }

        // En desarrollo, usar API local
        const checkRes = await fetch(`${BASE_URL}/users?email=${userData.email}`);
        const existing = await checkRes.json();
        if (existing.length > 0) throw new Error('El correo ya está registrado');

        const response = await fetch(`${BASE_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...userData,
                joinedDate: new Date().toISOString()
            }),
        });
        if (!response.ok) throw new Error('Error al registrar usuario');
        return await response.json();
    },

    updateUser: async (userId, updatedData) => {
        if (isProduction) {
            // En Vercel, actualizar en localStorage
            return { id: userId, ...updatedData };
        }

        // En desarrollo, usar API local
        const response = await fetch(`${BASE_URL}/users/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        });
        if (!response.ok) throw new Error('Error al actualizar usuario');
        return await response.json();
    }
};
