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
            borderRadius: 6,
            boxShadow: '0px 12px 40px 0px rgba(30,41,59,0.22)',
            background: 'linear-gradient(135deg, #f0f4f8 70%, #e3f2fd 100%)',
            border: '2px solid #90caf9',
            p: 0.5,
            minWidth: 420,
          },
        }}
      >
        <DialogTitle sx={{
          p: 0,
          background: 'linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)',
          color: '#fff',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          minHeight: 70,
          display: 'flex',
          alignItems: 'center',
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" px={3} py={2}>
            <Typography variant="h5" fontWeight={900} letterSpacing={1} sx={{ textShadow: '0 2px 8px #1565c055' }}>
              ✏️ Editar Producto 
            </Typography>
            <IconButton onClick={() => setOpen(false)} sx={{ color: '#fff', bgcolor: '#1976d2', '&:hover': { bgcolor: '#1565c0' } }}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 4, background: '#f8fafc', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
          <Box component="form" noValidate autoComplete="off" sx={{ mt: 1 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  name="nombre"
                  label="Nombre"
                  fullWidth
                  value={form.nombre}
                  onChange={handleChange}
                  error={!!errors.nombre}
                  helperText={errors.nombre}
                  sx={{ background: '#fff', borderRadius: 2, boxShadow: '0 1px 4px #e3eafc33' }}
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
                  sx={{ background: '#fff', borderRadius: 2, boxShadow: '0 1px 4px #e3eafc33' }}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  name="lista_1"
                  label="Lista 1"
                  type="number"
                  fullWidth
                  value={form.lista_1}
                  onChange={handleChange}
                  error={!!errors.lista_1}
                  helperText={errors.lista_1}
                  sx={{ background: '#fff', borderRadius: 2, boxShadow: '0 1px 4px #e3eafc33' }}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  name="lista_2"
                  label="Lista 2"
                  type="number"
                  fullWidth
                  value={form.lista_2}
                  onChange={handleChange}
                  error={!!errors.lista_2}
                  helperText={errors.lista_2}
                  sx={{ background: '#fff', borderRadius: 2, boxShadow: '0 1px 4px #e3eafc33' }}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  name="lista_3"
                  label="Lista 3"
                  type="number"
                  fullWidth
                  value={form.lista_3}
                  onChange={handleChange}
                  error={!!errors.lista_3}
                  helperText={errors.lista_3}
                  sx={{ background: '#fff', borderRadius: 2, boxShadow: '0 1px 4px #e3eafc33' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="cantidad"
                  label="Cantidad"
                  type="number"
                  fullWidth
                  value={form.cantidad}
                  onChange={handleChange}
                  error={!!errors.cantidad}
                  helperText={errors.cantidad}
                  sx={{ background: '#fff', borderRadius: 2, boxShadow: '0 1px 4px #e3eafc33' }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 3, pt: 2, background: '#f0f4f8', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
          <Button
            onClick={() => setOpen(false)}
            sx={{
              color: '#f44336',
              fontWeight: 700,
              borderRadius: 2,
              px: 2.5,
              fontSize: 16,
              '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.08)' },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              background: 'linear-gradient(90deg, #43a047 60%, #81c784 100%)',
              fontWeight: 700,
              borderRadius: 2,
              px: 3,
              fontSize: 16,
              boxShadow: '0 2px 8px #43a04733',
              letterSpacing: 1,
              '&:hover': { background: 'linear-gradient(90deg, #388e3c 60%, #66bb6a 100%)' },
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