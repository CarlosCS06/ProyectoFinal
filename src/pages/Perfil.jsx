import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useContextoApp } from '../context/AppProvider';
import { reviewsService } from '../services/reviewsService';
import { formatearImagenIGDB } from '../services/igdbService';
import { User, Gamepad2, MessageSquare, Trash2, Calendar, Star, Trophy, Bookmark } from 'lucide-react';
import '../styles/Profile.css';

const Perfil = () => {
    const { usuario, coleccion, mostrarNotificacion, cerrarSesion, actualizarUsuario } = useContextoApp();
    const [reseñasUsuario, setReseñasUsuario] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [editandoFoto, setEditandoFoto] = useState(false);
    const [nuevaUrlFoto, setNuevaUrlFoto] = useState(usuario?.profilePic || '');
    const navigate = useNavigate();

    const manejarActualizarFoto = async () => {
        await actualizarUsuario({ profilePic: nuevaUrlFoto });
        setEditandoFoto(false);
        mostrarNotificacion('Foto de perfil actualizada', 'success');
    };

    const obtenerReseñasUsuario = async () => {
        if (!usuario) return;
        try {
            const datosReseñas = await reviewsService.obtenerReseñas(); // Wait, obtenerReseñas needs gameId? 
            // In Profile.jsx, it was fetching all reviews and filtering. 
            // Let's check how it was originally.
            const response = await fetch('http://localhost:3001/reviews');
            const allReviews = await response.json();
            const filtered = allReviews.filter(r => r.user === usuario.username);
            setReseñasUsuario(filtered);
        } catch (error) {
            console.error("Error al obtener reseñas del usuario", error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        if (!usuario) {
            navigate('/login');
            return;
        }
        obtenerReseñasUsuario();
    }, [usuario, navigate]);

    const manejarBorrar = async (idReseña) => {
        try {
            await reviewsService.borrarReseña(idReseña);
            mostrarNotificacion('Reseña eliminada', 'success');
            obtenerReseñasUsuario();
        } catch (error) {
            mostrarNotificacion('Error al eliminar', 'error');
        }
    };

    const manejarCerrarSesion = () => {
        cerrarSesion();
        navigate('/');
    };

    const estadisticas = [
        { label: 'Colección', value: coleccion.length, icon: Gamepad2, color: 'var(--accent-primary)' },
        { label: 'Reseñas', value: reseñasUsuario.length, icon: MessageSquare, color: 'var(--accent-secondary)' },
    ];

    return (
        <div className="profile-page container">
            <header className="profile-header">
                <motion.div
                    className="profile-cover glass"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="profile-info-main">
                        <div className="avatar-wrapper">
                            <div className="avatar glass overflow-hidden" onClick={() => setEditandoFoto(!editandoFoto)}>
                                {usuario?.profilePic ? (
                                    <img src={usuario.profilePic} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={60} />
                                )}
                                <div className="avatar-edit-overlay">
                                    <User size={24} />
                                </div>
                            </div>
                            <div className="avatar-status"></div>
                        </div>
                        <div className="user-meta">
                            {editandoFoto ? (
                                <motion.div className="edit-photo-form" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                                    <input
                                        type="text"
                                        className="glass-input"
                                        placeholder="URL de la imagen..."
                                        value={nuevaUrlFoto}
                                        onChange={(e) => setNuevaUrlFoto(e.target.value)}
                                    />
                                    <div className="edit-actions">
                                        <button className="btn-save glass" onClick={manejarActualizarFoto}>Guardar</button>
                                        <button className="btn-cancel" onClick={() => setEditandoFoto(false)}>Cancelar</button>
                                    </div>
                                </motion.div>
                            ) : (
                                <>
                                    <h2 className="text-gradient">Perfil</h2>
                                    <h1 className="brand-text">{usuario?.username}</h1>
                                    <p>{usuario?.email} • Miembro desde {usuario?.joinedDate ? new Date(usuario.joinedDate).getFullYear() : '2024'}</p>
                                </>
                            )}
                        </div>
                    </div>
                    <button className="btn-logout glass" onClick={manejarCerrarSesion}>
                        Cerrar Sesión
                    </button>
                </motion.div>

                <div className="stats-grid">
                    {estadisticas.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            className="stat-card glass"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                                <stat.icon size={24} />
                            </div>
                            <div className="stat-data">
                                <span className="stat-number">{stat.value}</span>
                                <span className="stat-name">{stat.label}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </header>

            <main className="profile-content">
                <section className="profile-section">
                    <div className="section-header-row">
                        <h2><Bookmark size={20} /> Mi Colección</h2>
                        <Link to="/explore" className="btn-small glass">Explorar más</Link>
                    </div>
                    <div className="profile-backlog-preview">
                        {coleccion.length > 0 ? (
                            <div className="profile-games-grid">
                                {coleccion.slice(0, 4).map((juego, i) => (
                                    <motion.div
                                        key={juego.id}
                                        className="mini-game-card glass"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => navigate(`/game/${juego.id}`)}
                                    >
                                        <img src={formatearImagenIGDB(juego.portada?.url, 't_cover_big')} alt={juego.nombre} />
                                        <div className="mini-card-overlay">
                                            <span>{juego.nombre}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state-mini glass">
                                <p>No tienes juegos en tu colección.</p>
                                <Link to="/explore" className="text-gradient">Empieza a coleccionar</Link>
                            </div>
                        )}
                    </div>
                </section>


                <section className="profile-section">
                    <div className="section-header-row">
                        <h2><MessageSquare size={20} /> Mis Reseñas Recientes</h2>
                    </div>

                    <div className="user-reviews-list">
                        <AnimatePresence mode='popLayout'>
                            {cargando ? (
                                <div className="loader-container"><div className="loader"></div></div>
                            ) : reseñasUsuario.length > 0 ? (
                                reseñasUsuario.map((reseña) => (
                                    <motion.div
                                        key={reseña.id}
                                        className="user-review-card glass"
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                    >
                                        {/* Game name */}
                                        <div className="review-game-title-row">
                                            <Gamepad2 size={16} />
                                            <Link to={`/game/${reseña.gameId}`} className="review-game-link">
                                                {reseña.gameName || `Juego #${reseña.gameId}`}
                                            </Link>
                                        </div>
                                        <div className="review-card-header">
                                            <div className="review-game-info">
                                                <Star size={16} color="#fbbf24" fill="#fbbf24" />
                                                <span className="rating-tag">{reseña.rating}/5</span>
                                                <span className="review-date">
                                                    <Calendar size={14} />
                                                    {reseña.date ? new Date(reseña.date).toLocaleDateString() : 'Reciente'}
                                                </span>
                                            </div>
                                            <button
                                                className="delete-btn-minimal"
                                                onClick={() => manejarBorrar(reseña.id)}
                                                title="Borrar reseña"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                        <p className="review-text">{reseña.comment}</p>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="empty-state glass">
                                    <MessageSquare size={40} className="empty-icon" />
                                    <p>Aún no has escrito ninguna reseña.</p>
                                    <button onClick={() => navigate('/explore')} className="btn-primary-small">
                                        Escribir mi primera reseña
                                    </button>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </section>
            </main>
        </div >
    );
};

export default Perfil;
