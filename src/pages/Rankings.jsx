import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { igdbService, formatIGDBImage } from '../services/igdbService';
import { Trophy, Star, Filter, Calendar, LayoutGrid, List } from 'lucide-react';
import GameGrid from '../components/games/GameGrid';
import '../styles/Rankings.css';

const Rankings = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'list'

    useEffect(() => {
        const fetchRankings = async () => {
            setLoading(true);
            try {
                const data = await igdbService.getTopRankings(50);
                setGames(data);
            } catch (error) {
                console.error("Error fetching rankings", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRankings();
    }, []);

    return (
        <div className="rankings-page container">
            <header className="section-header">
                <motion.div
                    className="header-icon-box"
                    initial={{ rotate: -10, scale: 0.9 }}
                    animate={{ rotate: 0, scale: 1 }}
                >
                    <Trophy size={24} color="var(--accent-primary)" />
                </motion.div>
                <div className="header-text">
                    <h1 className="brand-text">Los <span className="text-gradient">Mejores</span></h1>
                    <p>El salón de la fama de los videojuegos. El Top 50 mejor valorado por la crítica.</p>
                </div>

                <div className="view-controls glass">
                    <button
                        className={viewMode === 'grid' ? 'active' : ''}
                        onClick={() => setViewMode('grid')}
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button
                        className={viewMode === 'list' ? 'active' : ''}
                        onClick={() => setViewMode('list')}
                    >
                        <List size={18} />
                    </button>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        key="loader"
                        className="loading-container"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="loader"></div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {viewMode === 'grid' ? (
                            <GameGrid games={games} loading={false} />
                        ) : (
                            <div className="rankings-list-view">
                                {games.map((game, index) => (
                                    <motion.div
                                        key={game.id}
                                        className="rank-item glass"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.02 }}
                                    >
                                        <div className="rank-number">#{index + 1}</div>
                                        <div className="rank-cover">
                                            <img src={formatIGDBImage(game.cover?.url, 't_cover_small')} alt={game.name} />
                                        </div>
                                        <div className="rank-info">
                                            <h3>{game.name}</h3>
                                            <div className="rank-meta">
                                                <span>{game.genres?.[0]?.name}</span>
                                                <span className="dot">•</span>
                                                <span>{game.first_release_date ? new Date(game.first_release_date * 1000).getFullYear() : 'TBA'}</span>
                                            </div>
                                        </div>
                                        <div className="rank-score">
                                            <Star size={16} fill="#fbbf24" color="#fbbf24" />
                                            <span>{(game.total_rating / 20).toFixed(1)}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Rankings;
