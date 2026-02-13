import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppProvider';
import GameGrid from '../components/games/GameGrid';
import { Bookmark, Sparkles, Ghost } from 'lucide-react';

const Backlog = () => {
    const { user, backlog, showNotification } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            showNotification('Debes registrarte para guardar o hacer reseñas en la web', 'info');
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user) return null;

    return (
        <div className="backlog-page">
            <header className="section-header" style={{ marginBottom: '4rem' }}>
                <motion.div
                    className="header-icon-box"
                    initial={{ rotate: -10, scale: 0.9 }}
                    animate={{ rotate: 0, scale: 1 }}
                >
                    <Bookmark size={24} color="var(--accent-primary)" />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="brand-text">Mi <span className="text-gradient">Colección</span></h1>
                    <p>Tu lista curada de aventuras esperando ser jugadas.</p>
                </motion.div>
            </header>

            {backlog.length > 0 ? (
                <GameGrid games={backlog} loading={false} />
            ) : (
                <motion.div
                    className="empty-backlog glass"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        padding: '10rem 2rem',
                        textAlign: 'center',
                        borderRadius: '40px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1.5rem'
                    }}
                >
                    <div className="ghost-box glass" style={{ padding: '2rem', borderRadius: '50%' }}>
                        <Ghost size={60} color="var(--text-dim)" strokeWidth={1} />
                    </div>
                    <div style={{ maxWidth: '400px' }}>
                        <h2 style={{ marginBottom: '0.5rem' }}>Silencio... demasiado silencio.</h2>
                        <p style={{ color: 'var(--text-dim)' }}>
                            Tu colección está un poco vacía. ¡Ve a la página de Explorar para encontrar títulos épicos!
                        </p>
                    </div>
                    <button
                        className="btn-primary"
                        style={{ marginTop: '1rem' }}
                        onClick={() => window.location.href = '/explore'}
                    >
                        <Sparkles size={18} />
                        Buscar Videojuegos
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default Backlog;
