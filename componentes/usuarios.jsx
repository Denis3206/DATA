import React, { useState, useEffect } from 'react';
import { supabase } from './config/client';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Navbar from './navbar';
import styles from '../style/usuarios.module.css';

const Usuario = () => {
    const [users, setUsers] = useState([]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(1);
    const [nombre, setNombre] = useState('');
    const [jugadores, setJugadores] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState(null);
    const [user, setUser] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const [editEmail, setEditEmail] = useState('');
    const [editPassword, setEditPassword] = useState('');
    const [editRole, setEditRole] = useState(1);
    const [editNombre, setEditNombre] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const storedRole = localStorage.getItem('userRole');
        const storedUser = JSON.parse(localStorage.getItem('user'));

        if (storedRole) setRole(Number(storedRole));
        if (storedUser) setUser(storedUser);

        fetchUsers();
        fetchJugadores(); // Cargar lista de jugadores
    }, []);

    const fetchUsers = async () => {
        const { data, error } = await supabase.from('users').select('*').order('id_users', { ascending: true });
        if (error) {
            console.error('Error al obtener usuarios:', error);
        } else {
            setUsers(data);
        }
    };

    const fetchJugadores = async () => {
        const { data, error } = await supabase.from('miequipo').select('*') .is('id_users', null);
        if (error) console.error('Error al obtener jugadores:', error);
        else setJugadores(data);
    };

    const addUser = async () => {

        if (!email || !password || !nombre || !role) {
            alert('Por favor completa todos los campos antes de agregar el usuario.');
            return; // Detener la ejecución de la función si falta algún dato
        }
        const { data: existingUser, error: existingError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (existingUser) {
            alert('El email ya está registrado.');
            return;
        }

        const { data: newUserData, error: insertError } = await supabase
            .from('users')
            .insert([{ email, password, role, nombre }])
            .select()
            .single();

        if (insertError) {
            console.error('Error al agregar usuario:', insertError);
            alert('Hubo un error al agregar el usuario.');
        } else {
            setEmail('');
            setPassword('');
            setRole(1);
            setNombre('');
            fetchUsers();

            if (role === 3) {
                setNewUser(newUserData); // Guardar el nuevo usuario para la asignación
                setShowModal(true); // Mostrar modal para asignar jugador
            }

            await supabase.from('notificaciones').insert({
                event_type: 'usuario',
                mensaje: `Se ha agregado un nuevo usuario: ${nombre}.`,
                id_users: user?.id_users,
                created_at: new Date(),
            });
        }
    };

    const assignJugador = async (jugadorId) => {
        if (!newUser) {
            console.error('No hay un usuario nuevo para asignar.');
            return;
        }

        const { error } = await supabase
            .from('miequipo')
            .update({ id_users: newUser.id_users })
            .eq('id_mijugador', jugadorId);

        if (error) {
            console.error('Error al asociar jugador con usuario:', error);
            alert('Hubo un error al asignar el jugador.');
        } else {
            setShowModal(false);
            setNewUser(null);
            fetchJugadores();
            alert('Jugador asignado correctamente.');
        }
    };

    const closeModal = () => {
        if (!newUser) {
            setShowModal(false);
        } else {
            alert('Debes asignar un jugador antes de cerrar.');
        }
    };

    const deleteUser = async () => {
        if (!selectedUser) return;
    
        // Eliminar referencias en la tabla "miequipo" primero
        const { error: deleteReferencesError } = await supabase
            .from('miequipo')
            .update({ id_users: null }) // O puedes usar .delete() si deseas eliminar los registros de jugadores relacionados
            .eq('id_users', selectedUser.id_users);
    
        if (deleteReferencesError) {
            console.error('Error al eliminar referencias en miequipo:', deleteReferencesError);
            return;
        }
    
        // Luego, eliminar al usuario de la tabla "users"
        const { error: deleteUserError } = await supabase
            .from('users')
            .delete()
            .eq('id_users', selectedUser.id_users);
    
        if (deleteUserError) {
            console.error('Error al eliminar usuario:', deleteUserError);
        } else {
            setSelectedUser(null);
            setEditEmail('');
            setEditPassword('');
            setEditRole('');
            setEditNombre('');
            fetchUsers();
        }
    };

    
    const updateUser = async () => {
        if (!selectedUser) return;

        const { error } = await supabase
            .from('users')
            .update({ email: editEmail, password: editPassword, role: editRole, nombre: editNombre })
            .eq('id_users', selectedUser.id_users);

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

    const handleUserSelection = (user) => {
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
            <div className={styles.formContainer}>
            <h2 className={styles.title}>Agregar Usuario</h2>
            <div className={styles.inputGroup}>
                <input
                    className={styles.input}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    className={styles.input}
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
                    <select
                    className={styles.select}
                    value={role}
                    onChange={(e) => setRole(Number(e.target.value))}
                    required
                    >
                        <option value={1}>Administrador</option>
                        <option value={2}>Entrenador</option>
                        <option value={3}>Jugador</option>
                    </select>
                </div>
                    <button className={styles.button} onClick={addUser}>Agregar Usuario</button>
                </div>

                <div className={styles.userSection}>
                    <h2 className={styles.title}>Lista de Usuarios</h2>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Nombre</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr
                                    key={user.id_users}
                                    className={styles.tableRow}
                                    onClick={() => handleUserSelection(user)}
                                >
                                    <td>{user.email}</td>
                                    <td>
                                        {user.role === 1 && 'Administrador'}
                                        {user.role === 2 && 'Entrenador'}
                                        {user.role === 3 && 'Jugador'}
                                    </td>
                                    <td>{user.nombre}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.editContainer}>
                    <h2 className={styles.title}>Modificar Usuario</h2>
                    <div className={styles.inputGroup}>
                    <input
                        className={styles.input}
                        type="email"
                        placeholder="Email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        disabled={!selectedUser}
                    />
                    <input
                        className={styles.input}
                        type="password"
                        placeholder="Contraseña"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        disabled={!selectedUser}
                    />
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Nombre"
                        value={editNombre}
                        onChange={(e) => setEditNombre(e.target.value)}
                        disabled={!selectedUser}
                    />
                    <select
                        className={styles.select}
                        value={editRole}
                        onChange={(e) => setEditRole(Number(e.target.value))}
                        disabled={!selectedUser}
                    >
                        <option value={1}>Administrador</option>
                        <option value={2}>Entrenador</option>
                        <option value={3}>Jugador</option>
                    </select>
                    </div>
                    <div className={styles.buttonGroup}>
                        <button
                            className={styles.button}
                            onClick={updateUser}
                            disabled={!selectedUser}
                        >
                            Actualizar Usuario
                        </button>
                        <button
                            className={styles.button}
                            onClick={deleteUser}
                            disabled={!selectedUser}
                        >
                            Eliminar Usuario
                        </button>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>Asignar Jugador</h2>
                        <ul>
                            {jugadores.length === 0 ? (
                                <p>No hay jugadores disponibles para asignar.</p>
                                ) : (
                                jugadores.map((jugador) => (
                                <li key={jugador.id_mijugador}>
                                {jugador.name}
                                <button
                                onClick={() => assignJugador(jugador.id_mijugador)}
                                >
                                Asignar
                                </button>
                                </li>
                                ))
                            )}
                        </ul>
                        <button className={styles.button} onClick={closeModal}>
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Usuario;
