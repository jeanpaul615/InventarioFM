import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Upload, Close } from '@mui/icons-material';
import { useApi } from '../../context/ApiContext';
import Swal from 'sweetalert2';

interface FileUploadModalProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({ onFileUpload }) => {
  const { baseUrl } = useApi(); // Obtener la URL base desde el contexto
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]); // Guardar el archivo seleccionado en el estado
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${baseUrl}/products/upload`, {
        method: 'POST',
        body: formData,
      });

      // Procesar respuesta del backend
      const contentType = response.headers.get('content-type');
      let resultMessage = '';
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        resultMessage = result.message || 'Archivo cargado exitosamente.';
        if (response.ok) {
          Swal.fire({
            title: 'Operación Completada',
            text: resultMessage,
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#4caf50',
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: resultMessage,
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#d32f2f',
          });
        }
      } else {
        const text = await response.text();
        if (response.ok) {
          Swal.fire({
            title: 'Operación Completada',
            text: text || 'El archivo se ha cargado exitosamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#4caf50',
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: text || 'Error al cargar el archivo.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#d32f2f',
          });
        }
      }
    } catch (error: any) {
      console.error('Error:', error.message);
      Swal.fire({
        title: 'Error',
        text: `Hubo un error al cargar el archivo: ${error.message}`,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#d32f2f',
      });
    } finally {
      setLoading(false);
      setOpen(false);
      setFile(null);
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Upload />}
        onClick={() => setOpen(true)}
        sx={{fontWeight: 'bold',
          backgroundColor: '#f9f4f4',
          borderColor: '#050371',
          color: '#8c7c0b',
          '&:hover': { backgroundColor: '#161621', boxShadow: 'none', borderColor: '#161621', color: '#f9f4f4'},
        }}
      >
        Cargar Archivo
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              Subir Archivo Excel
            </Typography>
            <IconButton onClick={() => setOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ textAlign: 'center', py: 2 }}
          >
            <Typography variant="body1" sx={{ mb: 2 }}>
              Selecciona un archivo Excel para cargar los datos.
            </Typography>
            {/* Espacio para la plantilla */}
            <Box
              sx={{
                mb: 2,
                p: 2,
                border: '1px dashed #bdbdbd',
                borderRadius: 2,
                background: '#f9fafb',
                width: '100%',
                maxWidth: 400,
              }}
            >
              <Typography variant="subtitle2" color="primary" fontWeight="bold" sx={{ mb: 1 }}>
                Plantilla requerida:
              </Typography>
              <Box sx={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                  <thead>
                    <tr style={{ background: '#e3e6f0' }}>
                      <th style={{ border: '1px solid #cfd8dc', padding: '4px' }}>nombre</th>
                      <th style={{ border: '1px solid #cfd8dc', padding: '4px' }}>valor_comercial</th>
                      <th style={{ border: '1px solid #cfd8dc', padding: '4px' }}>valor_unitario</th>
                      <th style={{ border: '1px solid #cfd8dc', padding: '4px' }}>lista_1</th>
                      <th style={{ border: '1px solid #cfd8dc', padding: '4px' }}>lista_2</th>
                      <th style={{ border: '1px solid #cfd8dc', padding: '4px' }}>lista_3</th>
                      <th style={{ border: '1px solid #cfd8dc', padding: '4px' }}>cantidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ border: '1px solid #cfd8dc', padding: '4px' }}>Producto A</td>
                      <td style={{ border: '1px solid #cfd8dc', padding: '4px' }}>10000</td>
                      <td style={{ border: '1px solid #cfd8dc', padding: '4px' }}>8000</td>
                      <td style={{ border: '1px solid #cfd8dc', padding: '4px' }}>9500</td>
                      <td style={{ border: '1px solid #cfd8dc', padding: '4px' }}>9000</td>
                      <td style={{ border: '1px solid #cfd8dc', padding: '4px' }}>8500</td>
                      <td style={{ border: '1px solid #cfd8dc', padding: '4px' }}>50</td>
                    </tr>
                  </tbody>
                </table>
              </Box>
              <Button
                href="/plantilla.xlsx" // Cambia esto a la URL de tu plantilla
                target="_blank"
                download
                variant="outlined"
                size="small"
                sx={{ mt: 1, borderColor: '#1976d2', color: '#1976d2' }}
              >
                Descargar plantilla
              </Button>
            </Box>
            {/* Fin espacio plantilla */}
            <Button
              variant="outlined"
              component="label"
              startIcon={<Upload />}
              sx={{
                borderColor: '#4caf50',
                color: '#4caf50',
                '&:hover': { borderColor: '#388e3c', color: '#388e3c' },
              }}
            >
              Seleccionar Archivo
              <input
                type="file"
                hidden
                accept=".xlsx, .xls"
                onChange={handleFileChange}
              />
            </Button>
            {file && (
              <Typography
                variant="body2"
                sx={{ mt: 2, color: 'gray', fontStyle: 'italic' }}
              >
                Archivo seleccionado: {file.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpen(false)}
            sx={{
              color: '#f44336',
              '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={!file || loading}
            sx={{
              backgroundColor: '#4caf50',
              '&:hover': { backgroundColor: '#388e3c' },
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Subir'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FileUploadModal;