"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, CircularProgress, TablePagination, TableFooter, Stack, Divider, Button
} from "@mui/material";
import { useApi } from "../context/ApiContext";
import AddReturnModal from "./AddReturnModal";

interface ReturnLog {
  id: number;
  fecha: string;
  material: string;
  cantidad: number;
  usuario: string;
}

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50, 100];

const ReturnList: React.FC = () => {
  const { token, user } = useApi(); // Puedes usar user si lo necesitas
  const [returns, setReturns] = useState<ReturnLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);

  const fetchReturns = useCallback(() => {
    if (!token) return;
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/returns`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async res => {
        if (res.status === 401) {
          window.alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
          localStorage.removeItem('token');
          window.location.href = "/login";
          return [];
        }
        return res.json();
      })
      .then(data => {
        setReturns(Array.isArray(data) ? data : []);
      })
      .catch(error => {
        console.error('Error fetching returns:', error);
        setReturns([]);
      })
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    fetchReturns();
  }, [fetchReturns]);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedReturns = Array.isArray(returns) ? returns.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : [];

  return (
    <Paper elevation={6} sx={{ p: 4, maxWidth: 950, mx: "auto", mt: 6, borderRadius: 4 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight={900} color="#1976d2">
          Historial de Devoluciones
        </Typography>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Registrar Devolución
        </Button>
      </Stack>
      <Divider sx={{ mb: 2 }} />
      <AddReturnModal open={open} onClose={() => setOpen(false)} onAdded={fetchReturns} />
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
          <CircularProgress color="primary" size={48} />
        </Box>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Material</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Usuario</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!Array.isArray(returns) || returns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No hay devoluciones registradas.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedReturns.map(ret => (
                  <TableRow key={ret.id}>
                    <TableCell>{new Date(ret.fecha).toLocaleString()}</TableCell>
                    <TableCell>{ret.material}</TableCell>
                    <TableCell>{ret.cantidad}</TableCell>
                    <TableCell>{ret.usuario}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                  colSpan={4}
                  count={returns.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage="Filas por página"
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default ReturnList;