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
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import GroupIcon from "@mui/icons-material/Group";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import ListAltIcon from "@mui/icons-material/ListAlt";
import axios from "axios";
import { useApi } from "../context/ApiContext";

interface Customer {
  id: number;
  nombre: string;
  cedula?: string;
  telefono?: string;
  direccion?: string;
  caracterizacion?: "lista_1" | "lista_2" | "lista_3";
}

const CustomerPage: React.FC = () => {
  const { baseUrl } = useApi();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [form, setForm] = useState({ nombre: "", cedula: "", telefono: "", direccion: "", caracterizacion: "lista_1" });
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
      cedula: customer.cedula || "",
      telefono: customer.telefono || "",
      direccion: customer.direccion || "",
      caracterizacion: customer.caracterizacion || "lista_1",
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
      setForm({ nombre: "", cedula: "", telefono: "", direccion: "", caracterizacion: "lista_1" });
      fetchCustomers();
    } catch {
      setSnackbar({ open: true, message: "Error al agregar cliente", severity: "error" });
    }
  };

  return (
    <Box sx={{ maxWidth: 950, mx: "auto", mt: 6, p: { xs: 2, sm: 4 }, background: "linear-gradient(120deg, #f4f8fb 0%, #e3f2fd 100%)", borderRadius: 4, boxShadow: 8 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <GroupIcon sx={{ fontSize: 48, color: '#1976d2', filter: 'drop-shadow(0 2px 8px #bbdefb)' }} />
          <Typography variant="h4" fontWeight={900} color="#1976d2" letterSpacing={1} sx={{ textShadow: "0 2px 8px #bbdefb" }}>
            Gestión de Clientes
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{
            borderRadius: 3,
            fontWeight: 700,
            px: 4,
            py: 1.5,
            fontSize: 18,
            boxShadow: "0 4px 16px #1976d244",
            background: "linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)",
            transition: "all 0.2s",
            "&:hover": {
              background: "linear-gradient(90deg, #1565c0 60%, #42a5f5 100%)",
              boxShadow: "0 6px 24px #1976d255",
              transform: "translateY(-2px) scale(1.04)",
            },
          }}
          onClick={() => {
            setForm({ nombre: "", cedula: "", telefono: "", direccion: "", caracterizacion: "lista_1" });
            setAddOpen(true);
          }}
        >
          Nuevo Cliente
        </Button>
      </Box>
      <Paper elevation={3} sx={{ borderRadius: 4, boxShadow: 3, p: 0, background: "#fff" }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {customers.length === 0 && (
              <Box sx={{ textAlign: "center", py: 5, color: "#bdbdbd" }}>
                <Typography variant="body1" fontSize={18}>No hay clientes registrados.</Typography>
              </Box>
            )}
            {customers.map((customer) => (
              <ListItem
                key={customer.id}
                secondaryAction={
                  <Box>
                    <Tooltip title="Editar" arrow>
                      <IconButton edge="end" color="primary" onClick={() => handleEdit(customer)} sx={{ mx: 0.5, bgcolor: "#e3f2fd", '&:hover': { bgcolor: "#bbdefb" } }}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar" arrow>
                      <IconButton edge="end" color="error" onClick={() => handleDelete(customer.id)} sx={{ mx: 0.5, bgcolor: "#ffebee", '&:hover': { bgcolor: "#ffcdd2" } }}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
                sx={{
                  borderBottom: "1px solid #e0e0e0",
                  transition: "background 0.2s, box-shadow 0.2s",
                  borderRadius: 2,
                  mb: 1,
                  px: 2,
                  py: 2.5,
                  background: "#f9fbfd",
                  boxShadow: "0 1px 4px #e3eafc55",
                  '&:hover': { background: "#e3f2fd", boxShadow: "0 2px 8px #bbdefb55" },
                }}
              >
                <ListItemText
                  primary={
                    <React.Fragment>
                      <Typography fontWeight={700} fontSize={20} color="#263238">
                        {customer.nombre}
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={2} mt={0.5}>
                        <Typography fontSize={15} color="#607d8b" display="flex" alignItems="center" gap={0.5}>
                          <AssignmentIndIcon sx={{ fontSize: 18, color: '#bdbdbd' }} /> <b>Cédula/NIT:</b> {customer.cedula || "-"}
                        </Typography>
                        <Typography fontSize={15} color="#607d8b" display="flex" alignItems="center" gap={0.5}>
                          <PhoneIcon sx={{ fontSize: 18, color: '#bdbdbd' }} /> <b>Tel:</b> {customer.telefono || "-"}
                        </Typography>
                        <Typography fontSize={15} color="#607d8b" display="flex" alignItems="center" gap={0.5}>
                          <HomeIcon sx={{ fontSize: 18, color: '#bdbdbd' }} /> <b>Dir:</b> {customer.direccion || "-"}
                        </Typography>
                        <Typography fontSize={15} color="#607d8b" display="flex" alignItems="center" gap={0.5}>
                          <ListAltIcon sx={{ fontSize: 18, color: '#bdbdbd' }} /> <b>Lista:</b> {customer.caracterizacion || "-"}
                        </Typography>
                      </Box>
                    </React.Fragment>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ p: 2, pb: 0 }}>
          {selected ? (
            <Typography component="span" variant="h6" fontWeight={700} color="primary">
              Editar Cliente
            </Typography>
          ) : (
            <Typography component="span" variant="h6" fontWeight={700} color="primary">
              Nuevo Cliente
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
            <TextField
              label="Nombre completo"
              variant="outlined"
              fullWidth
              required
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Cédula/NIT"
              variant="outlined"
              fullWidth
              value={form.cedula}
              onChange={(e) => setForm({ ...form, cedula: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Teléfono"
              variant="outlined"
              fullWidth
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Dirección"
              variant="outlined"
              fullWidth
              value={form.direccion}
              onChange={(e) => setForm({ ...form, direccion: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Caracterización"
              variant="outlined"
              fullWidth
              select
              value={form.caracterizacion}
              onChange={(e) => setForm({ ...form, caracterizacion: e.target.value as any })}
              sx={{ mb: 2 }}
            >
              <MenuItem value="lista_1">Lista 1</MenuItem>
              <MenuItem value="lista_2">Lista 2</MenuItem>
              <MenuItem value="lista_3">Lista 3</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleEditSave} variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Guardar cambios"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ p: 2, pb: 0 }}>
          <Typography component="span" variant="h6" fontWeight={700} color="primary">
            Nuevo Cliente
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
            <TextField
              label="Nombre completo"
              variant="outlined"
              fullWidth
              required
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Cédula/NIT"
              variant="outlined"
              fullWidth
              value={form.cedula}
              onChange={(e) => setForm({ ...form, cedula: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Teléfono"
              variant="outlined"
              fullWidth
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Dirección"
              variant="outlined"
              fullWidth
              value={form.direccion}
              onChange={(e) => setForm({ ...form, direccion: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Caracterización"
              variant="outlined"
              fullWidth
              select
              value={form.caracterizacion}
              onChange={(e) => setForm({ ...form, caracterizacion: e.target.value as any })}
              sx={{ mb: 2 }}
            >
              <MenuItem value="lista_1">Lista 1</MenuItem>
              <MenuItem value="lista_2">Lista 2</MenuItem>
              <MenuItem value="lista_3">Lista 3</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleAdd} variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Agregar Cliente"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CustomerPage;