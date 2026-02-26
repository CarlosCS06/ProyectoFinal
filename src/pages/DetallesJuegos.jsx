import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { igdbService, formatearImagenIGDB, obtenerUrlYoutube } from '../services/igdbService';
import { reviewsService } from '../services/reviewsService';
import {
    ArrowLeft, Star, Calendar, Bookmark, BookmarkCheck,
    Globe, Users, Trophy, PlayCircle, PlusCircle, User, MessageSquare, Trash2
} from 'lucide-react';
import { useContextoApp } from '../context/AppProvider';
import GameCard from '../components/games/GameCard';
import ReviewForm from '../components/games/ReviewForm';
import '../styles/GameDetail.css';
import '../styles/ReviewForm.css';

const DetallesJuegos = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [juego, setJuego] = useState(null);
    const [reseñas, setReseñas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mostrarModalReseña, setMostrarModalReseña] = useState(false);
    const [pestañaActiva, setPestañaActiva] = useState('overview');

    const { usuario, agregarAColeccion, coleccion, eliminarDeColeccion, mostrarNotificacion } = useContextoApp();
    const estaEnColeccion = coleccion.some(j => j.id === parseInt(id));

    const obtenerDetalles = async () => {
        try {
            const [datosJuego, datosReseñas] = await Promise.all([
                igdbService.obtenerDetallesJuego(id),
                reviewsService.obtenerReseñas(id)
            ]);

            if (datosJuego && datosJuego.id) {
                setJuego(datosJuego);
            } else if (Array.isArray(datosJuego) && datosJuego.length > 0) {
                setJuego(datosJuego[0]);
            }
            setReseñas(datosReseñas);
        } catch (error) {
            console.error("Error cargando datos", error);
        } finally {
            setCargando(false);
        }
    };

    const manejarBorrarReseña = async (idReseña) => {
        try {
            await reviewsService.borrarReseña(idReseña);
            mostrarNotificacion('Reseña eliminada correctamente', 'success');
            obtenerDetalles();
        } catch (error) {
            console.error("Error al eliminar la reseña", error);
            mostrarNotificacion('Error al eliminar la reseña', 'error');
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        obtenerDetalles();
    }, [id]);

    if (cargando) return <div className="detail-loading"><div className="loader"></div></div>;
    if (!juego) return <div className="glass empty-state container">Juego no encontrado</div>;

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
                        src={formatearImagenIGDB(juego.capturas?.[0]?.url || juego.portada?.url, 't_1080p')}
                        alt="bg"
                        className="hero-bg-img"
                    />
                    <div className="hero-gradient"></div>
                </div>

                <div className="hero-data container">
                    <motion.div className="hero-info-header" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                        <div className="hero-genres">
                            {juego.generos?.map(g => <span key={g.id} className="genre-pill">{g.nombre}</span>)}
                        </div>
                        <h1 className="hero-game-title">{juego.nombre}</h1>

                        <div className="hero-stats">
                            <div className="stat-item">
                                <Star size={20} fill="#fbbf24" color="#fbbf24" />
                                <span className="stat-value">{(juego.valoracion / 20).toFixed(1)}</span>
                                <span className="stat-label">Valoración</span>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <Calendar size={20} />
                                <span className="stat-value">{juego.fecha_lanzamiento ? new Date(juego.fecha_lanzamiento * 1000).getFullYear() : 'TBA'}</span>
                                <span className="stat-label">Lanzamiento</span>
                            </div>
                        </div>

                        <div className="hero-actions-row">
                            <button
                                className={`main-action-btn ${estaEnColeccion ? 'active' : ''}`}
                                onClick={() => {
                                    if (!usuario) {
                                        mostrarNotificacion('Debes registrarte para guardar o hacer reseñas en la web', 'info');
                                        navigate('/login');
                                        return;
                                    }
                                    estaEnColeccion ? eliminarDeColeccion(juego.id) : agregarAColeccion(juego);
                                }}
                            >
                                {estaEnColeccion ? <BookmarkCheck size={22} /> : <Bookmark size={22} />}
                                <span>{estaEnColeccion ? 'En mi Colección' : 'Añadir a mi Colección'}</span>
                            </button>

                            <button className="btn-review-hero" onClick={() => {
                                if (!usuario) {
                                    mostrarNotificacion('Debes registrarte para guardar o hacer reseñas en la web', 'info');
                                    navigate('/login');
                                    return;
                                }
                                setMostrarModalReseña(true);
                            }}>
                                <PlusCircle size={22} />
                                <span>Escribir Reseña</span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Contenido Principal */}
            <div className="detail-grid container">
                <div className="detail-main">
                    {/* Pestañas - Requisito de Evento Académico */}
                    <div className="detail-tabs">
                        <button
                            className={pestañaActiva === 'overview' ? 'active' : ''}
                            onClick={() => setPestañaActiva('overview')}
                            onMouseEnter={() => { }} // Evento onMouseEnter
                        >
                            General
                        </button>
                        <button
                            className={pestañaActiva === 'reviews' ? 'active' : ''}
                            onClick={() => setPestañaActiva('reviews')}
                        >
                            Reseñas ({reseñas.length})
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {pestañaActiva === 'overview' ? (
                            <motion.div key="overview" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                {juego.videos?.[0] && (
                                    <section className="detail-section glass trailer-section">
                                        <h2><PlayCircle size={20} /> Tráiler Oficial</h2>
                                        <div className="trailer-aspect">
                                            <iframe src={obtenerUrlYoutube(juego.videos[0].video_id)} frameBorder="0" allowFullScreen></iframe>
                                        </div>
                                    </section>
                                )}

                                <section className="detail-section glass">
                                    <h2><Globe size={20} /> Resumen</h2>
                                    <p className="description-text">
                                        {juego.resumen || 'Sin descripción disponible.'}
                                    </p>
                                </section>

                                {/* Screenshots Gallery */}
                                {juego.capturas && juego.capturas.length > 0 && (
                                    <section className="detail-section glass">
                                        <h2><PlayCircle size={20} /> Capturas de Pantalla</h2>
                                        <div className="screenshots-grid">
                                            {juego.capturas.slice(0, 6).map((s, i) => (
                                                <img
                                                    key={s.id || i}
                                                    src={formatearImagenIGDB(s.url, 't_screenshot_big')}
                                                    alt={`Captura ${i + 1}`}
                                                    className="screenshot-img"
                                                    loading="lazy"
                                                />
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div key="reviews" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <section className="detail-section glass">
                                    <div className="section-header-row">
                                        <h2><User size={20} /> Reseñas de la Comunidad</h2>
                                        <button className="btn-review-action" onClick={() => {
                                            if (!usuario) {
                                                mostrarNotificacion('Debes registrarte para guardar o hacer reseñas en la web', 'info');
                                                navigate('/login');
                                                return;
                                            }
                                            setMostrarModalReseña(true);
                                        }}>
                                            <PlusCircle size={18} />
                                            <span>Escribir mi Reseña</span>
                                        </button>
                                    </div>

                                    <div className="reviews-list">
                                        {reseñas.length > 0 ? reseñas.map(r => (
                                            <div key={r.id} className="review-item glass">
                                                <div className="review-meta">
                                                    <span className="review-user">{r.userName || r.usuario || r.userId}</span>
                                                    <div className="review-meta-actions">
                                                        <div className="review-stars">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} size={14} fill={i < r.rating ? "#fbbf24" : "transparent"} color="#fbbf24" />
                                                            ))}
                                                        </div>
                                                        <button
                                                            className="delete-review-btn"
                                                            onClick={() => manejarBorrarReseña(r.id)}
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

                    {juego.juegos_similares && juego.juegos_similares.length > 0 && (
                        <section className="detail-section">
                            <h2>Aventuras Similares</h2>
                            <div className="similar-games-grid">
                                {juego.juegos_similares.slice(0, 4).map((sg, i) => (
                                    <GameCard key={sg.id} game={sg} index={i} />
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="detail-sidebar">
                    {/* Plataformas */}
                    {juego.plataformas && juego.plataformas.length > 0 && (
                        <div className="glass sidebar-card">
                            <h3><Globe size={18} /> Plataformas</h3>
                            <div className="platform-list">
                                {juego.plataformas.map(p => (
                                    <span key={p.id} className="platform-pill">{p.nombre}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Información */}
                    <div className="glass sidebar-card">
                        <h3><Calendar size={18} /> Información</h3>
                        <div className="info-list">
                            <div className="info-item">
                                <span className="info-label">Fecha de Lanzamiento</span>
                                <span className="info-value">{juego.fecha_lanzamiento ? new Date(juego.fecha_lanzamiento * 1000).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Por determinar'}</span>
                            </div>
                            {juego.valoracion && (
                                <div className="info-item">
                                    <span className="info-label">Valoración Global</span>
                                    <span className="info-value">{(juego.valoracion).toFixed(1)} / 100</span>
                                </div>
                            )}
                            {juego.valoracion_cuenta && (
                                <div className="info-item">
                                    <span className="info-label">Nº de Votos</span>
                                    <span className="info-value">{juego.valoracion_cuenta.toLocaleString('es-ES')}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Modos de Juego */}
                    {juego.modos_juego && juego.modos_juego.length > 0 && (
                        <div className="glass sidebar-card">
                            <h3><Users size={18} /> Modos de Juego</h3>
                            <div className="platform-list">
                                {juego.modos_juego.map(m => (
                                    <span key={m.id} className="genre-pill">{m.nombre}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Temáticas */}
                    {juego.temas && juego.temas.length > 0 && (
                        <div className="glass sidebar-card">
                            <h3><Star size={18} /> Temáticas</h3>
                            <div className="platform-list">
                                {juego.temas.map(t => (
                                    <span key={t.id} className="genre-pill">{t.nombre}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empresas */}
                    <div className="glass sidebar-card">
                        <h3><Trophy size={18} /> Empresas</h3>
                        <div className="company-list">
                            {
                                (() => {
                                    const list = [];
                                    if (juego.companias && Array.isArray(juego.companias)) {
                                        juego.companias.forEach(ic => {
                                            const name = ic.compania?.nombre || ic.nombre;
                                            const role = ic.desarrollador ? 'Desarrollador' : (ic.editor ? 'Editor' : 'Empresa');
                                            if (name) list.push({ id: ic.id || name, name, role });
                                        });
                                    }

                                    if (list.length === 0) return <p className="empty-text">No hay información de empresas disponible.</p>;

                                    return list.map(c => (
                                        <div key={c.id} className="company-item">
                                            <span className="company-name">{c.name}</span>
                                            <span className="company-role">{c.role}</span>
                                        </div>
                                    ));
                                })()
                            }
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {mostrarModalReseña && (
                    <ReviewForm
                        gameId={id}
                        gameName={juego.nombre}
                        onClose={() => setMostrarModalReseña(false)}
                        onReviewAdded={obtenerDetalles}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default DetallesJuegos;
