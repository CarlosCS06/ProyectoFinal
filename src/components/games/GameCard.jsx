import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Plus, BookmarkCheck, ChevronRight } from 'lucide-react';
import { useAppContext } from '../../context/AppProvider';
import { formatIGDBImage } from '../../services/igdbService';
import '../../styles/GameCard.css';

const GameCard = ({ game, index }) => {
    const navigate = useNavigate();
    const { user, addToBacklog, backlog, removeFromBacklog, showNotification } = useAppContext();
    const isInBacklog = backlog.some(g => g.id === game.id);

    return (
        <motion.div
            className="game-card-v2 glass"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            whileHover={{ y: -10, scale: 1.02 }}
            onClick={() => navigate(`/game/${game.id}`)}
        >
            <div className="card-media">
                <img
                    src={formatIGDBImage(game.cover?.url, 't_cover_big_2x')}
                    alt={game.name}
                    loading="lazy"
                />
                <div className="card-badge">
                    <Star size={12} fill="#fbbf24" color="#fbbf24" />
                    <span>{(game.total_rating / 20).toFixed(1)}</span>
                </div>
                <div className="card-overlay">
                    <motion.button
                        className={`card-add-btn ${isInBacklog ? 'active' : ''}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!user) {
                                showNotification('Debes registrarte para guardar o hacer reseñas en la web', 'info');
                                navigate('/login');
                                return;
                            }
                            if (isInBacklog) {
                                removeFromBacklog(game.id);
                            } else {
                                addToBacklog(game);
                            }
                        }}
                    >
                        {isInBacklog ? <BookmarkCheck size={20} /> : <Plus size={20} />}
                    </motion.button>
                </div>
            </div>

            <div className="card-info">
                <div className="card-platforms">
                    {game.platforms?.slice(0, 2).map(p => (
                        <span key={p.id} className="platform-pill">{p.name}</span>
                    ))}
                </div>
                <h3 className="card-title">{game.name}</h3>
                <div className="card-explore">
                    <span>Ver Detalles</span>
                    <ChevronRight size={14} />
                </div>
            </div>
        </motion.div>
    );
};

export default GameCard;
