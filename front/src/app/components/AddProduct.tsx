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
  const { baseUrl } = useApi(); // Obtener la URL base desde el contexto
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    valor_comercial: 0,
    valor_unitario: 0,
    lista_1: 0,
    lista_2: 0,
    lista_3: 0,
    cantidad: 0,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const tempErrors: { [key: string]: string } = {};
    if (!form.nombre) tempErrors.nombre = 'El nombre es obligatorio.';
    if (form.valor_comercial <= 0) tempErrors.valor_comercial = 'Debe ser mayor a 0.';
    if (form.valor_unitario <= 0) tempErrors.valor_unitario = 'Debe ser mayor a 0.';
    if (form.lista_1 < 0) tempErrors.lista_1 = 'No puede ser negativo.';
    if (form.lista_2 < 0) tempErrors.lista_2 = 'No puede ser negativo.';
    if (form.lista_3 < 0) tempErrors.lista_3 = 'No puede ser negativo.';
    if (form.cantidad < 0) tempErrors.cantidad = 'No puede ser negativo.';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await axios.post(`${baseUrl}/products`, form);
      setOpen(false);
      onAdd();
      setForm({
        nombre: '',
        valor_comercial: 0,
        valor_unitario: 0,
        lista_1: 0,
        lista_2: 0,
        lista_3: 0,
        cantidad: 0,
      });
    } catch (error) {
      console.error('Error al agregar el producto:', error);
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        sx={{
          backgroundColor: '#4caf50',
          '&:hover': { backgroundColor: '#388e3c' },
          fontWeight: 'bold',
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
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold" textAlign="center">
            Agregar Nuevo Producto
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="nombre"
                  label="Nombre"
                  fullWidth
                  value={form.nombre}
                  onChange={handleChange}
                  error={!!errors.nombre}
                  helperText={errors.nombre}
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
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="valor_unitario"
                  label="Valor Unitario"
                  type="number"
                  fullWidth
                  value={form.valor_unitario}
                  onChange={handleChange}
                  error={!!errors.valor_unitario}
                  helperText={errors.valor_unitario}
                />
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
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="cantidad"
                  label="Cantidad"
                  type="number"
                  fullWidth
                  value={form.cantidad}
                  onChange={handleChange}
                  error={!!errors.cantidad}
                  helperText={errors.cantidad}
                />
              </Grid>
            </Grid>
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
            onClick={handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: '#4caf50',
              '&:hover': { backgroundColor: '#388e3c' },
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