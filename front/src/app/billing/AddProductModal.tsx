"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
} from "@mui/material";

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (newProduct: any) => void; // Callback para agregar el producto
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    stock: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleSubmit = () => {
    const newProduct = {
      id: Date.now(), // Generar un ID único
      name: productData.name,
      price: parseFloat(productData.price),
      stock: parseInt(productData.stock, 10),
    };
    onAdd(newProduct); // Enviar el producto al callback
    onClose(); // Cerrar el modal
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" mb={2}>
          Agregar Producto
        </Typography>
        <TextField
          label="Nombre"
          name="name"
          value={productData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Precio"
          name="price"
          value={productData.price}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          label="Stock"
          name="stock"
          value={productData.stock}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
        />
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Agregar
          </Button>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancelar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddProductModal;