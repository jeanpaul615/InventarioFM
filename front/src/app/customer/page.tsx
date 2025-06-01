"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Paper,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useApi } from "../context/ApiContext";

interface Customer {
  id: number;
  nombre: string;
}

const CustomerPage: React.FC = () => {
  const { baseUrl } = useApi();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [form, setForm] = useState({ nombre: "" });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" });
  const [addOpen, setAddOpen] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/customers`);
      setCustomers(res.data);
    } catch {
      setCustomers([]);
      setSnackbar({ open: true, message: "Error al cargar clientes", severity: "error" });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line
  }, []);

  const handleEdit = (customer: Customer) => {
    setSelected(customer);
    setForm({
      nombre: customer.nombre,
    });
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    if (!selected) return;
    try {
      await axios.put(`${baseUrl}/customers/${selected.id}`, form);
      setSnackbar({ open: true, message: "Cliente actualizado", severity: "success" });
      setEditOpen(false);
      setSelected(null);
      fetchCustomers();
    } catch {
      setSnackbar({ open: true, message: "Error al actualizar cliente", severity: "error" });
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Seguro que deseas eliminar este cliente?")) {
      try {
        await axios.delete(`${baseUrl}/customers/${id}`);
        setSnackbar({ open: true, message: "Cliente eliminado", severity: "success" });
        // Si el cliente eliminado estaba seleccionado, limpia selección y cierra diálogo
        if (selected && selected.id === id) {
          setEditOpen(false);
          setSelected(null);
        }
        fetchCustomers();
      } catch (error: any) {
        setSnackbar({
          open: true,
          message: error?.response?.data?.message || "Error al eliminar cliente",
          severity: "error",
        });
        fetchCustomers(); // Intenta refrescar igual
      }
    }
  };

  const handleAdd = async () => {
    try {
      await axios.post(`${baseUrl}/customers`, form);
      setSnackbar({ open: true, message: "Cliente agregado", severity: "success" });
      setAddOpen(false);
      setForm({ nombre: "" });
      fetchCustomers();
    } catch {
      setSnackbar({ open: true, message: "Error al agregar cliente", severity: "error" });
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 6, p: { xs: 1, sm: 3 }, background: "#f8fafc", borderRadius: 3, boxShadow: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <PersonIcon color="primary" sx={{ fontSize: 36 }} />
          <Typography variant="h4" fontWeight={700} color="primary.dark">
            Clientes
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{
            borderRadius: 2,
            fontWeight: 700,
            px: 3,
            boxShadow: "0 2px 8px #1976d233",
            background: "linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)",
            "&:hover": {
              background: "linear-gradient(90deg, #1565c0 60%, #42a5f5 100%)",
              boxShadow: "0 4px 16px #1976d244",
              transform: "translateY(-2px) scale(1.03)",
            },
          }}
          onClick={() => {
            setForm({ nombre: "" });
            setAddOpen(true);
          }}
        >
          Nuevo Cliente
        </Button>
      </Box>
      <Paper elevation={0} sx={{ borderRadius: 3, boxShadow: 1, p: 0, background: "#fff" }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {customers.length === 0 && (
              <Box sx={{ textAlign: "center", py: 4, color: "#bdbdbd" }}>
                <Typography variant="body1">No hay clientes registrados.</Typography>
              </Box>
            )}
            {customers.map((customer) => (
              <ListItem
                key={customer.id}
                secondaryAction={
                  <Box>
                    <Tooltip title="Editar">
                      <IconButton edge="end" color="primary" onClick={() => handleEdit(customer)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton edge="end" color="error" onClick={() => handleDelete(customer.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
                sx={{
                  borderBottom: "1px solid #e0e0e0",
                  "&:last-child": { borderBottom: "none" },
                  transition: "background 0.2s",
                  "&:hover": { background: "#f3f7fa" },
                }}
              >
                <ListItemText
                  primary={
                    <Typography fontWeight={600} fontSize={18} color="#263238">
                      {customer.nombre}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {/* Dialogo para editar */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Editar Cliente</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1, minWidth: 350 }}>
          <TextField
            label="Nombre"
            value={form.nombre}
            onChange={e => setForm({ ...form, nombre: e.target.value })}
            fullWidth
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancelar</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogo para agregar */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)}>
        <DialogTitle>Nuevo Cliente</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1, minWidth: 350 }}>
          <TextField
            label="Nombre"
            value={form.nombre}
            onChange={e => setForm({ ...form, nombre: e.target.value })}
            fullWidth
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>Cancelar</Button>
          <Button onClick={handleAdd} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CustomerPage;