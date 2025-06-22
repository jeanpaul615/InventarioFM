"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from "@mui/material";
import { useApi } from "../context/ApiContext";

interface InventoryLog {
  id: number;
  fecha: string;
  material: string;
  cantidad: number;
  usuario: { username: string };
}

const InventoryLogList: React.FC = () => {
  const { token } = useApi();
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:8000/inventory-log", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setLogs(data))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <Paper sx={{ p: 4, maxWidth: 800, mx: "auto", mt: 5, borderRadius: 3, boxShadow: "0 4px 24px #ffb74d", background: "#fff8f3" }}>
      <Typography variant="h6" fontWeight={900} color="#ff6600" mb={2}>
        Historial de ingresos al inventario
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress color="warning" />
        </Box>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ background: "#fff3e0" }}>
                <TableCell sx={{ color: "#ff6600", fontWeight: 800, textAlign: "center" }}>Fecha</TableCell>
                <TableCell sx={{ color: "#ff6600", fontWeight: 800, textAlign: "center" }}>Material</TableCell>
                <TableCell sx={{ color: "#ff6600", fontWeight: 800, textAlign: "center" }}>Cantidad</TableCell>
                <TableCell sx={{ color: "#ff6600", fontWeight: 800, textAlign: "center" }}>Usuario</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ color: "#bdbdbd", fontStyle: "italic" }}>
                    No hay ingresos registrados.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map(log => (
                  <TableRow key={log.id}>
                    <TableCell sx={{ textAlign: "center" }}>{new Date(log.fecha).toLocaleString()}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{log.material}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{log.cantidad}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{log.usuario?.username}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default InventoryLogList;
