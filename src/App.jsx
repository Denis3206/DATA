/* import { useState } from 'react'
import viteLogo from '/vite.svg'
import Inicio from '../componentes/login'
import './App.css'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
  
        </a>
      </div>
      <h1>Vite + React</h1>
      
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <Inicio/>
    </>
  )
}

export default App
 */

// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from '../componentes/realLogin';
import Dashboard from '../componentes/dashboard';
import Training from '../componentes/entrenamiento';
import Tactics from '../componentes/tacticalboard';
import Team from '../componentes/Equipos';
import Transfers from '../componentes/fichajes';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (username, password) => {
    if (username === 'admin' && password === 'password') {
      setIsAuthenticated(true);
      setUser({ name: 'Admin' });
    } else {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard user={user} /> : <Navigate to="/login" />}
        >
          <Route path="training" element={<Training />} />
          <Route path="tactics" element={<Tactics />} />
          <Route path="team" element={<Team />} />
          <Route path="transfers" element={<Transfers />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;