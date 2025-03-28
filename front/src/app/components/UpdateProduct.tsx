import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
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
    if (!form.nombre) tempErrors.nombre = "Nombre es requerido";
    if (form.valor_comercial <= 0) tempErrors.valor_comercial = "Valor Comercial debe ser mayor que 0";
    if (form.valor_unitario <= 0) tempErrors.valor_unitario = "Valor Unitario debe ser mayor que 0";
    if (form.lista_1 < 0) tempErrors.lista_1 = "Lista 1 no puede ser negativo";
    if (form.lista_2 < 0) tempErrors.lista_2 = "Lista 2 no puede ser negativo";
    if (form.lista_3 < 0) tempErrors.lista_3 = "Lista 3 no puede ser negativo";
    if (form.cantidad < 0) tempErrors.cantidad = "Cantidad no puede ser negativo";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      await axios.put(`${baseUrl}/products/${form.id}`, form);
      setOpen(false);
      onUpdate();
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Update
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Product</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate autoComplete="off">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  margin="dense"
                  name="nombre"
                  label="Nombre"
                  type="text"
                  fullWidth
                  value={form.nombre}
                  onChange={handleChange}
                  error={!!errors.nombre}
                  helperText={errors.nombre}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
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
                  margin="dense"
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
                  margin="dense"
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
                  margin="dense"
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
                  margin="dense"
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
                  margin="dense"
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
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UpdateProduct;