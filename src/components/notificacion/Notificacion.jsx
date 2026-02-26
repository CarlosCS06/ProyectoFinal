import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useContextoApp } from '../../context/AppProvider';

const Notificacion = () => {
    const { notificacion } = useContextoApp();

    return (
        <AnimatePresence>
            {notificacion && (
                <motion.div
                    className={`notification-toast glass ${notificacion.tipo}`}
                    initial={{ opacity: 0, y: 50, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, scale: 0.95, x: '-50%' }}
                >
                    <div className="notification-content">
                        {notificacion.tipo === 'success' && <CheckCircle size={20} color="#10b981" />}
                        {notificacion.tipo === 'error' && <AlertCircle size={20} color="#ef4444" />}
                        {notificacion.tipo === 'info' && <Info size={20} color="#3b82f6" />}
                        <span>{notificacion.mensaje}</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Notificacion;
