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
    unidad?: string;
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
        fullScreen={typeof window !== 'undefined' && window.innerWidth < 600}
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: 6 },
            boxShadow: '0px 12px 40px 0px rgba(30,41,59,0.22)',
            background: 'linear-gradient(135deg, #f0f4f8 70%, #e3f2fd 100%)',
            border: { xs: 'none', sm: '2px solid #90caf9' },
            p: { xs: 0, sm: 0.5 },
            minWidth: { xs: 'auto', sm: 420 },
            margin: { xs: 0, sm: 2 },
            maxHeight: { xs: '100vh', sm: '90vh' },
          },
        }}
      >
        <DialogTitle sx={{
          p: 0,
          background: 'linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)',
          color: '#fff',
          borderTopLeftRadius: { xs: 0, sm: 24 },
          borderTopRightRadius: { xs: 0, sm: 24 },
          minHeight: { xs: 60, sm: 70 },
          display: 'flex',
          alignItems: 'center',
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" px={{ xs: 2, sm: 3 }} py={{ xs: 1.5, sm: 2 }}>
            <Typography 
              variant="h5" 
              fontWeight={900} 
              letterSpacing={1} 
              sx={{ 
                textShadow: '0 2px 8px #1565c055',
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }}
            >
              ✏️ Editar Producto 
            </Typography>
            <IconButton 
              onClick={() => setOpen(false)} 
              sx={{ 
                color: '#fff', 
                bgcolor: '#1976d2', 
                '&:hover': { bgcolor: '#1565c0' },
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 }
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ 
          p: { xs: 2, sm: 4 }, 
          background: '#f8fafc', 
          borderBottomLeftRadius: { xs: 0, sm: 24 }, 
          borderBottomRightRadius: { xs: 0, sm: 24 },
          overflowY: 'auto'
        }}>
          <Box component="form" noValidate autoComplete="off" sx={{ mt: 1 }}>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
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
                  size="medium"
                  sx={{ background: '#fff', borderRadius: 2, boxShadow: '0 1px 4px #e3eafc33' }}
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
                  sx={{ background: '#fff', borderRadius: 2, boxShadow: '0 1px 4px #e3eafc33' }}
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
                  value={form.unidad || 'und'}
                  onChange={handleChange}
                  SelectProps={{
                    native: true,
                  }}
                  size="medium"
                  sx={{ background: '#fff', borderRadius: 2, boxShadow: '0 1px 4px #e3eafc33' }}
                  InputLabelProps={{
                    sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
                  }}
                >
                  <option value="und">und</option>
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="lb">lb</option>
                  <option value="oz">oz</option>
                  <option value="m">m</option>
                  <option value="cm">cm</option>
                  <option value="mm">mm</option>
                  <option value="l">l</option>
                  <option value="ml">ml</option>
                  <option value="gal">gal</option>
                  <option value="caja">caja</option>
                  <option value="paquete">paquete</option>
                  <option value="rollo">rollo</option>
                  <option value="par">par</option>
                  <option value="docena">docena</option>
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
                  sx={{ background: '#fff', borderRadius: 2, boxShadow: '0 1px 4px #e3eafc33' }}
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
                  sx={{ background: '#fff', borderRadius: 2, boxShadow: '0 1px 4px #e3eafc33' }}
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
                  sx={{ background: '#fff', borderRadius: 2, boxShadow: '0 1px 4px #e3eafc33' }}
                  InputLabelProps={{
                    sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          px: { xs: 2, sm: 4 }, 
          pb: { xs: 2, sm: 3 }, 
          pt: { xs: 1.5, sm: 2 }, 
          background: '#f0f4f8', 
          borderBottomLeftRadius: { xs: 0, sm: 24 }, 
          borderBottomRightRadius: { xs: 0, sm: 24 },
          gap: { xs: 1, sm: 2 },
          flexDirection: { xs: 'column', sm: 'row' },
          borderTop: '1px solid #e0e0e0'
        }}>
          <Button
            onClick={() => setOpen(false)}
            fullWidth
            sx={{
              color: '#f44336',
              fontWeight: 700,
              borderRadius: 2,
              px: { xs: 2, sm: 2.5 },
              py: { xs: 1.5, sm: 1 },
              fontSize: { xs: '0.9rem', sm: 16 },
              '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.08)' },
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
              background: 'linear-gradient(90deg, #43a047 60%, #81c784 100%)',
              fontWeight: 700,
              borderRadius: 2,
              px: { xs: 2, sm: 3 },
              py: { xs: 1.5, sm: 1 },
              fontSize: { xs: '0.9rem', sm: 16 },
              boxShadow: '0 2px 8px #43a04733',
              letterSpacing: 1,
              '&:hover': { background: 'linear-gradient(90deg, #388e3c 60%, #66bb6a 100%)' },
              order: { xs: 1, sm: 2 }
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