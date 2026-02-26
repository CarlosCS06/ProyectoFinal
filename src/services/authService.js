const URL_BASE = 'http://localhost:3001';

export const authService = {
    iniciarSesion: async (email, password) => {
        // En desarrollo, usar API local
        const respuesta = await fetch(`${URL_BASE}/users?email=${email}&password=${password}`);
        const usuarios = await respuesta.json();
        if (usuarios.length === 0) throw new Error('Credenciales inválidas');
        return usuarios[0];
    },

    registrarse: async (datosUsuario) => {
        // En desarrollo, usar API local
        const respuestaVerificacion = await fetch(`${URL_BASE}/users?email=${datosUsuario.email}`);
        const existente = await respuestaVerificacion.json();
        if (existente.length > 0) throw new Error('El correo ya está registrado');

        const respuesta = await fetch(`${URL_BASE}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...datosUsuario,
                fechaRegistro: new Date().toISOString()
            }),
        });
        if (!respuesta.ok) throw new Error('Error al registrar usuario');
        return await respuesta.json();
    },

    actualizarUsuario: async (idUsuario, datosActualizados) => {
        const respuesta = await fetch(`${URL_BASE}/users/${idUsuario}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosActualizados),
        });
        if (!respuesta.ok) throw new Error('Error al actualizar usuario');
        return await respuesta.json();
    },

    // Aliases para compatibilidad
    login: (e, p) => authService.iniciarSesion(e, p),
    register: (d) => authService.registrarse(d),
    updateUser: (id, d) => authService.actualizarUsuario(id, d)
};
