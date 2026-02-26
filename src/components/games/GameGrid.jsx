import GameCard from './GameCard';
import '../../styles/GameGrid.css';

const GameGrid = ({ juegos, cargando }) => {
    if (cargando) {
        return (
            <div className="game-grid">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="skeleton-card glass skeleton"></div>
                ))}
            </div>
        );
    }

    if (!Array.isArray(juegos) || juegos.length === 0) {
        return (
            <div className="empty-state glass">
                <p>No se encontraron juegos. Intenta otra búsqueda.</p>
                {juegos && !Array.isArray(juegos) && <p className="error-hint">Error de API: Los datos no tienen el formato esperado.</p>}
            </div>
        );
    }

    return (
        <div className="game-grid">
            {juegos.map((juego, indice) => (
                <GameCard key={`${juego.id}-${indice}`} game={juego} index={indice} />
            ))}
        </div>
    );
};

export default GameGrid;
