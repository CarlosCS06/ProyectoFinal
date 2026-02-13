import { BrowserRouter as Router } from 'react-router-dom';
import { AppProvider } from './context/AppProvider';
import Layout from './components/layout/Layout';
import AppRouter from './routes/AppRouter';
import './index.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <AppRouter />
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;
