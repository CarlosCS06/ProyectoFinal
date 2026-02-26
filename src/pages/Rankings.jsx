
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { igdbService, formatearImagenIGDB } from '../services/igdbService';
import { Trophy, Star, Filter, Calendar, LayoutGrid, List } from 'lucide-react';
import GameGrid from '../components/games/GameGrid';
import '../styles/Rankings.css';

const Rankings = () => {
    const [juegos, setJuegos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [modoVista, setModoVista] = useState('grid');

    useEffect(() => {
        const obtenerRankings = async () => {
            setCargando(true);
            try {
                const datos = await igdbService.obtenerMejoresValorados(50);
                setJuegos(datos);
            } catch (error) {
                console.error("Error al obtener rankings", error);
            } finally {
                setCargando(false);
            }
        };
        obtenerRankings();
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
                        className={modoVista === 'grid' ? 'active' : ''}
                        onClick={() => setModoVista('grid')}
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button
                        className={modoVista === 'list' ? 'active' : ''}
                        onClick={() => setModoVista('list')}
                    >
                        <List size={18} />
                    </button>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {cargando ? (
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
                        {modoVista === 'grid' ? (
                            <GameGrid juegos={juegos} cargando={false} />
                        ) : (
                            <div className="rankings-list-view">
                                {juegos.map((juego, indice) => (
                                    <motion.div
                                        key={juego.id}
                                        className="rank-item glass"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: indice * 0.02 }}
                                    >
                                        <div className="rank-number">#{indice + 1}</div>
                                        <div className="rank-cover">
                                            <img src={formatearImagenIGDB(juego.portada?.url, 't_cover_small')} alt={juego.nombre} />
                                        </div>
                                        <div className="rank-info">
                                            <h3>{juego.nombre}</h3>
                                            <div className="rank-meta">
                                                <span>{juego.generos?.[0]?.nombre}</span>
                                                <span className="dot">•</span>
                                                <span>{juego.fecha_lanzamiento ? new Date(juego.fecha_lanzamiento * 1000).getFullYear() : 'TBA'}</span>
                                            </div>
                                        </div>
                                        <div className="rank-score">
                                            <Star size={16} fill="#fbbf24" color="#fbbf24" />
                                            <span>{juego.valoracion ? (juego.valoracion / 20).toFixed(1) : 'N/A'}</span>
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
