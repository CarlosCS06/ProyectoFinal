import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { igdbService } from '../services/igdbService';
import GameGrid from '../components/games/GameGrid';
import { Search, Filter, X } from 'lucide-react';
import { useBusquedaEficiente } from '../hooks/BusquedaEficiente';
import '../styles/Explore.css';

const Explorar = () => {
    const [juegos, setJuegos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState('');
    const [generos, setGeneros] = useState([]);
    const [plataformas, setPlataformas] = useState([]);

    // Filtros States
    const [generoSeleccionado, setGeneroSeleccionado] = useState('');
    const [plataformaSeleccionada, setPlataformaSeleccionada] = useState('');
    const [orden, setOrden] = useState('rating');
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    const busquedaDebounce = useBusquedaEficiente(busqueda, 500);

    // Fetch inicial metadata
    useEffect(() => {
        const obtenerMetadatos = async () => {
            try {
                const [datosGeneros, datosPlataformas] = await Promise.all([
                    igdbService.obtenerGeneros(),
                    igdbService.obtenerPlataformas()
                ]);
                setGeneros(datosGeneros);
                setPlataformas(datosPlataformas);
            } catch (error) {
                console.error("Error al obtener filtros", error);
            }
        };
        obtenerMetadatos();
    }, []);

    // Main Data Fetcher
    useEffect(() => {
        const obtenerJuegos = async () => {
            setCargando(true);
            try {
                let datos;
                const filtros = { genre: generoSeleccionado, platform: plataformaSeleccionada, sort: orden };

                if (busquedaDebounce) {
                    datos = await igdbService.buscarJuegos(busquedaDebounce, filtros);
                } else {
                    datos = await igdbService.descubrirJuegos(filtros);
                }
                setJuegos(datos);
            } catch (error) {
                console.error("Error al explorar juegos", error);
            } finally {
                setCargando(false);
            }
        };
        obtenerJuegos();
    }, [busquedaDebounce, generoSeleccionado, plataformaSeleccionada, orden]);

    const limpiarFiltros = () => {
        setGeneroSeleccionado('');
        setPlataformaSeleccionada('');
        setOrden('rating');
    };

    const conteoFiltrosActivos = [generoSeleccionado, plataformaSeleccionada, orden !== 'rating'].filter(Boolean).length;

    return (
        <div className="explore-container">
            <header className="explore-header">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="brand-text">Explorar <span className="text-gradient">Universo</span></h1>
                    <p>Descubrimiento inteligente impulsado por IGDB.</p>
                </motion.div>

                <div className="explore-tools-v2">
                    <div className="search-and-filter">
                        <motion.div className="search-box-v3 glass">
                            <Search size={20} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Buscar por título..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                            {busqueda && <X size={18} className="clear-icon" onClick={() => setBusqueda('')} />}
                        </motion.div>

                        <button
                            className={`filter-toggle-btn glass ${mostrarFiltros ? 'active' : ''}`}
                            onClick={() => setMostrarFiltros(!mostrarFiltros)}
                        >
                            <Filter size={18} />
                            <span>Filtros</span>
                            {conteoFiltrosActivos > 0 && <span className="filter-count">{conteoFiltrosActivos}</span>}
                        </button>
                    </div>

                    <AnimatePresence>
                        {mostrarFiltros && (
                            <motion.div
                                className="filters-panel glass"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                            >
                                <div className="filters-grid">
                                    <div className="filter-group">
                                        <label>Género</label>
                                        <select value={generoSeleccionado} onChange={(e) => setGeneroSeleccionado(e.target.value)} className="glass">
                                            <option value="">Todos los Géneros</option>
                                            {generos.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
                                        </select>
                                    </div>

                                    <div className="filter-group">
                                        <label>Plataforma</label>
                                        <select value={plataformaSeleccionada} onChange={(e) => setPlataformaSeleccionada(e.target.value)} className="glass">
                                            <option value="">Todas las Plataformas</option>
                                            {plataformas.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                                        </select>
                                    </div>

                                    <div className="filter-group">
                                        <label>Ordenar Por</label>
                                        <select value={orden} onChange={(e) => setOrden(e.target.value)} className="glass">
                                            <option value="rating">Mejor Valorados</option>
                                            <option value="newest">Más Recientes</option>
                                            <option value="oldest">Clásicos</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="filter-actions">
                                    <button className="clear-btn" onClick={limpiarFiltros}>Restablecer</button>
                                    <button className="close-btn" onClick={() => setMostrarFiltros(false)}>Listo</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </header>

            <div className="explore-content">
                <GameGrid juegos={juegos} cargando={cargando} />
            </div>
        </div>
    );
};

export default Explorar;
