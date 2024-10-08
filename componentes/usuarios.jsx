import React, { useState, useEffect } from 'react';
import { supabase } from './config/client';

const Usuario = () => {
   const [users, setUsers] = useState([]);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('users').select('*'); // Seleccionar todos los campos
    if (!error) {
      setUsers(data);
    } else {
      console.error('Error fetching users:', error);
    }
  };

  const isPasswordSecure = (password) => {
    return password.length >= 8 && /\d/.test(password) && /[A-Z]/.test(password);
  };

  const handleAddUser = async () => {
    try {
      // Verificar si el correo ya está registrado
      const { data: existingUsers, error: fetchError } = await supabase
        .from('users')
        .select('email')
        .eq('email', email);
  
      if (fetchError) {
        console.error('Error checking email:', fetchError);
        return;
      }
  
      if (existingUsers.length > 0) {
        alert('Este correo ya está registrado.');
        return;
      }
  
      // Validar la contraseña
      if (!isPasswordSecure(password)) {
        alert('La contraseña debe tener al menos 8 caracteres, incluir un número y una letra mayúscula.');
        return;
      }
  
      // Registro del usuario en Supabase Auth
      const { user, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
  
      if (signUpError) {
        console.error('Error signing up:', signUpError);
        alert(`Error: ${signUpError.message}`);
        return;
      }
  
      // Insertar los datos del usuario en la tabla 'users'
      const { data, error: insertError } = await supabase.from('users').insert([
        {
          id: user.id,
          email: user.email,
          nombre: nombre,
          role: role,
        },
      ]);
  
      if (insertError) {
        console.error('Error inserting user into users table:', insertError);
        return;
      }
  
      setUsers([...users, ...data]);
      setNombre('');
      setEmail('');
      setPassword('');
      setRole('');
      alert('Usuario registrado con éxito y guardado en la base de datos.');
  
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };
  const handleDeleteUser = async (id) => {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (!error) {
      setUsers(users.filter(user => user.id !== id));
    } else {
      console.error('Error deleting user:', error);
    }
  };

  const handleUpdateUser = async () => {
    const { error } = await supabase.from('users').update({ 
      nombre, 
      email, 
      role 
    })('id', selectedUserId);
    
    if (!error) {
      fetchUsers();
      setSelectedUserId(null);
      setNombre('');
      setEmail('');
      setPassword('');
      setRole('');
    } else {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div>
      <h2>Gestión de Usuarios</h2>
      <div>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">Seleccione un rol</option>
          <option value="1">Administrador</option>
          <option value="2">Entrenador</option>
          <option value="3">Jugador</option>
        </select>
        <button onClick={selectedUserId ? handleUpdateUser : handleAddUser}>
          {selectedUserId ? 'Modificar Usuario' : 'Agregar Usuario'}
        </button>
      </div>
      <div className="user-list">
        {users.map(user => (
          <div key={user.id} className="user-item">
            <span>{user.nombre} ({user.email}) - Rol: {user.role}</span>
            <button onClick={() => { 
              setSelectedUserId(user.id); 
              setNombre(user.nombre); 
              setEmail(user.email); 
              setRole(user.role); 
              setPassword(''); 
            }}>
              Modificar
            </button>
            <button onClick={() => handleDeleteUser(user.id)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Usuario;