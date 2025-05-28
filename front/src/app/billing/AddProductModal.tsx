"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  InputAdornment,
  IconButton,
  Paper,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import axios from "axios";
import { useApi } from "../context/ApiContext";

interface Product {
  id: number;
  nombre: string;
  valor_comercial: number;
  cantidad: number;
}

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (newProduct: Product) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const { baseUrl } = useApi();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) fetchProducts();
    // eslint-disable-next-line
  }, [open]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/products`);
      setProducts(response.data);
      setFiltered(response.data);
    } catch (error) {
      setProducts([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search.trim() === "") {
      setFiltered(products);
    } else {
      setFiltered(
        products.filter((p) =>
          p.nombre.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, products]);

  const handleAdd = () => {
    if (selected) {
      onAdd(selected);
      setSelected(null);
      setSearch("");
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 480,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 3,
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={2} color="primary">
          Seleccionar Producto
        </Typography>
        <TextField
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
            sx: { borderRadius: 2, background: "#f5f7fa" },
          }}
        />
        <Paper
          elevation={2}
          sx={{
            mt: 2,
            mb: 2,
            maxHeight: 300,
            overflowY: "auto",
            borderRadius: 2,
            border: "1px solid #e0e0e0",
          }}
        >
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height={150}
            >
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {filtered.length === 0 && (
                <ListItem>
                  <ListItemText primary="No se encontraron productos." />
                </ListItem>
              )}
              {filtered.map((product) => (
                <ListItem
                  key={product.id}
                  // Elimina 'button' y usa 'onClick' para selección visual
                  selected={selected?.id === product.id}
                  onClick={() => setSelected(product)}
                  sx={{
                    cursor: "pointer",
                    "&.Mui-selected": {
                      background: "linear-gradient(90deg, #e3e6f0 0%, #f9fafb 100%)",
                    },
                    borderBottom: "1px solid #f0f0f0",
                    transition: "background 0.2s",
                    "&:hover": {
                      background: "#f5f7fa",
                    },
                  }}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation(); // Previene que el clic afecte el ListItem
                        setSelected(product);
                        handleAdd();
                      }}
                    >
                      <AddCircleOutlineIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={
                      <span style={{ fontWeight: 500 }}>{product.nombre}</span>
                    }
                    secondary={
                      <span>
                        Valor:{" "}
                        <b>${product.valor_comercial.toLocaleString()}</b> | Stock:{" "}
                        <b>{product.cantidad}</b>
                      </span>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
          }}
        >
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={!selected}
            onClick={handleAdd}
          >
            Agregar Seleccionado
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddProductModal;