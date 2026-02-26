import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Gamepad2, Sparkles } from 'lucide-react';
import { authService } from '../services/authService';
import { useContextoApp } from '../context/AppProvider';
import '../styles/Login.css';

const Login = () => {
    const [esLogin, setEsLogin] = useState(true);
    const [datosFormulario, setDatosFormulario] = useState({
        email: '',
        password: '',
        username: ''
    });
    const [cargando, setCargando] = useState(false);
    const { iniciarSesion, mostrarNotificacion } = useContextoApp();
    const navigate = useNavigate();

    const manejarEnvio = async (e) => {
        e.preventDefault();
        setCargando(true);

        try {
            if (esLogin) {
                const usuario = await authService.iniciarSesion(datosFormulario.email, datosFormulario.password);
                iniciarSesion(usuario);
                navigate('/profile');
            } else {
                const nuevoUsuario = await authService.registrarse(datosFormulario);
                iniciarSesion(nuevoUsuario);
                navigate('/profile');
            }
        } catch (error) {
            mostrarNotificacion(error.message, 'error');
        } finally {
            setCargando(false);
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
                        <h2>{esLogin ? '¡Hola de nuevo!' : 'Crea tu cuenta'}</h2>
                        <p>{esLogin ? 'Inicia sesión para acceder a tu colección.' : 'Únete a la comunidad de InfoGamer.'}</p>
                    </div>

                    <form onSubmit={manejarEnvio} className="auth-form">
                        {!esLogin && (
                            <div className="input-group glass">
                                <User size={20} />
                                <input
                                    type="text"
                                    placeholder="Nombre de Usuario"
                                    required
                                    value={datosFormulario.username}
                                    onChange={(e) => setDatosFormulario({ ...datosFormulario, username: e.target.value })}
                                />
                            </div>
                        )}

                        <div className="input-group glass">
                            <Mail size={20} />
                            <input
                                type="email"
                                placeholder="Correo Electrónico"
                                required
                                value={datosFormulario.email}
                                onChange={(e) => setDatosFormulario({ ...datosFormulario, email: e.target.value })}
                            />
                        </div>

                        <div className="input-group glass">
                            <Lock size={20} />
                            <input
                                type="password"
                                placeholder="Contraseña"
                                required
                                value={datosFormulario.password}
                                onChange={(e) => setDatosFormulario({ ...datosFormulario, password: e.target.value })}
                            />
                        </div>

                        <button type="submit" className="btn-primary auth-submit" disabled={cargando}>
                            {cargando ? 'Procesando...' : (
                                <>
                                    <span>{esLogin ? 'Entrar' : 'Registrarse'}</span>
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="form-footer">
                        <p>
                            {esLogin ? '¿No tienes cuenta?' : '¿Ya eres miembro?'}
                            <button onClick={() => setEsLogin(!esLogin)} className="toggle-auth">
                                {esLogin ? 'Regístrate' : 'Inicia Sesión'}
                            </button>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
