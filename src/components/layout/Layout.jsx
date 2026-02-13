import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Notification from '../common/Notification';
import '../../styles/Layout.css';
import '../../styles/Notification.css';

const Layout = ({ children }) => {
    return (
        <div className="app-shell">
            <Navbar />
            <Notification />
            <motion.main
                className="app-main"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="container">
                    {children}
                </div>
            </motion.main>

            <footer className="footer glass">
                <div className="container footer-grid">
                    <div className="footer-brand">
                        <h2 className="brand-text">InfoGamer</h2>
                        <p>Tu universo definitivo de videojuegos.</p>
                    </div>
                    <div className="footer-links">
                        <h4>Navegación</h4>
                        <a href="/explore">Explorar</a>
                        <a href="/backlog">Mi Colección</a>
                    </div>
                    <div className="footer-social">
                        <h4>Comunidad</h4>
                        <a href="#">Discord</a>
                        <a href="#">Twitter</a>
                    </div>
                </div>
                <div className="footer-bottom container">
                    <p>&copy; {new Date().getFullYear()} InfoGamer. Creado para jugadores épicos.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
