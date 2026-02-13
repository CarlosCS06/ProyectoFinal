import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { igdbService, formatIGDBImage, getYoutubeUrl } from '../services/igdbService';
import { reviewsService } from '../services/reviewsService';
import {
    ArrowLeft, Star, Calendar, Bookmark, BookmarkCheck,
    Globe, Users, Trophy, PlayCircle, PlusCircle, User, MessageSquare, Trash2
} from 'lucide-react';
import { useAppContext } from '../context/AppProvider';
import GameCard from '../components/games/GameCard';
import ReviewForm from '../components/games/ReviewForm';
import '../styles/GameDetail.css';
import '../styles/ReviewForm.css';

const GameDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [game, setGame] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [activeTab, setActiveTab] = useState('overview'); // Required event logic

    const { user, addToBacklog, backlog, removeFromBacklog, showNotification } = useAppContext();
    const isInBacklog = backlog.some(g => g.id === parseInt(id));

    const fetchDetails = async () => {
        try {
            const [gData, rData] = await Promise.all([
                igdbService.getGameDetails(id),
                reviewsService.getReviews(id)
            ]);
            if (gData && gData.length > 0) setGame(gData[0]);
            setReviews(rData);
        } catch (error) {
            console.error("Error loading data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            await reviewsService.deleteReview(reviewId);
            showNotification('Reseña eliminada correctamente', 'success');
            fetchDetails();
        } catch (error) {
            console.error("Error deleting review", error);
            showNotification('Error al eliminar la reseña', 'error');
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchDetails();
    }, [id]);

    if (loading) return <div className="detail-loading"><div className="loader"></div></div>;
    if (!game) return <div className="glass empty-state container">Juego no encontrado</div>;

    return (
        <motion.div className="game-detail-v2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <button className="back-link glass" onClick={() => navigate(-1)}>
                <ArrowLeft size={18} />
                <span>Volver al Universo Gamer</span>
            </button>

            {/* Hero Section */}
            <div className="cinematic-hero">
                <div className="hero-bg-container">
                    <img
                        src={formatIGDBImage(game.screenshots?.[0]?.url || game.cover?.url, 't_screenshot_huge')}
                        alt="bg"
                        className="hero-bg-img"
                    />
                    <div className="hero-gradient"></div>
                </div>

                <div className="hero-data container">
                    <motion.div className="hero-info-header" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                        <div className="hero-genres">
                            {game.genres?.map(g => <span key={g.id} className="genre-pill">{g.name}</span>)}
                        </div>
                        <h1 className="hero-game-title">{game.name}</h1>

                        <div className="hero-stats">
                            <div className="stat-item">
                                <Star size={20} fill="#fbbf24" color="#fbbf24" />
                                <span className="stat-value">{(game.total_rating / 20).toFixed(1)}</span>
                                <span className="stat-label">Valoración</span>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <Calendar size={20} />
                                <span className="stat-value">{game.first_release_date ? new Date(game.first_release_date * 1000).getFullYear() : 'TBA'}</span>
                                <span className="stat-label">Lanzamiento</span>
                            </div>
                        </div>

                        <div className="hero-actions-row">
                            <button
                                className={`main-action-btn ${isInBacklog ? 'active' : ''}`}
                                onClick={() => {
                                    if (!user) {
                                        showNotification('Debes registrarte para guardar o hacer reseñas en la web', 'info');
                                        navigate('/login');
                                        return;
                                    }
                                    isInBacklog ? removeFromBacklog(game.id) : addToBacklog(game);
                                }}
                            >
                                {isInBacklog ? <BookmarkCheck size={22} /> : <Bookmark size={22} />}
                                <span>{isInBacklog ? 'En mi Colección' : 'Añadir a mi Colección'}</span>
                            </button>

                            <button className="btn-review-hero" onClick={() => {
                                if (!user) {
                                    showNotification('Debes registrarte para guardar o hacer reseñas en la web', 'info');
                                    navigate('/login');
                                    return;
                                }
                                setShowReviewModal(true);
                            }}>
                                <PlusCircle size={22} />
                                <span>Escribir Reseña</span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <div className="detail-grid container">
                <div className="detail-main">
                    {/* Tabs - Academic Event Req */}
                    <div className="detail-tabs">
                        <button
                            className={activeTab === 'overview' ? 'active' : ''}
                            onClick={() => setActiveTab('overview')}
                            onMouseEnter={() => { }} // Evento onMouseEnter
                        >
                            General
                        </button>
                        <button
                            className={activeTab === 'reviews' ? 'active' : ''}
                            onClick={() => setActiveTab('reviews')}
                        >
                            Reseñas ({reviews.length})
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' ? (
                            <motion.div key="overview" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                {game.videos?.[0] && (
                                    <section className="detail-section glass trailer-section">
                                        <h2><PlayCircle size={20} /> Tráiler Oficial</h2>
                                        <div className="trailer-aspect">
                                            <iframe src={getYoutubeUrl(game.videos[0].video_id)} frameBorder="0" allowFullScreen></iframe>
                                        </div>
                                    </section>
                                )}

                                <section className="detail-section glass">
                                    <h2><Globe size={20} /> Resumen</h2>
                                    <p className="description-text">
                                        {game.summary || game.storyline || 'Sin descripción disponible.'}
                                    </p>
                                </section>
                            </motion.div>
                        ) : (
                            <motion.div key="reviews" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <section className="detail-section glass">
                                    <div className="section-header-row">
                                        <h2><User size={20} /> Reseñas de la Comunidad</h2>
                                        <button className="btn-review-action" onClick={() => {
                                            if (!user) {
                                                showNotification('Debes registrarte para guardar o hacer reseñas en la web', 'info');
                                                navigate('/login');
                                                return;
                                            }
                                            setShowReviewModal(true);
                                        }}>
                                            <PlusCircle size={18} />
                                            <span>Escribir mi Reseña</span>
                                        </button>
                                    </div>

                                    <div className="reviews-list">
                                        {reviews.length > 0 ? reviews.map(r => (
                                            <div key={r.id} className="review-item glass">
                                                <div className="review-meta">
                                                    <span className="review-user">{r.user}</span>
                                                    <div className="review-meta-actions">
                                                        <div className="review-stars">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} size={14} fill={i < r.rating ? "#fbbf24" : "transparent"} color="#fbbf24" />
                                                            ))}
                                                        </div>
                                                        <button
                                                            className="delete-review-btn"
                                                            onClick={() => handleDeleteReview(r.id)}
                                                            title="Borrar reseña"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="review-comment">{r.comment}</p>
                                            </div>
                                        )) : (
                                            <p className="empty-text">Aún no hay reseñas. ¡Sé el primero en escribir una!</p>
                                        )}
                                    </div>
                                </section>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {game.similar_games && (
                        <section className="detail-section">
                            <h2>Aventuras Similares</h2>
                            <div className="similar-games-grid">
                                {game.similar_games.slice(0, 4).map((sg, i) => (
                                    <GameCard key={sg.id} game={sg} index={i} />
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="detail-sidebar">
                    <div className="glass sidebar-card">
                        <h3><Trophy size={18} /> Empresas</h3>
                        <div className="company-list">
                            {game.involved_companies?.map(c => (
                                <div key={c.id} className="company-item">
                                    <span className="company-name">{c.company.name}</span>
                                    <span className="company-role">{c.developer ? 'Desarrollador' : 'Editor'}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showReviewModal && (
                    <ReviewForm
                        gameId={id}
                        gameName={game.name}
                        onClose={() => setShowReviewModal(false)}
                        onReviewAdded={fetchDetails}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default GameDetail;
