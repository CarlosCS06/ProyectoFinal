import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Gamepad2, Sparkles } from 'lucide-react';
import { authService } from '../services/authService';
import { useAppContext } from '../context/AppProvider';
import '../styles/Login.css';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: ''
    });
    const [loading, setLoading] = useState(false);
    const { loginUser, showNotification } = useAppContext();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                const user = await authService.login(formData.email, formData.password);
                loginUser(user);
                navigate('/profile');
            } else {
                const newUser = await authService.register(formData);
                loginUser(newUser);
                navigate('/profile');
            }
        } catch (error) {
            showNotification(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-visuals">
                <div className="visuals-content">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="brand-large"
                    >
                        <img src="/vite.svg" alt="InfoGamer Logo" className="w-16 h-16 mb-2" />
                        <h1>Info<span className="text-gradient">Gamer</span></h1>
                    </motion.div>
                    <p>Tu universo personal de videojuegos te espera.</p>
                </div>
                <div className="floating-elements">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="float-item glass"
                            animate={{
                                y: [0, -20, 0],
                                rotate: [0, 10, 0]
                            }}
                            transition={{
                                duration: 5 + i,
                                repeat: Infinity,
                                delay: i * 0.5
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="login-form-container">
                <motion.div
                    className="form-box glass"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                >
                    <div className="form-header">
                        <h2>{isLogin ? '¡Hola de nuevo!' : 'Crea tu cuenta'}</h2>
                        <p>{isLogin ? 'Inicia sesión para acceder a tu colección.' : 'Únete a la comunidad de InfoGamer.'}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {!isLogin && (
                            <div className="input-group glass">
                                <User size={20} />
                                <input
                                    type="text"
                                    placeholder="Nombre de Usuario"
                                    required
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                        )}

                        <div className="input-group glass">
                            <Mail size={20} />
                            <input
                                type="email"
                                placeholder="Correo Electrónico"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="input-group glass">
                            <Lock size={20} />
                            <input
                                type="password"
                                placeholder="Contraseña"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <button type="submit" className="btn-primary auth-submit" disabled={loading}>
                            {loading ? 'Procesando...' : (
                                <>
                                    <span>{isLogin ? 'Entrar' : 'Registrarse'}</span>
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="form-footer">
                        <p>
                            {isLogin ? '¿No tienes cuenta?' : '¿Ya eres miembro?'}
                            <button onClick={() => setIsLogin(!isLogin)} className="toggle-auth">
                                {isLogin ? 'Regístrate' : 'Inicia Sesión'}
                            </button>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
