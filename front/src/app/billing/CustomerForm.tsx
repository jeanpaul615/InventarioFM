import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

interface Customer {
  id: number;
  nombre: string;
  caracterizacion: "lista_1" | "lista_2" | "lista_3";
}

interface CustomerFormProps {
  onSubmit: (customer: Customer) => void;
}

const listaLabels: Record<Customer["caracterizacion"], string> = {
  lista_1: "Lista 1",
  lista_2: "Lista 2",
  lista_3: "Lista 3",
};

const CustomerForm: React.FC<CustomerFormProps> = ({ onSubmit }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  // Estados para crear cliente nuevo
  const [newName, setNewName] = useState("");
  const [newList, setNewList] = useState<Customer["caracterizacion"]>("lista_1");
  const [creating, setCreating] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8000/customers")
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find((c) => c.id === selectedCustomerId);
    if (!customer) return;
    // Guardar la lista en localStorage
    localStorage.setItem("customer_lista", customer.caracterizacion);
    onSubmit(customer);
    setSelectedCustomerId("");
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    setCreating(true);
    setSuccessMsg("");
    try {
      const res = await fetch("http://localhost:8000/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: newName, caracterizacion: newList }),
      });
      const created = await res.json();
      setCustomers((prev) => [...prev, created]);
      setSelectedCustomerId(created.id);
      setNewName("");
      setNewList("lista_1");
      setSuccessMsg("Cliente creado exitosamente.");
    } finally {
      setCreating(false);
    }
  };

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 3,
        alignItems: "flex-start",
        justifyContent: "center",
        mt: 4,
        width: "100%",
      }}
    >
      {/* Crear Cliente */}
      <Paper
        elevation={1}
        sx={{
          p: 3,
          minWidth: 300,
          maxWidth: 350,
          flex: 1,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 600,
            color: "primary.main",
            textAlign: "center",
          }}
        >
          Crear Cliente
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box
          component="form"
          onSubmit={handleCreateCustomer}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Nombre"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
            fullWidth
            size="small"
          />
          <TextField
            select
            label="Lista"
            value={newList}
            onChange={(e) => setNewList(e.target.value as any)}
            required
            fullWidth
            size="small"
          >
            <MenuItem value="lista_1">Lista 1</MenuItem>
            <MenuItem value="lista_2">Lista 2</MenuItem>
            <MenuItem value="lista_3">Lista 3</MenuItem>
          </TextField>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={creating || !newName}
            sx={{ fontWeight: "bold", py: 1 }}
          >
            {creating ? <CircularProgress size={20} /> : "Crear"}
          </Button>
          {successMsg && <Alert severity="success">{successMsg}</Alert>}
        </Box>
      </Paper>

      {/* Seleccionar Cliente */}
      <Paper
        elevation={1}
        sx={{
          p: 3,
          minWidth: 300,
          maxWidth: 350,
          flex: 1,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 600,
            color: "secondary.main",
            textAlign: "center",
          }}
        >
          Seleccionar Cliente
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField
              select
              label="Cliente"
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(Number(e.target.value))}
              required
              fullWidth
              disabled={loading}
              size="small"
              sx={{ flex: 1 }}
            >
              <MenuItem value="">Selecciona...</MenuItem>
              {customers.map((customer) => (
                <MenuItem key={customer.id} value={customer.id}>
                  {customer.nombre}
                </MenuItem>
              ))}
            </TextField>
            {selectedCustomerId && (
              <IconButton
                aria-label="Limpiar selección"
                onClick={() => setSelectedCustomerId("")}
                size="small"
                sx={{ ml: 1 }}
              >
                <ClearIcon />
              </IconButton>
            )}
          </Box>
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 1 }}>
              <CircularProgress size={20} />
            </Box>
          )}
          {selectedCustomer && (
            <Alert severity="info" sx={{ mt: 1, fontSize: 14, py: 0.5 }}>
              <b>Lista:</b> {listaLabels[selectedCustomer.caracterizacion]}
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            sx={{ fontWeight: "bold", py: 1, mt: 1 }}
            disabled={!selectedCustomer}
          >
            Generar Factura
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CustomerForm;