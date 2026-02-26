
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { igdbService, formatearImagenIGDB } from '../services/igdbService';
import { Calendar, Bookmark, BookmarkCheck, ChevronRight, Clock, MapPin, Search } from 'lucide-react';
import { useContextoApp } from '../context/AppProvider';
import { useNavigate } from 'react-router-dom';
import '../styles/Releases.css';

const Proximos = () => {
    const [juegos, setJuegos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [terminoBusqueda, setTerminoBusqueda] = useState('');
    const { usuario, agregarAColeccion, coleccion, eliminarDeColeccion, mostrarNotificacion } = useContextoApp();
    const navigate = useNavigate();

    useEffect(() => {
        const obtenerProximos = async () => {
            setCargando(true);
            try {
                const datos = await igdbService.obtenerProximos();
                setJuegos(datos);
            } catch (error) {
                console.error("Error al obtener lanzamientos", error);
            } finally {
                setCargando(false);
            }
        };
        obtenerProximos();
    }, []);

    const manejarAccionColeccion = (e, juego) => {
        e.stopPropagation();
        if (!usuario) {
            mostrarNotificacion('Debes registrarte para guardar o hacer reseñas en la web', 'info');
            navigate('/login');
            return;
        }
        const estaEnColeccion = coleccion.some(bg => bg.id === juego.id);
        if (estaEnColeccion) {
            eliminarDeColeccion(juego.id);
        } else {
            agregarAColeccion(juego);
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
                        value={terminoBusqueda}
                        onChange={(e) => setTerminoBusqueda(e.target.value)}
                    />
                </div>
            </header>

            {cargando ? (
                <div className="loading-container">
                    <div className="loader"></div>
                </div>
            ) : (
                <div className="releases-timeline">
                    {juegos.filter(g => g.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())).length > 0 ? (
                        juegos
                            .filter(g => g.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()))
                            .map((juego, indice) => {
                                const estaEnColeccion = coleccion.some(bg => bg.id === juego.id);
                                return (
                                    <motion.div
                                        key={juego.id}
                                        className="release-card glass"
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: indice * 0.05 }}
                                        onClick={() => navigate(`/game/${juego.id}`)}
                                    >
                                        <div className="release-date-tag">
                                            <Clock size={14} />
                                            <span>{new Date(juego.fecha_lanzamiento * 1000).toLocaleDateString()}</span>
                                        </div>

                                        <div className="release-content">
                                            <div className="release-cover">
                                                <img src={formatearImagenIGDB(juego.portada?.url, 't_cover_big')} alt={juego.nombre} />
                                            </div>
                                            <div className="release-info">
                                                <div className="release-platforms">
                                                    {juego.plataformas?.slice(0, 3).map(p => (
                                                        <span key={p.id} className="platform-pill mini">{p.nombre}</span>
                                                    ))}
                                                </div>
                                                <h3>{juego.nombre}</h3>
                                                <p className="release-genres">{juego.generos?.map(g => g.nombre).join(', ')}</p>
                                            </div>
                                            <div className="release-actions">
                                                <button
                                                    className={`wishlist-btn glass ${estaEnColeccion ? 'active' : ''}`}
                                                    onClick={(e) => manejarAccionColeccion(e, juego)}
                                                    title={estaEnColeccion ? "En mi Colección" : "Añadir a deseados"}
                                                >
                                                    {estaEnColeccion ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                                                    <span>{estaEnColeccion ? 'En mi Colección' : 'Lo quiero'}</span>
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

export default Proximos;
