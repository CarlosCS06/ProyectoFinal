import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppProvider';
import { reviewsService } from '../services/reviewsService';
import { formatIGDBImage } from '../services/igdbService';
import { User, Gamepad2, MessageSquare, Trash2, Calendar, Star, Trophy, Bookmark } from 'lucide-react';
import '../styles/Profile.css';

const Profile = () => {
    const { user, backlog, showNotification, logoutUser, updateUser } = useAppContext();
    const [userReviews, setUserReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditingPhoto, setIsEditingPhoto] = useState(false);
    const [newPhotoUrl, setNewPhotoUrl] = useState(user?.profilePic || '');
    const navigate = useNavigate();

    const handleUpdatePhoto = async () => {
        await updateUser({ profilePic: newPhotoUrl });
        setIsEditingPhoto(false);
        showNotification('Foto de perfil actualizada', 'success');
    };

    const fetchUserReviews = async () => {
        if (!user) return;
        try {
            const response = await fetch('http://localhost:3001/reviews');
            const allReviews = await response.json();
            // Filtramos por el nombre del usuario logueado
            const filtered = allReviews.filter(r => r.user === user.username);
            setUserReviews(filtered);
        } catch (error) {
            console.error("Error fetching user reviews", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchUserReviews();
    }, [user, navigate]);

    const handleDelete = async (reviewId) => {
        try {
            await reviewsService.deleteReview(reviewId);
            showNotification('Reseña eliminada', 'success');
            fetchUserReviews();
        } catch (error) {
            showNotification('Error al eliminar', 'error');
        }
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    const stats = [
        { label: 'Colección', value: backlog.length, icon: Gamepad2, color: 'var(--accent-primary)' },
        { label: 'Reseñas', value: userReviews.length, icon: MessageSquare, color: 'var(--accent-secondary)' },
        { label: 'Logros', value: 12, icon: Trophy, color: '#fbbf24' },
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
                            <div className="avatar glass overflow-hidden" onClick={() => setIsEditingPhoto(!isEditingPhoto)}>
                                {user?.profilePic ? (
                                    <img src={user.profilePic} alt="Avatar" className="w-full h-full object-cover" />
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
                            {isEditingPhoto ? (
                                <motion.div className="edit-photo-form" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                                    <input
                                        type="text"
                                        className="glass-input"
                                        placeholder="URL de la imagen..."
                                        value={newPhotoUrl}
                                        onChange={(e) => setNewPhotoUrl(e.target.value)}
                                    />
                                    <div className="edit-actions">
                                        <button className="btn-save glass" onClick={handleUpdatePhoto}>Guardar</button>
                                        <button className="btn-cancel" onClick={() => setIsEditingPhoto(false)}>Cancelar</button>
                                    </div>
                                </motion.div>
                            ) : (
                                <>
                                    <h2 className="text-gradient">Perfil</h2>
                                    <h1 className="brand-text">{user?.username}</h1>
                                    <p>{user?.email} • Miembro desde {user?.joinedDate ? new Date(user.joinedDate).getFullYear() : '2024'}</p>
                                </>
                            )}
                        </div>
                    </div>
                    <button className="btn-logout glass" onClick={handleLogout}>
                        Cerrar Sesión
                    </button>
                </motion.div>

                <div className="stats-grid">
                    {stats.map((stat, index) => (
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
                        {backlog.length > 0 ? (
                            <div className="profile-games-grid">
                                {backlog.slice(0, 4).map((game, i) => (
                                    <motion.div
                                        key={game.id}
                                        className="mini-game-card glass"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => navigate(`/game/${game.id}`)}
                                    >
                                        <img src={formatIGDBImage(game.cover?.url, 't_cover_big')} alt={game.name} />
                                        <div className="mini-card-overlay">
                                            <span>{game.name}</span>
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
                            {loading ? (
                                <div className="loader-container"><div className="loader"></div></div>
                            ) : userReviews.length > 0 ? (
                                userReviews.map((review) => (
                                    <motion.div
                                        key={review.id}
                                        className="user-review-card glass"
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                    >
                                        <div className="review-card-header">
                                            <div className="review-game-info">
                                                <Star size={16} color="#fbbf24" fill="#fbbf24" />
                                                <span className="rating-tag">{review.rating}/5</span>
                                                <span className="review-date">
                                                    <Calendar size={14} />
                                                    {review.date ? new Date(review.date).toLocaleDateString() : 'Reciente'}
                                                </span>
                                            </div>
                                            <button
                                                className="delete-btn-minimal"
                                                onClick={() => handleDelete(review.id)}
                                                title="Borrar reseña"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                        <p className="review-text">{review.comment}</p>
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
        </div>
    );
};

export default Profile;
