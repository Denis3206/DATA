import React, { useState, useEffect } from 'react';
import { supabase } from './config/client';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Navbar from './navbar';
import styles from '../style/usuarios.module.css'

const Usuario = () => {
    const [users, setUsers] = useState([]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(1);
    const [nombre, setNombre] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    
    const [editEmail, setEditEmail] = useState('');
    const [editPassword, setEditPassword] = useState('');
    const [editRole, setEditRole] = useState(1);
    const [editNombre, setEditNombre] = useState('');

    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const storedRole = localStorage.getItem('userRole');
        const storedUser = JSON.parse(localStorage.getItem('user'));
    
        if (storedRole) setRole(storedRole);
        if (storedUser) setUser(storedUser);

        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const { data } = await supabase.from('users').select('*').order('id_users', { ascending: true });
        setUsers(data);
    };

    const addUser = async () => {
        const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (existingUser) {
            alert('El email ya está registrado.');
            return;
        }

        const { error } = await supabase.from('users').insert([{ email, password, role, nombre }]);
        if (error) {
            console.error('Error al agregar usuario:', error);
        } else {
            setEmail('');
            setPassword('');
            setRole(1);
            setNombre('');
            fetchUsers();
            await supabase.from('notificaciones').insert({
                event_type: 'usuario',
                mensaje: `Se ha agregado un nuevo usuario: ${nombre}.`,
                id_users: user.id_users, // Ajusta según cómo manejes el ID del usuario
                created_at: new Date(),
              });
        }

    };

    const deleteUser = async () => {
        if (!selectedUser) return;

        const { error } = await supabase.from('users').delete().eq('id_users', selectedUser.id);
        if (error) {
            console.error('Error al eliminar usuario:', error);
        } else {
            setSelectedUser(null);
            fetchUsers();
        }
    };

    const updateUser = async () => {
        if (!selectedUser) return;

        const { error } = await supabase
            .from('users')
            .update({ email: editEmail, password: editPassword, role: editRole, nombre: editNombre })
            .eq('id_users', selectedUser.id);

        if (error) {
            console.error('Error al modificar usuario:', error);
        } else {
            setSelectedUser(null);
            setEditEmail('');
            setEditPassword('');
            setEditRole(1);
            setEditNombre('');
            fetchUsers();
        }
    };

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setEditEmail(user.email);
        setEditPassword(user.password);
        setEditRole(user.role);
        setEditNombre(user.nombre);
    };

    return (
        <div>
            <Navbar user={user} />
                <button className="back-button" onClick={() => navigate('/dashboard')}>
                <FaArrowLeft /> Regresar al Dashboard
                </button>
        <div className={styles.flexContainer}>
            {/* Contenedor para formularios */}
            <div className={styles.containerRow}>
                <div className={styles.formContainer}>
                    <h2 className={styles.title}>Agregar Usuario</h2>
                    <input
                        className={styles.input}
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className={styles.input}
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                    <select className={styles.select} value={role} onChange={(e) => setRole(Number(e.target.value))}>
                        <option value={1}>Administrador</option>
                        <option value={2}>Entrenador</option>
                        <option value={3}>Jugador</option>
                    </select>
                    
                    <button className={styles.button} onClick={addUser}>Agregar Usuario</button>
                </div>
    
                <div className={styles.modifyContainer}>
                    <h3 className={styles.modifyTitle}>Modificar Usuario</h3>
                    <input
                        className={styles.input}
                        type="email"
                        placeholder="Email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                    />
                    <input
                        className={styles.input}
                        type="password"
                        placeholder="Contraseña"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                    />
                     <input
                        className={styles.input}
                        type="text"
                        placeholder="Nombre"
                        value={editNombre}
                        onChange={(e) => setEditNombre(e.target.value)}
                    />
                    <select className={styles.select} value={editRole} onChange={(e) => setEditRole(Number(e.target.value))}>
                        <option value={1}>Administrador</option>
                        <option value={2}>Entrenador</option>
                        <option value={3}>Jugador</option>
                    </select>
            
                    {/* Contenedor para los botones de modificar y eliminar */}
                    <div className={styles.buttonContainer}>
                        <button className={styles.button} onClick={updateUser} disabled={!selectedUser}>Modificar Usuario</button>
                        <button className={styles.button} onClick={deleteUser} disabled={!selectedUser}>Eliminar Usuario</button>
                    </div>
                </div>
            </div>
    
            {/* Lista de usuarios debajo de todos los elementos */}
            <div className={styles.userSection}>
                <h2 className={styles.title}>Lista de Usuarios</h2>
                <table className={styles.table}>
                    <thead>
                        <tr className={styles.tableHeader}>
                            <th className={styles.tableHeaderCell}>Email</th>
                            <th className={styles.tableHeaderCell}>Rol</th>
                            <th className={styles.tableHeaderCell}>Nombre</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr
                                key={user.id_users}
                                className={`${styles.tableRow} ${selectedUser?.id_users === user.id_users ? styles.selectedRow : ''}`}
                                onClick={() => handleUserSelect(user)}
                            >
                                <td className={styles.tableCell}>{user.email}</td>
                                <td className={styles.tableCell}>{user.role === 1 ? 'Administrador' : user.role === 2 ? 'Entrenador' : 'Jugador'}</td>
                                <td className={styles.tableCell}>{user.nombre}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        </div>
    );
};
export default Usuario;