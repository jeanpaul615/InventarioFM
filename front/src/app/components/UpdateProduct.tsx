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
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import axios from 'axios';
import { useApi } from '../context/ApiContext';

interface UpdateProductProps {
  product: {
    id: number;
    nombre: string;
    valor_comercial: number;
    valor_unitario: number;
    lista_1: number;
    lista_2: number;
    lista_3: number;
    cantidad: number;
  };
  onUpdate: () => void;
}

const UpdateProduct: React.FC<UpdateProductProps> = ({ product, onUpdate }) => {
  const { baseUrl } = useApi(); // Obtener la URL base desde el contexto
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(product);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name as string]: value });
  };

  const validate = () => {
    let tempErrors: { [key: string]: string } = {};
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
    if (validate()) {
      try {
        await axios.put(`${baseUrl}/products/${form.id}`, form);
        setOpen(false);
        onUpdate();
      } catch (error) {
        console.error('Error al actualizar el producto:', error);
      }
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        sx={{
          backgroundColor: '009bda',
          '&:hover': { backgroundColor: '#c0edff', boxShadow: 'none', borderColor: '#c0edff', color: '#009bda' },
          fontWeight: 'bold',
        }}
        onClick={() => setOpen(true)}
      >
        Editar Producto
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
              Editar Producto
            </Typography>
            <IconButton onClick={() => setOpen(false)}>
              <Close />
            </IconButton>
          </Box>
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
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UpdateProduct;