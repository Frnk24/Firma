// src/components/DocumentoList.js
import React from 'react';

const DocumentoList = ({ documentos, error, onFirmar }) => {
    
    // Función auxiliar para descargar
    const handleDescargar = (id) => {
        window.open(`http://localhost:8080/api/documentos/${id}/descargar-firma`, '_blank');
    };

    return (
        <div>
            <h2>Lista de Documentos</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <table border="1" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr>
                        <th style={{padding: '8px'}}>ID</th>
                        <th style={{padding: '8px'}}>Nombre del Archivo</th>
                        <th style={{padding: '8px'}}>Estado</th>
                        <th style={{padding: '8px'}}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {documentos.map(doc => (
                        <tr key={doc.id}>
                            <td style={{padding: '8px'}}>{doc.id}</td>
                            <td style={{padding: '8px'}}>{doc.nombreArchivo}</td>
                            
                            {/* Columna de ESTADO (Solo muestra el texto y color) */}
                            <td style={{padding: '8px'}}>
                                <span style={{ color: doc.estado === 'FIRMADO' ? 'green' : 'orange', fontWeight: 'bold' }}>
                                    {doc.estado}
                                </span>
                            </td>
                            
                            {/* Columna de ACCIONES (Aquí van los botones) */}
                            <td style={{padding: '8px'}}>
                                {/* Botón Firmar (Solo si está pendiente) */}
                                {doc.estado === 'PENDIENTE' && (
                                    <button onClick={() => onFirmar(doc.id)}>
                                        Firmar
                                    </button>
                                )}

                                {/* Botón Descargar (Solo si está firmado) */}
                                {doc.estado === 'FIRMADO' && (
                                    <button onClick={() => handleDescargar(doc.id)}>
                                        Descargar (.p7s)
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DocumentoList;