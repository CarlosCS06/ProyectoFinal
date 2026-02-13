import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useAppContext } from '../../context/AppProvider';

const Notification = () => {
    const { notification } = useAppContext();

    return (
        <AnimatePresence>
            {notification && (
                <motion.div
                    className={`notification-toast glass ${notification.type}`}
                    initial={{ opacity: 0, y: 50, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, scale: 0.95, x: '-50%' }}
                >
                    <div className="notification-content">
                        {notification.type === 'success' && <CheckCircle size={20} color="#10b981" />}
                        {notification.type === 'error' && <AlertCircle size={20} color="#ef4444" />}
                        {notification.type === 'info' && <Info size={20} color="#3b82f6" />}
                        <span>{notification.message}</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Notification;
