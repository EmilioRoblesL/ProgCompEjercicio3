import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase'; // Importamos la configuración de Firebase

const Formulario = () => {
  // Estado para manejar los datos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    rut: '',
    celular: '',
  });

  // Estado para manejar errores de validación
  const [errors, setErrors] = useState({});

  // Estado para manejar mensajes de éxito y error
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Validación del formulario
  const validate = () => {
    const newErrors = {}; // Objeto para guardar los errores

    // Validar si el nombre está vacío
    if (!formData.nombre) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    // Validar si el apellido está vacío
    if (!formData.apellido) {
      newErrors.apellido = 'El apellido es obligatorio';
    }

    // Validar si el RUT tiene un formato válido
    if (!formData.rut) {
      newErrors.rut = 'El RUT es obligatorio';
    } else if (!/^\d{7,8}-[\dkK]$/.test(formData.rut)) {
      newErrors.rut = 'El RUT debe tener un formato válido (12345678-9 o 12345678-K)';
    }

    // Validar si el celular tiene un formato válido
    if (!formData.celular) {
      newErrors.celular = 'El celular es obligatorio';
    } else if (!/^\+569\d{8}$/.test(formData.celular)) {
      newErrors.celular = 'El celular debe comenzar con +569 seguido de 8 dígitos';
    }

    // Actualizar el estado de errores
    setErrors(newErrors);

    // Retornar true si no hay errores, de lo contrario false
    return Object.keys(newErrors).length === 0;
  };

  // Manejador de cambios en los inputs del formulario
  const handleChange = (e) => {
    // Actualizar el estado de formData con el valor del campo correspondiente
    setFormData({
      ...formData,
      [e.target.name]: e.target.value, // Actualiza el campo por su nombre
    });
  };

  // Manejador del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    setSuccessMessage(''); // Limpiar mensajes previos de éxito
    setErrorMessage(''); // Limpiar mensajes previos de error

    if (validate()) { // Validar el formulario antes de enviarlo
      try {
        // Agregar los datos a la colección 'usuarios' en Firestore
        await addDoc(collection(db, 'usuarios'), formData);

        // Mostrar mensaje de éxito y limpiar el formulario
        setSuccessMessage('Registro exitoso. Los datos se han guardado en Firestore.');
        setFormData({
          nombre: '',
          apellido: '',
          rut: '',
          celular: '',
        });

        // Limpiar los errores
        setErrors({});
      } catch (error) {
        console.error('Error al guardar los datos:', error);

        // Mostrar mensaje de error si falla la operación
        setErrorMessage('Hubo un error al guardar los datos. Por favor, inténtalo nuevamente.');
      }
    }
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: 'auto',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        background: '#f9f9f9',
      }}
    >
      <h2>Registro de Usuario</h2>
      {/* Mostrar mensaje de éxito si existe */}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {/* Mostrar mensaje de error si existe */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          {/* Input para el nombre */}
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
          />
          {/* Mostrar error del campo nombre */}
          {errors.nombre && <p style={{ color: 'red' }}>{errors.nombre}</p>}
        </div>
        <div>
          {/* Input para el apellido */}
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            placeholder="Apellido"
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
          />
          {/* Mostrar error del campo apellido */}
          {errors.apellido && <p style={{ color: 'red' }}>{errors.apellido}</p>}
        </div>
        <div>
          {/* Input para el RUT */}
          <input
            type="text"
            name="rut"
            value={formData.rut}
            onChange={handleChange}
            placeholder="RUT (sin puntos, con guion)"
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
          />
          {/* Mostrar error del campo RUT */}
          {errors.rut && <p style={{ color: 'red' }}>{errors.rut}</p>}
        </div>
        <div>
          {/* Input para el celular */}
          <input
            type="tel"
            name="celular"
            value={formData.celular}
            onChange={handleChange}
            placeholder="Celular (+569...)"
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
          />
          {/* Mostrar error del campo celular */}
          {errors.celular && <p style={{ color: 'red' }}>{errors.celular}</p>}
        </div>
        {/* Botón para enviar el formulario */}
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            background: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '10px',
          }}
        >
          Registrar
        </button>
      </form>
    </div>
  );
};

export default Formulario;
