import React, { useState } from 'react';
import { supabase } from './config/client'; // Ajusta la ruta según tu estructura de carpetas
import { useNavigate } from 'react-router-dom';
import '../style/login.css'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      // Traer todos los usuarios desde la tabla
      const { data: users, error: fetchError } = await supabase
      .from('users')
      .select('email, password, nombre, role');
  
      if (fetchError) {
        console.error('Error al buscar usuarios:', fetchError);
        setError('Error al buscar usuarios');
        setLoading(false);
        return;
      }
  
      // Buscar el usuario en el frontend
      const user = users.find((u) => u.email === email);
  
      if (!user) {
        setError('Usuario no encontrado');
        setLoading(false);
        return;
      }
  
      // Comparar la contraseña (sin hash)
      if (password === user.password) {
        console.log('Inicio de sesión exitoso');
  
        // Verificar el rol y redirigir
         localStorage.setItem('userRole', user.role);
         const userData = { name: user.nombre, role: user.role };
         localStorage.setItem('user', JSON.stringify(userData));

        // Redirige al dashboard
        navigate('/dashboard');
      } else {
        setError('Contraseña incorrecta');
      }
  
    } catch (error) {
      console.error('Error durante el proceso de login:', error);
      setError('Error inesperado');
    }
  
    setLoading(false);
  };
  
  return (
    <div className="login-background">
    <div className="login-form">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label className="inputlogin">Email:</label>
          <input
            type="email"
            placeholder="Email"
            className="inputField"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="inputlogin">Contraseña:</label>
          <input
            type="password"
            placeholder="Contraseña"
            className="inputField"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="loginButton" // Aplica la clase del CSS module
          disabled={loading}
        >
          {loading ? 'Cargando...' : 'Iniciar Sesión'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  </div>
);
};

export default Login;