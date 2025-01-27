import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebase'; // Archivo de configuración de Firebase

const Login = ({ onLogin }) => {
  // Estados para manejar datos del formulario, el modo (login/registro) y mensajes de error
  const [formData, setFormData] = useState({
    email: '', // Correo electrónico ingresado por el usuario
    password: '', // Contraseña ingresada por el usuario
    confirmPassword: '', // Confirmación de la contraseña (solo en registro)
  });
  const [isLogin, setIsLogin] = useState(true); // Controla si el formulario está en modo "Iniciar Sesión" o "Registro"
  const [error, setError] = useState(''); // Almacena errores para mostrarlos al usuario
  const auth = getAuth(); // Instancia de Firebase Authentication

  // Función que actualiza el estado formData al cambiar los inputs
  const handleChange = (e) => {
    setFormData({
      ...formData, // Mantiene los valores actuales de los campos
      [e.target.name]: e.target.value, // Actualiza solo el campo correspondiente
    });
  };

  // Valida el formulario antes de enviarlo
  const validateForm = () => {
    if (!isLogin) {
      // Si está en modo registro, verifica que las contraseñas coincidan
      if (formData.password !== formData.confirmPassword) {
        return 'Las contraseñas no coinciden.';
      }
    }
    return null; // No hay errores
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita la recarga de la página al enviar el formulario
    setError(''); // Limpia errores anteriores

    // Valida el formulario
    const validationError = validateForm();
    if (validationError) {
      setError(validationError); // Muestra el error si las contraseñas no coinciden
      return;
    }

    try {
      if (isLogin) {
        // Lógica para iniciar sesión
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        onLogin(userCredential.user); // Notifica al componente padre que el usuario ha iniciado sesión
        console.log('Inicio de sesión exitoso');
      } else {
        // Lógica para registrar un nuevo usuario
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const userId = userCredential.user.uid; // Obtiene el ID único del usuario registrado

        // Guarda el correo electrónico en Firestore bajo la colección "usuarios"
        await setDoc(doc(collection(db, 'usuarios'), userId), {
          email: formData.email, // Almacena solo el correo electrónico
        });

        onLogin(userCredential.user); // Notifica al componente padre que el usuario se ha registrado
        console.log('Registro exitoso y datos guardados en Firestore');
      }
    } catch (err) {
      setError(err.message); // Muestra cualquier error ocurrido durante el inicio de sesión o registro
    }
  };

  return (
    <div className="login-container">
      <h2>{isLogin ? 'Iniciar Sesión' : 'Registro'}</h2> {/* Cambia el título según el modo */}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange} // Actualiza el estado al escribir
          required // Hace que el campo sea obligatorio
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange} // Actualiza el estado al escribir
          required // Hace que el campo sea obligatorio
        />
        {!isLogin && (
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar contraseña"
            value={formData.confirmPassword}
            onChange={handleChange} // Actualiza el estado al escribir
            required // Hace que el campo sea obligatorio solo en modo registro
          />
        )}
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Muestra errores si existen */}
        <button type="submit" className="btn-submit">
          {isLogin ? 'Iniciar Sesión' : 'Registrarse'} {/* Cambia el texto del botón según el modo */}
        </button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)} className="btn-toggle">
        {/* Cambia entre los modos "Iniciar Sesión" y "Registro" */}
        {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
      </button>
    </div>
  );
};

export default Login;
