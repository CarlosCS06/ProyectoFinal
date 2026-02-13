import GameCard from './GameCard';
import '../../styles/GameGrid.css';

const GameGrid = ({ games, loading }) => {
    if (loading) {
        return (
            <div className="game-grid">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="skeleton-card glass skeleton"></div>
                ))}
            </div>
        );
    }

    if (!Array.isArray(games) || games.length === 0) {
        return (
            <div className="empty-state glass">
                <p>No se encontraron juegos. Intenta otra búsqueda.</p>
                {games && !Array.isArray(games) && <p className="error-hint">Error de API: Los datos no tienen el formato esperado.</p>}
            </div>
        );
    }

    return (
        <div className="game-grid">
            {games.map((game, index) => (
                <GameCard key={`${game.id}-${index}`} game={game} index={index} />
            ))}
        </div>
    );
};

export default GameGrid;
