"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, Stack, CircularProgress, Alert, MenuItem
} from "@mui/material";
import { useApi } from "../context/ApiContext";

interface AddReturnModalProps {
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
}

const AddReturnModal: React.FC<AddReturnModalProps> = ({
  open, onClose, onAdded
}) => {
  const { token } = useApi();
  const [material, setMaterial] = useState("");
  const [cantidad, setCantidad] = useState<number>(1);
  const [usuario, setUsuario] = useState("");
  const [usuarios, setUsuarios] = useState<string[]>([]);
  const [materiales, setMateriales] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${baseUrl}/products?limit=100000`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      let mats: string[] = [];
      if (Array.isArray(data)) {
        mats = data.map((m: any) => `${m.nombre} (Stock: ${m.cantidad})`);
      } else if (Array.isArray(data.items)) {
        mats = data.items.map((m: any) => `${m.nombre} (Stock: ${m.cantidad})`);
      }
      setMateriales(mats);
      if (!mats.includes(material)) setMaterial("");
    } catch (error: any) {
      setMateriales([]);
    }
  };

  // Cargar usuarios y materiales al abrir el modal
  useEffect(() => {
    if (open && token) {
      // Cargar clientes (puedes hacer lo mismo con axios si quieres)
      fetch(`${baseUrl}/customers`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          const users = Array.isArray(data) ? data.map((u: any) => u.nombre) : [];
          setUsuarios(users);
          if (!users.includes(usuario)) setUsuario("");
        })
        .catch(() => setUsuarios([]));

      // Cargar productos con axios
      fetchProducts();
    }
    // eslint-disable-next-line
  }, [open, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/returns`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            material,
            cantidad,
            usuario,
          }),
        }
      );
      if (!res.ok) {
        throw new Error("Error al registrar la devolución");
      }
      onAdded();
      onClose();
      setMaterial("");
      setCantidad(1);
      setUsuario("");
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Registrar Devolución</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              select
              label="Material"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              required
              fullWidth
            >
              {materiales.map((m) => (
                <MenuItem key={m} value={m}>{m}</MenuItem>
              ))}
            </TextField>
            <TextField
              type="number"
              label="Cantidad"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              inputProps={{ min: 1 }}
              required
              fullWidth
            />
            <TextField
              select
              label="Usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
              fullWidth
            >
              {usuarios.map((u) => (
                <MenuItem key={u} value={u}>{u}</MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Registrar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddReturnModal;