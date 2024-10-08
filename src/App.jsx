
// App.jsx
/* import React, { useState } from 'react';
import { Routes, Route } from "react-router-dom";
import { Supabase } from './config/client.js';

import Login from '../componentes/realLogin';
import Dashboard from '../componentes/dashboard';
import Training from '../componentes/entrenamiento';
import Tactics from '../componentes/tacticalboard';
import Team from '../componentes/Equipos';
import Transfers from '../componentes/fichajes';
import Inicio from '../componentes/login.jsx';
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
   
  );
};

export default App; */
import React, { useState } from 'react';
import Login from '../componentes/login';
import AdminPanel from '../vistas/admin';
import Dashboard from '../componentes/dashboard';
import Team from '../componentes/Equipos';
import { Routes, Route } from 'react-router-dom';
import { supabase } from '../componentes/config/client';
import Tactics from '../componentes/tacticalboard';
import Transfers from '../componentes/fichajes';
import Graficos from '../componentes/graficos';
import Usuario from '../componentes/usuarios';


const App = () => {
  const [userRole, setUserRole] = useState(null); // Estado para guardar el rol del usuario

  return (
    <Routes>
    <Route path="/" element={<Login setUserRole={setUserRole} />} />
     <Route path="/dashboard" element={<Dashboard role={userRole} />} />
     <Route path="/equipos" element={<Team />} />
     <Route path="/tacticalboard" element={<Tactics />} />
     <Route path="/fichajes" element={<Transfers role={userRole}/>} />
     <Route path="/graficos" element={<Graficos/>}/>
     <Route path="/usuarios" element={<Usuario/>} />
     
    </Routes>
  );
};

export default App;