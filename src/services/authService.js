const BASE_URL = 'http://localhost:3001';

export const authService = {
    login: async (email, password) => {
        const response = await fetch(`${BASE_URL}/users?email=${email}&password=${password}`);
        const users = await response.json();
        if (users.length === 0) throw new Error('Credenciales inválidas');
        return users[0];
    },

    register: async (userData) => {
        // Verificar si el email ya existe
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
        const response = await fetch(`${BASE_URL}/users/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        });
        if (!response.ok) throw new Error('Error al actualizar usuario');
        return await response.json();
    }
};
