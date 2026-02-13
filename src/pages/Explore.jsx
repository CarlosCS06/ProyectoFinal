import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { igdbService } from '../services/igdbService';
import GameGrid from '../components/games/GameGrid';
import { Search, Filter, X, ChevronDown, SortDesc } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import '../styles/Explore.css';

const Explore = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [genres, setGenres] = useState([]);
    const [platforms, setPlatforms] = useState([]);

    // Filter States
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedPlatform, setSelectedPlatform] = useState('');
    const [sort, setSort] = useState('rating');
    const [showFilters, setShowFilters] = useState(false);

    const debouncedSearch = useDebounce(search, 500);

    // Fetch initial metadata
    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const [gData, pData] = await Promise.all([
                    igdbService.getGenres(),
                    igdbService.getPlatforms()
                ]);
                setGenres(gData);
                setPlatforms(pData);
            } catch (error) {
                console.error("Failed to fetch filters", error);
            }
        };
        fetchMetadata();
    }, []);

    // Main Data Fetcher
    useEffect(() => {
        const fetchGames = async () => {
            setLoading(true);
            try {
                let data;
                const filters = { genre: selectedGenre, platform: selectedPlatform, sort };

                if (debouncedSearch) {
                    data = await igdbService.searchGames(debouncedSearch, filters);
                } else {
                    data = await igdbService.discoverGames(filters);
                }
                setGames(data);
            } catch (error) {
                console.error("Error exploring games", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGames();
    }, [debouncedSearch, selectedGenre, selectedPlatform, sort]);

    const clearFilters = () => {
        setSelectedGenre('');
        setSelectedPlatform('');
        setSort('rating');
    };

    const activeFiltersCount = [selectedGenre, selectedPlatform, sort !== 'rating'].filter(Boolean).length;

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
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            {search && <X size={18} className="clear-icon" onClick={() => setSearch('')} />}
                        </motion.div>

                        <button
                            className={`filter-toggle-btn glass ${showFilters ? 'active' : ''}`}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter size={18} />
                            <span>Filtros</span>
                            {activeFiltersCount > 0 && <span className="filter-count">{activeFiltersCount}</span>}
                        </button>
                    </div>

                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                className="filters-panel glass"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                            >
                                <div className="filters-grid">
                                    <div className="filter-group">
                                        <label>Género</label>
                                        <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} className="glass">
                                            <option value="">Todos los Géneros</option>
                                            {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                        </select>
                                    </div>

                                    <div className="filter-group">
                                        <label>Plataforma</label>
                                        <select value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value)} className="glass">
                                            <option value="">Todas las Plataformas</option>
                                            {platforms.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </select>
                                    </div>

                                    <div className="filter-group">
                                        <label>Ordenar Por</label>
                                        <select value={sort} onChange={(e) => setSort(e.target.value)} className="glass">
                                            <option value="rating">Mejor Valorados</option>
                                            <option value="newest">Más Recientes</option>
                                            <option value="oldest">Clásicos</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="filter-actions">
                                    <button className="clear-btn" onClick={clearFilters}>Restablecer</button>
                                    <button className="close-btn" onClick={() => setShowFilters(false)}>Listo</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </header>

            <div className="explore-content">
                <GameGrid games={games} loading={loading} />
            </div>
        </div>
    );
};

export default Explore;
