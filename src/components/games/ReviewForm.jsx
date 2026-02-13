import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send, User, MessageSquare, Star } from 'lucide-react';
import { reviewsService } from '../../services/reviewsService';
import { useAppContext } from '../../context/AppProvider';

const ReviewForm = ({ gameId, gameName, onClose, onReviewAdded }) => {
    const { user, showNotification } = useAppContext();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment) {
            showNotification('Por favor, escribe un comentario', 'error');
            return;
        }

        setSubmitting(true);
        try {
            const newReview = {
                gameId: parseInt(gameId),
                user: user.username,
                rating,
                comment,
                date: new Date().toISOString()
            };

            await reviewsService.addReview(newReview);
            showNotification('¡Reseña publicada con éxito!', 'success');
            if (onReviewAdded) onReviewAdded();
            onClose();
        } catch (error) {
            console.error("Error posting review", error);
            showNotification('Error al enviar la reseña', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="review-modal glass"
                initial={{ scale: 0.9, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 50, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h3>Escribir Reseña</h3>
                    <button className="close-btn-round" onClick={onClose}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="review-form">
                    <p className="form-subtitle">Compartiendo tu experiencia sobre <strong>{gameName}</strong></p>

                    <div className="form-group">
                        <label><User size={16} /> Publicando como</label>
                        <div className="user-badge-static glass">
                            <span className="user-name-highlight">{user?.username}</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label><Star size={16} /> Valoración (1-5)</label>
                        <div className="rating-selector">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <button
                                    key={num}
                                    type="button"
                                    className={`star-btn ${rating >= num ? 'active' : ''}`}
                                    onClick={() => setRating(num)}
                                    onMouseEnter={() => { }} // Additional event req
                                >
                                    <Star size={24} fill={rating >= num ? '#fbbf24' : 'transparent'} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label><MessageSquare size={16} /> Tu Comentario</label>
                        <textarea
                            placeholder="¿Qué te ha parecido el juego?"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="glass"
                            rows="4"
                            required
                        ></textarea>
                    </div>

                    <button type="submit" className="submit-review-btn btn-primary" disabled={submitting}>
                        {submitting ? 'Enviando...' : (
                            <>
                                <span>Publicar Reseña</span>
                                <Send size={18} />
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default ReviewForm;
