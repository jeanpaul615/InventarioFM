import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';

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
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(product);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await axios.put(`http://localhost:8000/products/${form.id}`, form);
    setOpen(false);
    onUpdate();
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Update
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Update Product</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="nombre"
            label="Nombre"
            type="text"
            fullWidth
            value={form.nombre}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="valor_comercial"
            label="Valor Comercial"
            type="number"
            fullWidth
            value={form.valor_comercial}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="valor_unitario"
            label="Valor Unitario"
            type="number"
            fullWidth
            value={form.valor_unitario}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="lista_1"
            label="Lista 1"
            type="number"
            fullWidth
            value={form.lista_1}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="lista_2"
            label="Lista 2"
            type="number"
            fullWidth
            value={form.lista_2}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="lista_3"
            label="Lista 3"
            type="number"
            fullWidth
            value={form.lista_3}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="cantidad"
            label="Cantidad"
            type="number"
            fullWidth
            value={form.cantidad}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
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