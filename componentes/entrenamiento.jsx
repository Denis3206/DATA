import React, { useState, useEffect } from 'react';
import { supabase } from './config/client'; // Asegúrate de importar tu cliente Supabase
import Navbar from './navbar';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../style/entrenamiento.css';

const Entrenamiento = () => {
  const [jugadores, setJugadores] = useState([]);
  const [rutina, setRutina] = useState({ tipoEntrenamiento: '', fecha: '', tipoComida: '', horaComida: '' });
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);
  const [listaRutinas, setListaRutinas] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga

  const navigate = useNavigate();

  const [jugadorId, setJugadorId] = useState(null); // Estado para almacenar el id del jugador

  useEffect(() => {
    const fetchUser = () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      console.log('Usuario cargado:', storedUser);
      setUser(storedUser);
      return storedUser;
    };
  
    const fetchData = async () => {
      const fetchedUser = fetchUser();
  
      if (fetchedUser) {
        const { data: jugadoresData, error: jugadoresError } = await supabase
          .from('miequipo')
          .select('*');

        if (jugadoresError) {
          console.error('Error al obtener jugadores:', jugadoresError);
        } else {
          setJugadores(jugadoresData);
        }

        // Obtener el id_mijugador del usuario
        const { data: miequipoData, error: miequipoError } = await supabase
          .from('miequipo')
          .select('id_mijugador')
          .eq('id_users', fetchedUser.id_users)
          .single();

        if (miequipoError) {
          if (miequipoError.code === 'PGRST116') {
            console.warn('No se encontró el id del jugador. Asegúrate de que el usuario tenga jugadores asignados.');
          } else {
            console.error('Error al obtener el id del jugador:', miequipoError);
          }
        } else {
          setJugadorId(miequipoData.id_mijugador);
        }

        
        // Obtener rutinas
        const { data: rutinasData, error: rutinasError } = await supabase
          .from('routines')
          .select(`id_rutina, id_mijugador, tipo_entrenamiento, fecha, tipo_comida, hora_comida, estado, miequipo ( name )`);
  
        if (rutinasError) console.error('Error al obtener rutinas:', rutinasError);
        else setListaRutinas(rutinasData);

          setLoading(false); // Cambia el estado de carga a false
        } else {
          setLoading(false); // Cambia el estado de carga a false
        }
        
    };
  
    fetchData();
  }, []);

  // Aquí puedes retornar un mensaje de carga mientras `loading` es true
  if (loading) {
    return <div>Cargando...</div>;
  }

  const handleJugadorSelect = (e) => {
    const selectedJugador = jugadores.find(jugador => jugador.id_mijugador === parseInt(e.target.value));
    setJugadorSeleccionado(selectedJugador);
  };

  const handleRutinaChange = (e) => {
    const { name, value } = e.target;
    setRutina((prev) => ({ ...prev, [name]: value }));
  };

  const handleRutinaSubmit = async (e) => {
    e.preventDefault();

    if (!rutina.tipoEntrenamiento || !rutina.fecha || !rutina.tipoComida || !rutina.horaComida || !jugadorSeleccionado) {
      alert("Todos los campos son obligatorios");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('routines') // Tabla donde guardas las rutinas
        .insert([{
            id_mijugador: jugadorSeleccionado.id_mijugador,
            tipo_entrenamiento: rutina.tipoEntrenamiento,
            fecha: rutina.fecha,
            tipo_comida: rutina.tipoComida,
            hora_comida: rutina.horaComida,
            estado: "Pendiente" // Inicialmente, no está confirmada
        }]);

      if (error) throw error;

      // Actualiza la lista local
      const nuevaRutina = {
        id_mijugador: jugadorSeleccionado.id_mijugador, // Asegúrate de que este campo esté presente
        miequipo: { name: jugadorSeleccionado.name }, // Asegúrate de que 'miequipo' esté present
        tipo_entrenamiento: rutina.tipoEntrenamiento,
        fecha: rutina.fecha,
        tipo_comida: rutina.tipoComida,
        hora_comida: rutina.horaComida,
        estado: "Pendiente" // Asegúrate de incluir el estado correcto
      };

      // Actualiza la lista local
      setListaRutinas((prev) => [...prev, nuevaRutina]);
      setRutina({ tipoEntrenamiento: '', fecha: '', tipoComida: '', horaComida: '' });
    } catch (error) {
      console.error("Error al agregar rutina:", error);
    }
  };

  const handleConfirmarRutina = async (rutinaId) => {
    try {
      const { data, error } = await supabase
        .from('routines') // Tabla de rutinas
        .update({ estado: 'Realizado' }) // Actualiza el estado a 'Realizado'
        .eq('id_rutina', rutinaId); // Asegúrate de que 'id_rutina' sea el campo correcto

      if (error) throw error;

      // Actualiza la lista local tras la confirmación
      setListaRutinas(prev => prev.map(rutina => rutina.id_rutina === rutinaId ? { ...rutina, estado: 'Realizado' } : rutina));
    } catch (error) {
      console.error("Error al confirmar rutina:", error);
    }
  };

  return (
    <div>
      <Navbar user={user} />
      <button className="back-button" onClick={() => navigate('/dashboard')}>
        <FaArrowLeft /> Regresar al Dashboard
      </button>

      <div className="entrenamiento-container">
        <h2 className="entrenamiento-title">Sección de Entrenamiento</h2>

        {/* Si el usuario es entrenador */}
        {user?.role === 2 && (
          <div>
            <form className="rutina-form" onSubmit={handleRutinaSubmit}>
              <div className="form-group">
                <label className="form-label">
                  Seleccionar Jugador:
                  <select className="form-input" onChange={handleJugadorSelect}>
                    <option value="">Seleccione un jugador</option>
                    {jugadores.map((jugador) => (
                      <option key={jugador.id_mijugador} value={jugador.id_mijugador}>{jugador.name}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Tipo de Entrenamiento:
                  <input
                    className="form-input"
                    type="text"
                    name="tipoEntrenamiento"
                    value={rutina.tipoEntrenamiento}
                    onChange={handleRutinaChange}
                  />
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Fecha:
                  <input
                    className="form-input"
                    type="date"
                    name="fecha"
                    value={rutina.fecha}
                    onChange={handleRutinaChange}
                  />
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Tipo de Comida:
                  <input
                    className="form-input"
                    type="text"
                    name="tipoComida"
                    value={rutina.tipoComida}
                    onChange={handleRutinaChange}
                  />
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Hora de Comida:
                  <input
                    className="form-input"
                    type="time"
                    name="horaComida"
                    value={rutina.horaComida}
                    onChange={handleRutinaChange}
                  />
                </label>
              </div>
              <button className="submit-button" type="submit">Asignar Rutina</button>
            </form>

            <h3 className="assigned-training-title">Todas las Rutinas Asignadas</h3>
            <table className="rutinas-table">
              <thead>
                <tr>
                  <th>Jugador</th>
                  <th>Tipo de Entrenamiento</th>
                  <th>Fecha</th>
                  <th>Tipo de Comida</th>
                  <th>Hora de Comida</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {listaRutinas.map((rutina, index) => (
                  <tr key={index}>
                    <td>{rutina.miequipo?.name || 'Jugador no encontrado'}</td>
                    <td>{rutina.tipo_entrenamiento}</td>
                    <td>{rutina.fecha}</td>
                    <td>{rutina.tipo_comida}</td>
                    <td>{rutina.hora_comida}</td>
                    <td><span>{rutina.estado}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Si el usuario es jugador */}
        {user?.role === 3 &&(
          <div>
            <h3 className="assigned-training-title">Mis Rutinas Asignadas</h3>
            <table className="rutinas-table">
              <thead>
                <tr>
                  <th>Tipo de Entrenamiento</th>
                  <th>Fecha</th>
                  <th>Tipo de Comida</th>
                  <th>Hora de Comida</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {listaRutinas.filter(rutina => rutina.id_mijugador === jugadorId).map((rutina, index) => (
                  <tr key={index}>
                    <td>{rutina.tipo_entrenamiento}</td>
                    <td>{rutina.fecha}</td>
                    <td>{rutina.tipo_comida}</td>
                    <td>{rutina.hora_comida}</td>
                    <td>
                      {rutina.estado === 'Pendiente' ? (
                        <button className="confirm-button" onClick={() => handleConfirmarRutina(rutina.id_rutina)}>Confirmar</button>
                      ) : (
                        <span>{rutina.estado}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Entrenamiento;