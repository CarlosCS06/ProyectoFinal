import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { igdbService, formatIGDBImage } from '../services/igdbService';
import { Calendar, Bookmark, BookmarkCheck, ChevronRight, Clock, MapPin, Search } from 'lucide-react';
import { useAppContext } from '../context/AppProvider';
import { useNavigate } from 'react-router-dom';
import '../styles/Releases.css';

const Releases = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { user, addToBacklog, backlog, removeFromBacklog, showNotification } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReleases = async () => {
            setLoading(true);
            try {
                const data = await igdbService.getUpcomingReleases();
                setGames(data);
            } catch (error) {
                console.error("Error fetching releases", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReleases();
    }, []);

    const handleBacklogAction = (e, game) => {
        e.stopPropagation();
        if (!user) {
            showNotification('Debes registrarte para guardar o hacer reseñas en la web', 'info');
            navigate('/login');
            return;
        }
        const isInBacklog = backlog.some(bg => bg.id === game.id);
        if (isInBacklog) {
            removeFromBacklog(game.id);
        } else {
            addToBacklog(game);
        }
    };

    return (
        <div className="releases-page container">
            <header className="section-header">
                <motion.div
                    className="header-icon-box"
                    initial={{ rotate: -10, scale: 0.9 }}
                    animate={{ rotate: 0, scale: 1 }}
                >
                    <Calendar size={24} color="var(--accent-secondary)" />
                </motion.div>
                <div className="header-text">
                    <h1 className="brand-text">Próximos <span className="text-gradient">Lanzamientos</span></h1>
                    <p>Calendario de los juegos más esperados que llegarán pronto a tus plataformas.</p>
                </div>

                <div className="search-bar-inline glass">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar lanzamiento..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            {loading ? (
                <div className="loading-container">
                    <div className="loader"></div>
                </div>
            ) : (
                <div className="releases-timeline">
                    {games.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase())).length > 0 ? (
                        games
                            .filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map((game, index) => {
                                const isInBacklog = backlog.some(bg => bg.id === game.id);
                                return (
                                    <motion.div
                                        key={game.id}
                                        className="release-card glass"
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => navigate(`/game/${game.id}`)}
                                    >
                                        <div className="release-date-tag">
                                            <Clock size={14} />
                                            <span>{new Date(game.first_release_date * 1000).toLocaleDateString()}</span>
                                        </div>

                                        <div className="release-content">
                                            <div className="release-cover">
                                                <img src={formatIGDBImage(game.cover?.url, 't_cover_big')} alt={game.name} />
                                            </div>
                                            <div className="release-info">
                                                <div className="release-platforms">
                                                    {game.platforms?.slice(0, 3).map(p => (
                                                        <span key={p.id} className="platform-pill mini">{p.name}</span>
                                                    ))}
                                                </div>
                                                <h3>{game.name}</h3>
                                                <p className="release-genres">{game.genres?.map(g => g.name).join(', ')}</p>
                                            </div>
                                            <div className="release-actions">
                                                <button
                                                    className={`wishlist-btn glass ${isInBacklog ? 'active' : ''}`}
                                                    onClick={(e) => handleBacklogAction(e, game)}
                                                    title={isInBacklog ? "En mi Colección" : "Añadir a deseados"}
                                                >
                                                    {isInBacklog ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                                                    <span>{isInBacklog ? 'En mi Colección' : 'Lo quiero'}</span>
                                                </button>
                                                <ChevronRight size={20} className="chevron" />
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                    ) : (
                        <div className="empty-state glass">
                            <p>No se encontraron lanzamientos próximos.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Releases;
