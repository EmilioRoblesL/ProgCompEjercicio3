import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const UploadFile = () => {
  // Estado para almacenar el archivo seleccionado
  const [file, setFile] = useState(null);

  // Estado para almacenar la URL del archivo subido
  const [url, setUrl] = useState('');

  // Inicializar Firebase Storage
  const storage = getStorage();

  // Manejador para capturar el archivo seleccionado por el usuario
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Almacena el archivo seleccionado en el estado
  };

  // Manejador para subir el archivo a Firebase Storage
  const handleUpload = async () => {
    if (file) { // Verifica que se haya seleccionado un archivo
      const storageRef = ref(storage, `uploads/${file.name}`); // Crea una referencia en Firebase Storage con el nombre del archivo

      try {
        // Sube el archivo a Firebase Storage
        await uploadBytes(storageRef, file);

        // Obtiene la URL de descarga del archivo subido
        const downloadURL = await getDownloadURL(storageRef);

        // Almacena la URL en el estado y muestra en consola
        setUrl(downloadURL);
        console.log('Archivo cargado correctamente:', downloadURL);
      } catch (error) {
        // Muestra un error si ocurre durante la subida
        console.error('Error al subir el archivo:', error);
      }
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Input para seleccionar el archivo */}
      <input
        style={{
          width: '20%',
          padding: '10px',
          marginBottom: '10px',
          border: '1px solid #ccc',
          borderRadius: '5px',
        }}
        type="file"
        onChange={handleFileChange} // Llama al manejador cuando se selecciona un archivo
      />

      {/* Botón para subir el archivo */}
      <button
        style={{
          padding: '10px',
          width: '360px',
          background: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '10px',
        }}
        onClick={handleUpload} // Llama al manejador cuando se hace clic
      >
        Subir archivo
      </button>

      {/* Mostrar la URL del archivo subido, si existe */}
      {url && (
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <p>Archivo disponible en:</p>
          <a href={url} target="_blank" rel="noopener noreferrer">
            {url} {/* Enlace clickeable para abrir el archivo */}
          </a>
        </div>
      )}
    </div>
  );
};

export default UploadFile;
