import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Explore from '../pages/Explore';
import GameDetail from '../pages/GameDetail';
import Backlog from '../pages/Backlog';
import Profile from '../pages/Profile';
import Login from '../pages/Login';
import Rankings from '../pages/Rankings';
import Releases from '../pages/Releases';

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/game/:id" element={<GameDetail />} />
            <Route path="/backlog" element={<Backlog />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/rankings" element={<Rankings />} />
            <Route path="/releases" element={<Releases />} />
            <Route path="*" element={<Home />} /> {/* Redirección temporal */}
        </Routes>
    );
};

export default AppRouter;
