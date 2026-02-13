import { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { storage } from '../services/storage';
import { authService } from '../services/authService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [backlog, setBacklog] = useLocalStorage(storage.KEYS.BACKLOG, []);
    const [user, setUser] = useLocalStorage('infogamer_user', null);

    // Notification state
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const addToBacklog = (game) => {
        if (!backlog.find(g => g.id === game.id)) {
            setBacklog(prev => [...prev, game]);
            showNotification(`"${game.name}" añadido a tu colección`, 'success');
        }
    };

    const removeFromBacklog = (gameId) => {
        const game = backlog.find(g => g.id === gameId);
        setBacklog(prev => prev.filter(g => g.id !== gameId));
        if (game) {
            showNotification(`"${game.name}" eliminado de tu colección`, 'info');
        }
    };

    const loginUser = (userData) => {
        setUser(userData);
        showNotification(`¡Bienvenido de nuevo, ${userData.username}!`, 'success');
    };

    const logoutUser = () => {
        setUser(null);
        showNotification('Has cerrado sesión correctamente', 'info');
    };

    const updateUser = async (updatedData) => {
        if (!user?.id) return;
        try {
            const updatedUser = await authService.updateUser(user.id, updatedData);
            setUser(updatedUser);
            return updatedUser;
        } catch (error) {
            showNotification('Error al sincronizar con el servidor', 'error');
            console.error(error);
        }
    };

    return (
        <AppContext.Provider value={{
            backlog,
            addToBacklog,
            removeFromBacklog,
            notification,
            showNotification,
            user,
            loginUser,
            logoutUser,
            updateUser
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext must be used within an AppProvider');
    return context;
};
