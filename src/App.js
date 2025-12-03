// src/App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import DocumentoList from './components/DocumentoList';
import UploadForm from './components/UploadForm';

const API_URL = 'http://localhost:8080/api/documentos';
const AGENTE_URL = 'http://localhost:9125'; // La URL de nuestro Agente Local

function App() {
  const [documentos, setDocumentos] = useState([]);
  const [error, setError] = useState(null);

  const fetchDocumentos = async () => {
    // ... (esta función no cambia)
    try {
      setError(null);
      const response = await axios.get(API_URL);
      setDocumentos(response.data);
    } catch (err) {
      setError('No se pudo conectar con el servidor.');
      console.error(err);
    }
  };
  
  useEffect(() => {
    fetchDocumentos();
  }, []);

  // --- ¡LA NUEVA FUNCIÓN DE FIRMA! ---
  const handleFirmar = async (documentoId) => {
    // 1. Pedir el PIN al usuario
    const pin = window.prompt("Por favor, introduce tu PIN del DNIe:");
    if (!pin) {
        alert("Proceso de firma cancelado.");
        return;
    }

    try {
        // 2. Obtener el hash del documento desde nuestro backend
       console.log(`Obteniendo DATOS para firma...`);
            // Llamamos al nuevo endpoint
            const responseDatos = await axios.get(`${API_URL}/${documentoId}/obtener-datos-firma`);
            const datosParaFirmar = responseDatos.data; 
            
            console.log("Enviando datos al Agente Local...");
            // Enviamos el PDF completo en Base64
            const responseAgente = await axios.post(`${AGENTE_URL}/firmar`, 
                { datosBase64: datosParaFirmar }, // Asegúrate que coincida con el DTO del Agente
                { headers: { 'X-PIN': pin } }
            );

        const { firmaBase64, certificadoBase64 } = responseAgente.data;

        // 4. Enviar la firma y el certificado de vuelta al backend para finalizar
        console.log("Finalizando firma con el backend...");
        await axios.post(`${API_URL}/${documentoId}/finalizar-firma`, {
            firmaBase64,
            certificadoBase64
        });

        // 5. Si todo fue exitoso, refrescar la lista de documentos
        alert("¡Documento firmado exitosamente!");
        fetchDocumentos();

    } catch (err) {
        console.error("Error durante el proceso de firma:", err);
        // Manejo de errores más específico
        if (err.response) {
            // El servidor respondió con un error (ej. firma inválida, PIN incorrecto)
            alert(`Error al firmar: ${err.response.data || err.message}`);
        } else if (err.request) {
            // La petición se hizo pero no hubo respuesta (ej. el Agente no está corriendo)
            alert("Error de comunicación. Asegúrate de que el Agente de Firma esté en ejecución.");
        } else {
            // Otro tipo de error
            alert(`Ocurrió un error inesperado: ${err.message}`);
        }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sistema de Firma de Documentos</h1>
      </header>
      <main style={{ padding: '20px' }}>
        <UploadForm onUploadSuccess={fetchDocumentos} /> 
        <hr style={{margin: '20px 0'}} />
        {/* Pasamos la nueva función handleFirmar como prop */}
        <DocumentoList 
            documentos={documentos} 
            error={error}
            onFirmar={handleFirmar} 
        />
      </main>
    </div>
  );
}

export default App;