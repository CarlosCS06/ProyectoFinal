import { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { authService } from '../services/authService';
import { coleccionService } from '../services/coleccionService';

const ContextoApp = createContext();

export const ProveedorApp = ({ children }) => {

    const [coleccion, setColeccion] = useState([]);
    const [cargandoColeccion, setCargandoColeccion] = useState(false);

    const [usuario, setUsuario] = useLocalStorage('infogamer_user', null);

    useEffect(() => {
        const cargarColeccion = async () => {
            setCargandoColeccion(true);
            if (usuario) {
                try {
                    const coleccionUsuario = await coleccionService.obtenerColeccion(usuario.id);
                    setColeccion(coleccionUsuario || []);
                } catch (error) {
                    console.error("Error al cargar la colección del usuario", error);
                }
            } else {
                const local = localStorage.getItem('guest_backlog');
                setColeccion(local ? JSON.parse(local) : []);
            }
            setCargandoColeccion(false);
        };
        cargarColeccion();
    }, [usuario]);

    const [notificacion, setNotificacion] = useState(null);

    const mostrarNotificacion = (mensaje, tipo = 'success') => {
        setNotificacion({ mensaje, tipo });
        setTimeout(() => setNotificacion(null), 4000);
    };

    const agregarAColeccion = async (juego) => {
        if (!coleccion.find(j => j.id === juego.id)) {
            const nuevaColeccion = [...coleccion, juego];
            setColeccion(nuevaColeccion);
            mostrarNotificacion(`"${juego.nombre}" añadido a tu colección`, 'success');

            if (usuario) {
                await coleccionService.agregarAColeccion(usuario.id, juego);
            } else {
                localStorage.setItem('guest_backlog', JSON.stringify(nuevaColeccion));
            }
        }
    };

    const eliminarDeColeccion = async (idJuego) => {
        const juego = coleccion.find(j => j.id === idJuego);
        if (juego) {
            const nuevaColeccion = coleccion.filter(j => j.id !== idJuego);
            setColeccion(nuevaColeccion);
            mostrarNotificacion(`"${juego.nombre}" eliminado de tu colección`, 'info');

            if (usuario) {
                await coleccionService.eliminarDeColeccion(usuario.id, idJuego);
            } else {
                localStorage.setItem('guest_backlog', JSON.stringify(nuevaColeccion));
            }
        }
    };

    const iniciarSesion = (datosUsuario) => {
        setUsuario(datosUsuario);
        mostrarNotificacion(`¡Bienvenido de nuevo, ${datosUsuario.username}!`, 'success');
    };

    const cerrarSesion = () => {
        setUsuario(null);
        mostrarNotificacion('Has cerrado sesión correctamente', 'info');
    };

    const actualizarUsuario = async (datosActualizados) => {
        if (!usuario?.id) return;
        try {
            const usuarioActualizado = await authService.actualizarUsuario(usuario.id, datosActualizados);
            setUsuario(usuarioActualizado);
            return usuarioActualizado;
        } catch (error) {
            mostrarNotificacion('Error al sincronizar con el servidor', 'error');
            console.error(error);
        }
    };

    return (
        <ContextoApp.Provider value={{
            backlog: coleccion, // Mantenemos backlog como alias para evitar roturas inmediatas
            coleccion,
            addToBacklog: agregarAColeccion,
            agregarAColeccion,
            removeFromBacklog: eliminarDeColeccion,
            eliminarDeColeccion,
            notification: notificacion,
            notificacion,
            showNotification: mostrarNotificacion,
            mostrarNotificacion,
            user: usuario,
            usuario,
            loginUser: iniciarSesion,
            iniciarSesion,
            logoutUser: cerrarSesion,
            cerrarSesion,
            updateUser: actualizarUsuario,
            actualizarUsuario,
            cargandoColeccion
        }}>
            {children}
        </ContextoApp.Provider>
    );
};

export const useContextoApp = () => {
    const contexto = useContext(ContextoApp);
    if (!contexto) throw new Error('useContextoApp debe usarse dentro de un ProveedorApp');
    return contexto;
};

// Aliases para compatibilidad temporal mientras refactorizamos el resto de archivos
export const useAppContext = useContextoApp;
export const AppProvider = ProveedorApp;
