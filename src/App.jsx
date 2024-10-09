import React, { useState } from 'react';
import Login from '../componentes/login';
import Dashboard from '../componentes/dashboard';
import Team from '../componentes/Equipos';
import { Routes, Route } from 'react-router-dom';
import { supabase } from '../componentes/config/client';
import Tactics from '../componentes/tacticalboard';
import Transfers from '../componentes/fichajes';
import Graficos from '../componentes/graficos';
import Usuario from '../componentes/usuarios';
import Notificaciones from '../componentes/notificacion';


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
     <Route path="/notificacion" element={<Notificaciones/>} />

     
    </Routes>
  );
};

export default App;