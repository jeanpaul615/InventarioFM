import React, { useState } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";

interface QuantityModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (quantity: number) => void;
}

const QuantityModal: React.FC<QuantityModalProps> = ({ open, onClose, onSubmit }) => {
  const [quantity, setQuantity] = useState<number>(1);

  React.useEffect(() => {
    if (open) setQuantity(0); // Reset quantity when modal opens
  }, [open]);

  const handleSubmit = () => {
    if (quantity < 1 || isNaN(quantity)) return; // Prevent invalid values
    onSubmit(quantity);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "background.paper",
          boxShadow: 24, 
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Cambiar cantidad
        </Typography>
        <TextField
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          fullWidth
          inputProps={{ min: 1 }}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
          Confirmar
        </Button>
      </Box>
    </Modal>
  );
};

export default QuantityModal;