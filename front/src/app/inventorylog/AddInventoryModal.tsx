import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button, CircularProgress, MenuItem } from "@mui/material";

interface AddInventoryModalProps {
  open: boolean;
  onClose: () => void;
  products: { id: number; nombre: string }[];
  token: string;
  onAdded: () => void;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 350,
  bgcolor: 'background.paper',
  border: '2px solid #ff6600',
  boxShadow: 24,
  borderRadius: 3,
  p: 4,
};

const AddInventoryModal: React.FC<AddInventoryModalProps> = ({ open, onClose, products, token, onAdded }) => {
  const [productId, setProductId] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async () => {
    setError("");
    if (!productId || !cantidad || isNaN(Number(cantidad)) || Number(cantidad) <= 0) {
      setError("Seleccione producto y cantidad válida");
      return;
    }
    setLoading(true);
    try {
      // Obtener userId del localStorage
      let userId = null;
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const userObj = JSON.parse(userStr);
          userId = userObj.userId || userObj.id || null;
          // Asegurar que userId sea un número
          if (userId) {
            userId = Number(userId);
          }
        }
      } catch (e) { 
        console.error("Error parsing user from localStorage:", e);
        userId = null; 
      }
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/products/${productId}/add-stock`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          quantity: Number(cantidad), 
          userId: userId 
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al agregar cantidad');
      }
      
      setLoading(false);
      setProductId("");
      setCantidad("");
      onAdded();
      onClose();
    } catch (e) {
      setLoading(false);
      console.error("Error adding stock:", e);
      setError(e instanceof Error ? e.message : 'Error al agregar cantidad');
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="add-inventory-modal-title">
      <Box sx={style}>
        <Typography id="add-inventory-modal-title" variant="h6" component="h2" gutterBottom color="#ff6600">
          Ingresar cantidad a inventario
        </Typography>
        <TextField
          select
          label="Producto"
          fullWidth
          value={productId}
          onChange={e => setProductId(e.target.value)}
          disabled={loading}
          sx={{ mb: 2 }}
        >
          {products.map(p => (
            <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Cantidad"
          type="number"
          fullWidth
          value={cantidad}
          onChange={e => setCantidad(e.target.value)}
          disabled={loading}
          sx={{ mb: 2 }}
        />
        {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}
        <Button
          variant="contained"
          color="warning"
          onClick={handleAdd}
          disabled={loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : 'Agregar al inventario'}
        </Button>
      </Box>
    </Modal>
  );
};

export default AddInventoryModal;
