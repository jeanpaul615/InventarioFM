"use client";
import React, { useState } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Box,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useApi } from '../context/ApiContext';

interface AddProductProps {
  onAdd: () => void;
}

const AddProduct: React.FC<AddProductProps> = ({ onAdd }) => {
  const { baseUrl, token } = useApi(); // Obtener la URL base y el token desde el contexto
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    valor_comercial: 0,
    lista_1: 0,
    lista_2: 0,
    lista_3: 0,
    cantidad: 0,
    unidad: 'und',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Estados para el formulario de log de inventario
  const [material, setMaterial] = useState("");
  const [cantidadLog, setCantidadLog] = useState(1);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const tempErrors: { [key: string]: string } = {};
    if (!form.nombre) tempErrors.nombre = 'El nombre es obligatorio.';
    if (form.valor_comercial <= 0) tempErrors.valor_comercial = 'Debe ser mayor a 0.';
    if (form.lista_1 < 0) tempErrors.lista_1 = 'No puede ser negativo.';
    if (form.lista_2 < 0) tempErrors.lista_2 = 'No puede ser negativo.';
    if (form.lista_3 < 0) tempErrors.lista_3 = 'No puede ser negativo.';
    if (form.cantidad < 0) tempErrors.cantidad = 'No puede ser negativo.';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // handleSubmit para registrar ingreso en inventory-log
  const handleLogSubmit = async (materialParam: string, cantidadParam: number, tipoParam: 'nuevo' | 'suma' = 'suma') => {
    setSuccess("");
    setError("");
    try {
      // Obtener userId del localStorage
      let userId = null;
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const userObj = JSON.parse(userStr);
          userId = userObj.userId || userObj.id || null;
        }
      } catch (e) { userId = null; }
      const res = await fetch(`${baseUrl}/inventory-log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ material: materialParam, cantidad: cantidadParam, userId, tipo: 'nuevo' }), // tipo siempre 'nuevo'
      });
      if (!res.ok) throw new Error("Error al registrar ingreso");
      setSuccess("Ingreso registrado correctamente");
    } catch (err: any) {
      setError(err.message || "Error inesperado");
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      // Elimina valor_unitario antes de enviar al backend (ya no existe en el form)
      const productData = form;
      await handleLogSubmit(productData.nombre, productData.cantidad, 'nuevo'); // tipo 'nuevo' al crear producto
      await axios.post(`${baseUrl}/products`, productData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setOpen(false);
      onAdd();
      setForm({
        nombre: '',
        valor_comercial: 0,
        lista_1: 0,
        lista_2: 0,
        lista_3: 0,
        cantidad: 0,
        unidad: 'und',
      });
    } catch (error: any) {
      if (error.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        console.error('Error en la respuesta del servidor:', error.response.data);
        alert(`Error del servidor: ${error.response.data.message || 'Error desconocido'}`);
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        console.error('Error de red:', error.request);
        alert('No se pudo conectar con el servidor. Verifica tu conexión.');
      } else {
        // Algo pasó al configurar la solicitud
        console.error('Error:', error.message);
        alert(`Error al agregar el producto: ${error.message}`);
      }
    }
  };

  return (
    <div className="w-full">
      <Button
        variant="contained"
        fullWidth
        sx={{
          backgroundColor: '#4caf50',
          '&:hover': { backgroundColor: '#388e3c' },
          fontWeight: 'bold',
          fontSize: { xs: '0.875rem', sm: '1rem' },
          padding: { xs: '8px 16px', sm: '10px 20px' },
        }}
        onClick={() => setOpen(true)}
      >
        Agregar Producto
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={typeof window !== 'undefined' && window.innerWidth < 600}
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: 3 },
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
            margin: { xs: 0, sm: 2 },
            maxHeight: { xs: '100vh', sm: '90vh' },
          },
        }}
      >
        <DialogTitle sx={{ 
          px: { xs: 2, sm: 3 }, 
          py: { xs: 2, sm: 2.5 },
          borderBottom: '1px solid #e0e0e0'
        }}>
          <Typography 
            fontWeight="bold" 
            textAlign="center"
            fontSize={{ xs: '1.25rem', sm: '1.5rem' }}
          >
            Agregar Nuevo Producto
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ 
          px: { xs: 2, sm: 3 }, 
          py: { xs: 2, sm: 3 },
          overflowY: 'auto'
        }}>
          <Box component="form" noValidate autoComplete="off" sx={{ mt: { xs: 1, sm: 2 } }}>
            <Grid container spacing={{ xs: 2, sm: 2.5 }}>
              <Grid item xs={12}>
                <TextField
                  name="nombre"
                  label="Nombre"
                  fullWidth
                  value={form.nombre}
                  onChange={handleChange}
                  error={!!errors.nombre}
                  helperText={errors.nombre}
                  size="medium"
                  InputLabelProps={{
                    sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="valor_comercial"
                  label="Valor Comercial"
                  type="number"
                  fullWidth
                  value={form.valor_comercial}
                  onChange={handleChange}
                  error={!!errors.valor_comercial}
                  helperText={errors.valor_comercial}
                  size="medium"
                  InputLabelProps={{
                    sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  name="cantidad"
                  label="Cantidad"
                  type="number"
                  fullWidth
                  value={form.cantidad}
                  onChange={handleChange}
                  error={!!errors.cantidad}
                  helperText={errors.cantidad}
                  size="medium"
                  InputLabelProps={{
                    sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  name="unidad"
                  label="Unidad"
                  select
                  fullWidth
                  value={form.unidad}
                  onChange={handleChange}
                  size="medium"
                  SelectProps={{
                    native: true,
                  }}
                  InputLabelProps={{
                    sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
                  }}
                >
                  <option value="und">Und</option>
                  <option value="kg">Kg</option>
                  <option value="g">g</option>
                  <option value="lb">Lb</option>
                  <option value="oz">Oz</option>
                  <option value="m">m</option>
                  <option value="cm">cm</option>
                  <option value="mm">mm</option>
                  <option value="l">L</option>
                  <option value="ml">mL</option>
                  <option value="gal">Gal</option>
                  <option value="caja">Caja</option>
                  <option value="paquete">Paquete</option>
                  <option value="rollo">Rollo</option>
                  <option value="par">Par</option>
                  <option value="docena">Docena</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  name="lista_1"
                  label="Lista 1"
                  type="number"
                  fullWidth
                  value={form.lista_1}
                  onChange={handleChange}
                  error={!!errors.lista_1}
                  helperText={errors.lista_1}
                  size="medium"
                  InputLabelProps={{
                    sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  name="lista_2"
                  label="Lista 2"
                  type="number"
                  fullWidth
                  value={form.lista_2}
                  onChange={handleChange}
                  error={!!errors.lista_2}
                  helperText={errors.lista_2}
                  size="medium"
                  InputLabelProps={{
                    sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  name="lista_3"
                  label="Lista 3"
                  type="number"
                  fullWidth
                  value={form.lista_3}
                  onChange={handleChange}
                  error={!!errors.lista_3}
                  helperText={errors.lista_3}
                  size="medium"
                  InputLabelProps={{
                    sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          px: { xs: 2, sm: 3 }, 
          py: { xs: 2, sm: 2.5 },
          gap: { xs: 1, sm: 2 },
          flexDirection: { xs: 'column', sm: 'row' },
          borderTop: '1px solid #e0e0e0'
        }}>
          <Button
            onClick={() => setOpen(false)}
            fullWidth
            sx={{
              color: '#f44336',
              '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' },
              fontSize: { xs: '0.9rem', sm: '1rem' },
              py: { xs: 1.5, sm: 1 },
              order: { xs: 2, sm: 1 }
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#4caf50',
              '&:hover': { backgroundColor: '#388e3c' },
              fontSize: { xs: '0.9rem', sm: '1rem' },
              py: { xs: 1.5, sm: 1 },
              order: { xs: 1, sm: 2 }
            }}
          >
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddProduct;