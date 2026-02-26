import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { igdbService, formatearImagenIGDB } from '../services/igdbService';
import GameGrid from '../components/games/GameGrid';
import { TrendingUp, Sparkles, Play, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
    const [tendencia, setTendencia] = useState([]);
    const [destacado, setDestacado] = useState(null);
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                const datos = await igdbService.obtenerJuegosTendencia();
                setTendencia(datos);
                if (datos.length > 0) {
                    setDestacado(datos[0]); // Usamos el primero en tendencia como destacado
                }
            } catch (error) {
                console.error("Error al obtener juegos", error);
            } finally {
                setCargando(false);
            }
        };
        obtenerDatos();
    }, []);

    return (
        <div className="home-page-v2">
            {/* Sección Hero Dinámica */}
            <AnimatePresence>
                {destacado && (
                    <motion.section
                        className="home-hero"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <div className="hero-background">
                            <img
                                src={formatearImagenIGDB(destacado.portada?.url, 't_screenshot_big')}
                                alt="hero bg"
                                className="hero-img"
                            />
                            <div className="hero-overlay"></div>
                        </div>

                        <div className="hero-content-wrapper container">
                            <motion.div
                                className="hero-badge glass"
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Sparkles size={16} className="text-gradient" />
                                <span>Juego Destacado</span>
                            </motion.div>

                            <motion.h1
                                className="hero-title"
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                {destacado.nombre}
                            </motion.h1>

                            <motion.div
                                className="hero-platforms"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                {destacado.plataformas?.slice(0, 3).map(p => (
                                    <span key={p.id} className="platform-tag">{p.nombre}</span>
                                ))}
                            </motion.div>

                            <motion.div
                                className="hero-actions"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8 }}
                            >
                                <button
                                    className="btn-primary"
                                    onClick={() => navigate(`/game/${destacado.id}`)}
                                >
                                    <Play size={20} fill="currentColor" />
                                    <span>Explorar Ahora</span>
                                </button>
                                <button
                                    className="btn-outline glass"
                                    onClick={() => navigate(`/game/${destacado.id}`)}
                                >
                                    <Info size={20} />
                                    <span>Más Información</span>
                                </button>
                            </motion.div>
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>

            <section className="trending-section">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="header-icon-box">
                        <TrendingUp size={24} color="var(--accent-primary)" />
                    </div>
                    <div>
                        <h2>Lanzamientos Populares</h2>
                        <p>Títulos tendencia seleccionados de la comunidad</p>
                    </div>
                </motion.div>

                <GameGrid juegos={tendencia} cargando={cargando} />
            </section>

            {/* Sección Estadísticas / CTA */}
            <motion.section
                className="cta-section glass"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <div className="cta-content">
                    <h2>¿Listo para crear tu colección <span className="text-gradient">Épica</span>?</h2>
                    <p>Únete a InfoGamer hoy mismo y no pierdas el rastro de tus aventuras.</p>
                    <button className="btn-primary" onClick={() => navigate('/explore')}>
                        Empezar a Explorar
                    </button>
                </div>
            </motion.section>
        </div>
    );
};

export default Home;
