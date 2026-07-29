import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddBaby from './pages/AddBaby';
import Logs from './pages/Logs';
import Vaccines from './pages/Vaccines';
import Articles from './pages/Articles';
import AIAssistant from './pages/AIAssistant';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const handleStorage = () => setToken(localStorage.getItem('token'));
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register onLogin={setToken} />} />
        <Route path="/login" element={<Login onLogin={setToken} />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/babies/add" element={token ? <AddBaby /> : <Navigate to="/login" />} />
        <Route path="/logs" element={token ? <Logs /> : <Navigate to="/login" />} />
        <Route path="/vaccines" element={token ? <Vaccines /> : <Navigate to="/login" />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/ai-assistant" element={token ? <AIAssistant /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
