
// src/components/UploadForm.js
import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/documentos';

// Este componente recibe una función 'onUploadSuccess' como "prop" desde su padre.
const UploadForm = ({ onUploadSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    // Esta función se ejecuta cada vez que el usuario selecciona un archivo.
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // Esta función se ejecuta cuando el usuario envía el formulario.
    const handleSubmit = async (event) => {
        event.preventDefault(); // Previene que la página se recargue

        if (!selectedFile) {
            setError('Por favor, selecciona un archivo primero.');
            return;
        }

        // Usamos FormData, que es el formato estándar para enviar archivos vía HTTP.
        const formData = new FormData();
        formData.append('archivo', selectedFile); // 'archivo' debe coincidir con el @RequestParam del backend

        setUploading(true);
        setError(null);

        try {
            await axios.post(`${API_URL}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Si la subida fue exitosa...
            alert('¡Archivo subido exitosamente!');
            setSelectedFile(null); // Limpiamos el selector de archivo
            onUploadSuccess(); // ¡Llamamos a la función del padre para que refresque la lista!

        } catch (err) {
            setError('Hubo un error al subir el archivo.');
            console.error(err);
        } finally {
            setUploading(false); // Terminamos el estado de "subiendo"
        }
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '20px' }}>
            <h3>Subir Nuevo Documento</h3>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit" disabled={uploading}>
                    {uploading ? 'Subiendo...' : 'Subir Archivo'}
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default UploadForm;