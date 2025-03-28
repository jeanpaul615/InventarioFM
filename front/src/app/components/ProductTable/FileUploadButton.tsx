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
    formData.append('file', file); // Agregar el archivo al FormData

    try {
      const response = await fetch(`${baseUrl}/products/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cargar el archivo.');
      }

      // Verificar si la respuesta es JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        console.log('Respuesta del servidor:', result);
        alert(result.message || 'Archivo cargado exitosamente.');
      } else {
        const text = await response.text();
        console.log('Respuesta del servidor (texto):', text);
        Swal.fire({
          title: 'Operación Completada',
          text: text || 'El archivo se ha cargado exitosamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#4caf50',
        });
      }
    } catch (error: any) {
      console.error('Error:', error.message);
      alert(`Hubo un error al cargar el archivo: ${error.message}`);
    } finally {
      setLoading(false);
      setOpen(false);
      setFile(null); // Limpiar el archivo seleccionado
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