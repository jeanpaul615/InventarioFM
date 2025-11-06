"use client";
import React, { useState } from "react";
import { Box, Button, TextField, Typography, Alert, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import { useApi } from "../context/ApiContext";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { baseUrl } = useApi();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error("Credenciales inválidas");
      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Error de autenticación");
    }
  };

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      background: "linear-gradient(135deg, #ffe0b2 0%, #fff3e0 100%)",
      px: { xs: 2, sm: 3 },
      py: { xs: 3, sm: 0 }
    }}>
      <Paper elevation={8} sx={{ 
        p: { xs: 3, sm: 5 }, 
        borderRadius: { xs: 3, sm: 4 }, 
        maxWidth: 400, 
        width: "100%", 
        boxShadow: "0 8px 32px #ff660040", 
        background: "#fff8f3" 
      }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: { xs: 2, sm: 3 } }}>
          <img 
            src="/logo.webp" 
            alt="Logo Ferremolina" 
            style={{ 
              width: 80, 
              height: 80, 
              borderRadius: 16, 
              marginBottom: 12, 
              boxShadow: "0 2px 8px #ffb74d" 
            }} 
          />
          <Typography 
            variant="h5" 
            fontWeight={900} 
            color="#ff6600" 
            mb={1} 
            letterSpacing={1}
            sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
          >
            Iniciar Sesión
          </Typography>
          <Typography 
            variant="subtitle2" 
            color="#b26a00" 
            mb={2}
            sx={{ 
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              textAlign: 'center'
            }}
          >
            Sistema de Inventario y Facturación
          </Typography>
        </Box>
        <form onSubmit={handleLogin}>
          <TextField
            label="Usuario"
            value={username}
            onChange={e => setUsername(e.target.value)}
            fullWidth
            margin="normal"
            required
            InputProps={{ style: { borderRadius: 8 } }}
          />
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
            InputProps={{ style: { borderRadius: 8 } }}
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ 
              mt: 3, 
              fontWeight: 700, 
              borderRadius: 3, 
              background: "#ff6600", 
              color: "#fff", 
              boxShadow: "0 2px 8px #ffb74d", 
              '&:hover': { background: '#b26a00' },
              py: { xs: 1.5, sm: 1.2 },
              fontSize: { xs: '1rem', sm: '0.9375rem' }
            }}
          >
            Entrar
          </Button>
        </form>
        <Box sx={{ mt: { xs: 3, sm: 4 }, textAlign: "center" }}>
          <Typography 
            variant="caption" 
            color="#b26a00"
            sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
          >
            © {new Date().getFullYear()} Ferremolina. Todos los derechos reservados.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
