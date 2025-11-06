import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { useApi } from '../../context/ApiContext';

interface AddQuantityModalProps {
  open: boolean;
  onClose: () => void;
  productId: number | null;
  productName: string;
  onQuantityAdded: () => void;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 350,
  bgcolor: 'background.paper',
  border: '2px solid #334155',
  boxShadow: 24,
  borderRadius: 3,
  p: 4,
};

const AddQuantityModal: React.FC<AddQuantityModalProps> = ({ open, onClose, productId, productName, onQuantityAdded }) => {
  const { baseUrl } = useApi();
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async () => {
    setError('');
    if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
      setError('Ingrese una cantidad válida');
      return;
    }
    if (!baseUrl) {
      setError('Error de conexión');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await fetch(`${baseUrl}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ cantidad: Number(quantity) }),
      });
      setLoading(false);
      setQuantity('');
      onQuantityAdded();
      onClose();
    } catch (e) {
      setLoading(false);
      setError('Error al actualizar cantidad');
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="add-quantity-modal-title">
      <Box sx={style}>
        <Typography id="add-quantity-modal-title" variant="h6" component="h2" gutterBottom>
          Agregar cantidad a <b>{productName}</b>
        </Typography>
        <TextField
          label="Cantidad a agregar"
          type="number"
          fullWidth
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          disabled={loading}
          sx={{ mb: 2 }}
        />
        {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}
        <Button
          variant="contained"
          color="primary"
          onClick={handleAdd}
          disabled={loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : 'Agregar'}
        </Button>
      </Box>
    </Modal>
  );
};

export default AddQuantityModal;
