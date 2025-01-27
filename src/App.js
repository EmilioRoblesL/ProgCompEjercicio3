import React, { useEffect, useState } from 'react';
import './App.css';
import Formulario from './components/Formulario'; // Componente para gestionar el formulario de usuarios
import Login from './pages/Login'; // Componente de inicio de sesión y registro
import UploadFile from './components/UploadFile'; // Componente para subir archivos
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'; // Métodos de autenticación de Firebase

function App() {
  const [user, setUser] = useState(null); // Estado para almacenar la información del usuario actual

  // Hook para detectar cambios en el estado de autenticación
  useEffect(() => {
    const auth = getAuth(); // Obtiene la instancia de autenticación de Firebase
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Listener que se ejecuta cuando cambia el estado del usuario autenticado
      setUser(currentUser); // Actualiza el estado con el usuario actual (o null si no hay sesión)
    });
    return () => unsubscribe(); // Limpia el listener cuando se desmonta el componente
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    const auth = getAuth(); // Obtiene la instancia de autenticación de Firebase
    signOut(auth)
      .then(() => {
        console.log('Usuario ha cerrado sesión');
        setUser(null); // Limpia el estado del usuario al cerrar sesión
      })
      .catch((error) => {
        console.error('Error al cerrar sesión:', error); // Maneja errores al cerrar sesión
      });
  };

  return (
    <div className="App">
      <h1>Gestión de Usuarios y Archivos</h1>
      {user ? (
        // Si el usuario está autenticado, muestra los componentes protegidos
        <div>
          <Formulario /> {/* Componente para gestionar un formulario de usuarios */}
          <UploadFile /> {/* Componente para subir archivos */}
          <button
            style={{
              padding: '10px',
              width: '360px',
              backgroundColor: 'red', // Botón con estilo personalizado
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginBottom: '10px',
            }}
            onClick={handleLogout} // Llama a la función de cerrar sesión
          >
            Cerrar sesión
          </button>
        </div>
      ) : (
        // Si no hay usuario autenticado, muestra el componente de Login
        <Login onLogin={(user) => setUser(user)} /> // Pasa la función para actualizar el estado del usuario al iniciar sesión
      )}
    </div>
  );
}

export default App; // Exporta el componente principal de la aplicación
