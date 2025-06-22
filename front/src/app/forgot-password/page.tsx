"use client";
import React, { useState } from "react";
import { Box, Button, TextField, Typography, Alert, Paper } from "@mui/material";

const ForgotPasswordPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      // Simulación: en un sistema real, aquí se enviaría un email o SMS
      await new Promise((res) => setTimeout(res, 1200));
      setMessage("Si el usuario existe, se enviarán instrucciones de recuperación a su correo.");
    } catch (err: any) {
      setError("No se pudo procesar la solicitud. Intenta más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #ffe0b2 0%, #fff3e0 100%)" }}>
      <Paper elevation={8} sx={{ p: 5, borderRadius: 4, maxWidth: 400, width: "100%", boxShadow: "0 8px 32px #ff660040", background: "#fff8f3" }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
          <img src="/logo.webp" alt="Logo Ferremolina" style={{ width: 80, height: 80, borderRadius: 16, marginBottom: 12, boxShadow: "0 2px 8px #ffb74d" }} />
          <Typography variant="h5" fontWeight={900} color="#ff6600" mb={1} letterSpacing={1}>
            Recuperar Contraseña
          </Typography>
          <Typography variant="subtitle2" color="#b26a00" mb={2}>
            Ingresa tu usuario para recuperar el acceso
          </Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Usuario"
            value={username}
            onChange={e => setUsername(e.target.value)}
            fullWidth
            margin="normal"
            required
            InputProps={{ style: { borderRadius: 8 } }}
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ mt: 3, fontWeight: 700, borderRadius: 3, background: "#ff6600", color: "#fff", boxShadow: "0 2px 8px #ffb74d", '&:hover': { background: '#b26a00' } }}
          >
            {loading ? "Enviando..." : "Recuperar"}
          </Button>
        </form>
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="caption" color="#b26a00">
            © {new Date().getFullYear()} Ferremolina. Todos los derechos reservados.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default ForgotPasswordPage;
