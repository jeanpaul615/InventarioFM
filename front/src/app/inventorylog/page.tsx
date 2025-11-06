"use client";
import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Alert } from "@mui/material";
import { useApi } from "../context/ApiContext";

const InventoryLogForm: React.FC = () => {
  const { token, user, baseUrl } = useApi();
  const [material, setMaterial] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (!baseUrl) {
      setError("Error de conexión");
      return;
    }
    try {
      const res = await fetch(`${baseUrl}/inventory-log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ material, cantidad }),
      });
      if (!res.ok) throw new Error("Error al registrar ingreso");
      setSuccess("Ingreso registrado correctamente");
      setMaterial("");
      setCantidad(1);
    } catch (err: any) {
      setError(err.message || "Error inesperado");
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 400, mx: "auto", mt: 5, borderRadius: 3, boxShadow: "0 4px 24px #ffb74d", background: "#fff8f3" }}>
      <Typography variant="h6" fontWeight={900} color="#ff6600" mb={2}>
        Registrar ingreso al inventario
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Material ingresado"
          value={material}
          onChange={e => setMaterial(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Cantidad"
          type="number"
          value={cantidad}
          onChange={e => setCantidad(Number(e.target.value))}
          fullWidth
          required
          inputProps={{ min: 1 }}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="info" fullWidth sx={{ fontWeight: 700, borderRadius: 2 }}>
          Registrar
        </Button>
      </form>
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {user && (
        <Typography variant="caption" color="#b26a00" sx={{ mt: 2, display: 'block' }}>
          Usuario: {user.username}
        </Typography>
      )}
    </Paper>
  );
};

export default InventoryLogForm;
