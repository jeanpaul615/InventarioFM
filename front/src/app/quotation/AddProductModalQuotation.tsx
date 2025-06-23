"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  Badge,
  Fade,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import axios from "axios";

// Tipo específico para cotización
interface InventoryItem {
  id: number;
  nombre: string;
  cantidad: number;
  price?: number;
  lista_1?: number;
  lista_2?: number;
  lista_3?: number;
}

interface AddProductModalQuotationProps {
  open: boolean;
  onClose: () => void;
  onAdd: (item: InventoryItem, quantity: number) => void;
}

const AddProductModalQuotation: React.FC<AddProductModalQuotationProps> = ({ open, onClose, onAdd }) => {
  const [products, setProducts] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (open) fetchProducts();
  }, [open]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/products?limit=10000`, {
        headers: {},
      });
      const data = response.data;
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (Array.isArray(data.items)) {
        setProducts(data.items);
      } else {
        setProducts([]);
      }
    } catch (error) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtrado optimizado con useMemo
  const filtered = useMemo(() => {
    if (search.trim() === "") return products;
    return products.filter((p) => (p.nombre || "").toLowerCase().includes(search.toLowerCase()));
  }, [search, products]);

  const handleAdd = () => {
    if (selected && quantity > 0 && quantity <= selected.cantidad) {
      onAdd(selected, quantity);
      setSelected(null);
      setSearch("");
      setQuantity(1);
      setAdding(false);
      onClose();
    }
  };

  useEffect(() => {
    if (!open) {
      setQuantity(1);
      setSelected(null);
      setSearch("");
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} closeAfterTransition>
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "#f7fafd",
            boxShadow: 24,
            p: 0,
            borderRadius: 4,
            maxHeight: "85vh",
            overflowY: "auto",
            border: "2px solid #e3eafc",
          }}
        >
          {/* Header */}
          <Box sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 3,
            background: "linear-gradient(90deg, #e3eafc 0%, #f7fafd 100%)",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            borderBottom: "1px solid #e0e7ef"
          }}>
            <Inventory2RoundedIcon color="primary" sx={{ fontSize: 36 }} />
            <Typography variant="h5" fontWeight="bold" color="primary">
              Seleccionar Producto para Cotización
            </Typography>
          </Box>

          {/* Buscador */}
          <Box sx={{ px: 3, pb: 1, pt: 3, position: "sticky", top: 0, zIndex: 2, background: "#f7fafd" }}>
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
                sx: { borderRadius: 2, background: "#fff", boxShadow: "0 1px 4px #e3eafc" },
              }}
            />
          </Box>

          {/* Lista de productos */}
          <Paper
            elevation={0}
            sx={{
              mx: 3,
              mb: 2,
              maxHeight: 260,
              overflowY: "auto",
              borderRadius: 2,
              border: "1px solid #e0e0e0",
              background: "#fff",
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
                {filtered.map((product, idx) => (
                  <ListItem
                    key={product.id}
                    onClick={() => setSelected(product)}
                    sx={{
                      cursor: "pointer",
                      background: selected?.id === product.id
                        ? "linear-gradient(90deg, #e3eafc 0%, #f9fafb 100%)"
                        : idx % 2 === 0
                        ? "#f7fafd"
                        : "#fff",
                      borderLeft: selected?.id === product.id ? "4px solid #1565c0" : undefined,
                      borderBottom: "1px solid #f0f0f0",
                      transition: "background 0.2s",
                      "&:hover": {
                        background: "#e3eafc",
                      },
                    }}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        color="primary"
                        disabled={product.cantidad === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(product);
                          handleAdd();
                        }}
                        sx={{
                          transition: "transform 0.2s",
                          "&:active": { transform: "scale(1.2)" },
                        }}
                      >
                        <AddCircleOutlineIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <span style={{ fontWeight: 500 }}>
                            {product.nombre && product.nombre.trim() !== ""
                              ? product.nombre
                              : <span style={{ color: "red" }}>Sin nombre</span>}
                          </span>
                          {product.cantidad <= 2 && (
                            <Badge
                              color="error"
                              badgeContent="¡Stock bajo!"
                              sx={{ ml: 1, "& .MuiBadge-badge": { fontSize: 10, height: 16, minWidth: 16 } }}
                            />
                          )}
                        </span>
                      }
                      secondary={
                        <span style={{ display: "flex", gap: 16, alignItems: "center" }}>
                          <span>
                            Stock: <b>{typeof product.cantidad === "number" ? product.cantidad.toLocaleString() : 0}</b>
                          </span>
                        </span>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>

          {/* Selector de cantidad y agregar */}
          {selected && (
            <Box sx={{
              mb: 2,
              px: 3,
              display: "flex",
              alignItems: "center",
              gap: 2,
              justifyContent: "space-between"
            }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography>Cantidad:</Typography>
                <TextField
                  type="number"
                  size="small"
                  value={quantity}
                  inputProps={{
                    min: 1,
                    max: selected.cantidad,
                    style: { width: 60, textAlign: "center" },
                  }}
                  onChange={e => {
                    const val = Number(e.target.value);
                    setQuantity(val > selected.cantidad ? selected.cantidad : val < 1 ? 1 : val);
                  }}
                />
                <Typography sx={{ color: "#888" }}>
                  (Stock: {selected.cantidad})
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                disabled={adding}
                onClick={handleAdd}
                sx={{
                  fontWeight: 700,
                  px: 3,
                  py: 1.2,
                  borderRadius: 2,
                  boxShadow: "0 2px 8px #e3eafc",
                  transition: "background 0.2s, box-shadow 0.2s",
                  "&:hover": { background: "#1565c0", boxShadow: "0 4px 16px #e3eafc" }
                }}
                endIcon={<AddCircleOutlineIcon />}
              >
                {adding ? "Agregando..." : "Agregar"}
              </Button>
            </Box>
          )}

          {/* Footer modal */}
          <Box sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            px: 3,
            pb: 3,
            pt: selected ? 0 : 2
          }}>
            <Button variant="outlined" color="secondary" onClick={onClose}>
              Cancelar
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default AddProductModalQuotation;
