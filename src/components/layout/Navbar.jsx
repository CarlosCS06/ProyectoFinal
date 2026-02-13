import { Link, useLocation } from 'react-router-dom';
import { Gamepad2, Compass, Bookmark, Search, User, Trophy, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppContext } from '../../context/AppProvider';
import '../../styles/Navbar.css';

const Navbar = () => {
    const location = useLocation();
    const { user } = useAppContext();

    const navItems = [
        { path: '/explore', icon: Compass, label: 'Explorar' },
        { path: '/rankings', icon: Trophy, label: 'Los Mejores' },
        { path: '/releases', icon: Calendar, label: 'Próximos' },
        { path: '/backlog', icon: Bookmark, label: 'Mi Colección' },
    ];

    return (
        <nav className="navbar-wrapper">
            <motion.div
                className="navbar glass container"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            >
                <Link to="/" className="nav-logo">
                    <div className="logo-box">
                        <img src="/vite.svg" alt="InfoGamer Logo" className="logo-img" />
                    </div>
                    <span className="brand-text">Info<span className="text-gradient">Gamer</span></span>
                </Link>

                <div className="nav-menu">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                            {location.pathname === item.path && (
                                <motion.div
                                    className="nav-active-indicator"
                                    layoutId="nav-indicator"
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </Link>
                    ))}
                </div>

                <div className="nav-actions">
                    <div className="search-trigger">
                        <Search size={20} />
                    </div>
                    {user ? (
                        <Link to="/profile" className="profile-btn glass overflow-hidden">
                            {user.profilePic ? (
                                <img src={user.profilePic} alt="Perfil" className="nav-avatar-img" />
                            ) : (
                                <User size={18} />
                            )}
                            <span className="user-dot"></span>
                        </Link>
                    ) : (
                        <Link to="/login" className="btn-login-nav glass">
                            <User size={18} />
                            <span>Entrar</span>
                        </Link>
                    )}
                </div>
            </motion.div>
        </nav>
    );
};

export default Navbar;
