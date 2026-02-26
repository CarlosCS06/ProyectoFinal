import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Explorar from '../pages/Explorar';
import DetallesJuegos from '../pages/DetallesJuegos';
import Coleccion from '../pages/Coleccion';
import Perfil from '../pages/Perfil';
import Login from '../pages/Login';
import Rankings from '../pages/Rankings';
import Proximos from '../pages/Proximos';

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explorar />} />
            <Route path="/game/:id" element={<DetallesJuegos />} />
            <Route path="/coleccion" element={<Coleccion />} />
            <Route path="/profile" element={<Perfil />} />
            <Route path="/login" element={<Login />} />
            <Route path="/rankings" element={<Rankings />} />
            <Route path="/releases" element={<Proximos />} />
            <Route path="*" element={<Home />} /> {/* Redirección temporal */}
        </Routes>
    );
};

export default AppRouter;
