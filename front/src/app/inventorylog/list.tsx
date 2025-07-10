"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  TablePagination,
  TableFooter,
  Chip,
  Tooltip,
  Avatar,
  Stack,
  Divider
} from "@mui/material";
import { useApi } from "../context/ApiContext";
import AddInventoryButton from "./AddInventoryButton";
import PersonIcon from '@mui/icons-material/Person';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useRouter } from 'next/navigation';

interface InventoryLog {
  id: number;
  fecha: string;
  material: string;
  cantidad: number;
  usuario: { username: string } | null;
  tipo: 'nuevo' | 'suma';
}

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50, 100];

const InventoryLogList: React.FC = () => {
  const { token } = useApi();
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const router = useRouter();

  // Función para cargar logs, reutilizable
  const fetchLogs = useCallback(() => {
    if (!token) return;
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/inventory-log`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async res => {
        if (res.status === 401) {
          window.alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
          localStorage.removeItem('token');
          router.push('/login');
          return [];
        }
        return res.json();
      })
      .then(data => {
        setLogs(Array.isArray(data) ? data : []);
      })
      .catch(error => {
        console.error('Error fetching logs:', error);
        setLogs([]);
      })
      .finally(() => setLoading(false));
  }, [token, router]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
      }
    }
  }, [router]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedLogs = Array.isArray(logs) ? logs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : [];

  return (
    <Paper elevation={6} sx={{ p: 4, maxWidth: 950, mx: "auto", mt: 6, borderRadius: 4, boxShadow: "0 8px 32px #ffb74d99", background: "#fffdfa" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight={900} color="#ff6600" sx={{ letterSpacing: 1, display: 'flex', alignItems: 'center' }}>
          <Inventory2Icon sx={{ mr: 1, fontSize: 32, color: '#ff6600' }} />
          Historial de Ingresos al Inventario
        </Typography>
        <AddInventoryButton onAdded={fetchLogs} />
      </Stack>
      <Divider sx={{ mb: 2, borderColor: '#ffcc80' }} />
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
          <CircularProgress color="warning" size={48} />
        </Box>
      ) : (
        <TableContainer sx={{ borderRadius: 3, boxShadow: '0 2px 12px #ffe0b2' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ background: "linear-gradient(90deg, #fff3e0 60%, #ffe0b2 100%)" }}>
                <TableCell sx={{ color: "#ff6600", fontWeight: 900, textAlign: "center", fontSize: 16 }}>Fecha</TableCell>
                <TableCell sx={{ color: "#ff6600", fontWeight: 900, textAlign: "center", fontSize: 16 }}>Material</TableCell>
                <TableCell sx={{ color: "#ff6600", fontWeight: 900, textAlign: "center", fontSize: 16 }}>Cantidad</TableCell>
                <TableCell sx={{ color: "#ff6600", fontWeight: 900, textAlign: "center", fontSize: 16 }}>Usuario</TableCell>
                <TableCell sx={{ color: "#ff6600", fontWeight: 900, textAlign: "center", fontSize: 16 }}>Tipo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!Array.isArray(logs) || logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ color: "#bdbdbd", fontStyle: "italic", fontSize: 18 }}>
                    No hay ingresos registrados.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedLogs.map(log => (
                  <TableRow key={log.id} hover sx={{ transition: 'background 0.2s', '&:hover': { background: '#fffde7' } }}>
                    <TableCell sx={{ textAlign: "center", fontWeight: 500, fontSize: 15 }}>{new Date(log.fecha).toLocaleString()}</TableCell>
                    <TableCell sx={{ textAlign: "center", fontWeight: 600, fontSize: 15, color: '#6d4c41' }}>{log.material}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Chip
                        icon={<AddCircleIcon sx={{ color: '#fff' }} />}
                        label={log.cantidad}
                        sx={{ background: '#ffb74d', color: '#fff', fontWeight: 700, fontSize: 15 }}
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                        <Avatar sx={{ width: 28, height: 28, bgcolor: log.usuario?.username ? '#1976d2' : '#bdbdbd' }}>
                          <PersonIcon sx={{ fontSize: 18 }} />
                        </Avatar>
                        <Tooltip title={log.usuario?.username || 'Anónimo'} placement="top">
                          <Typography sx={{ fontWeight: 600, color: log.usuario?.username ? '#1976d2' : '#bdbdbd', fontSize: 15 }}>
                            {log.usuario?.username || <span style={{ color: '#bdbdbd', fontStyle: 'italic' }}>Anónimo</span>}
                          </Typography>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Chip
                        label={log.tipo === 'nuevo' ? 'Producto nuevo' : 'Suma al inventario'}
                        sx={{
                          background: log.tipo === 'nuevo' ? '#1976d2' : '#ff6600',
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: 15,
                          letterSpacing: 0.5
                        }}
                        icon={log.tipo === 'nuevo' ? <Inventory2Icon sx={{ color: '#fff' }} /> : <AddCircleIcon sx={{ color: '#fff' }} />}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                  colSpan={5}
                  count={logs.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: { 'aria-label': 'Filas por página' },
                    native: true,
                  }}
                  labelRowsPerPage="Filas por página"
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{ border: 0 }}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default InventoryLogList;
