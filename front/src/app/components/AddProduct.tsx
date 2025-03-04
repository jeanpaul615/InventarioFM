import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';

interface AddProductProps {
  onAdd: () => void;
}

const AddProduct: React.FC<AddProductProps> = ({ onAdd }) => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await axios.post('http://localhost:8000/products', form);
    setOpen(false);
    onAdd();
    
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Add Product
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Product</DialogTitle>
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
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddProduct;