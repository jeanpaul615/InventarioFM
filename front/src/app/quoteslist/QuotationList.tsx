"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
  TextField,
  InputAdornment,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import { useApi } from "../context/ApiContext";

interface QuotationProduct {
  id: number;
  product: {
    id: number;
    nombre: string;
  };
  quantity: number;
  price: number;
}

interface Quotation {
  id: number;
  date: string;
  quotationProducts: QuotationProduct[];
  customer: { id: number; nombre: string } | null;
}

const QuotationList: React.FC = () => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { token } = useApi();

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:8000/quotations", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error("No autorizado");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setQuotations(data);
        } else {
          setQuotations([]);
        }
      })
      .catch(() => setQuotations([]));
  }, [token]);

  // Calcula el total de una cotización
  const getTotal = (quotation: Quotation) =>
    quotation.quotationProducts.reduce((acc, qp) => acc + qp.price * qp.quantity, 0);

  // Filtro de búsqueda
  const filteredQuotations = quotations.filter(quotation =>
    quotation.customer?.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    quotation.id.toString().includes(search)
  );

  return (
    <Box sx={{
      p: isMobile ? 1 : 5,
      background: "linear-gradient(120deg, #fffbe6 0%, #f8fafc 100%)",
      minHeight: "100vh",
    }}>
      <Typography
        variant="h3"
        fontWeight={900}
        color="#ff6600"
        mb={3}
        letterSpacing={1}
        sx={{ textShadow: "0 2px 8px #ffd8b3" }}
      >
        Listado de Cotizaciones
      </Typography>
      <Paper sx={{ mb: 3, p: 2, borderRadius: 3, boxShadow: "0 2px 12px #ffd8b3" }}>
        <TextField
          variant="outlined"
          placeholder="Buscar por cliente o ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#ff6600" }} />
              </InputAdornment>
            ),
          }}
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              background: '#fff8f3',
              fontWeight: 600,
            },
            '& .MuiInputAdornment-root': {
              color: '#ff6600',
            },
          }}
        />
      </Paper>
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: "0 2px 12px #ffd8b3" }}>
        <Table size={isMobile ? "small" : "medium"}>
          <TableHead>
            <TableRow sx={{ background: "linear-gradient(90deg, #ffe0b2 0%, #fff3e0 100%)" }}>
              <TableCell sx={{ color: "#ff6600", fontWeight: 700 }}>ID</TableCell>
              <TableCell sx={{ color: "#ff6600", fontWeight: 700 }}>Cliente</TableCell>
              <TableCell sx={{ color: "#ff6600", fontWeight: 700 }}>Fecha</TableCell>
              <TableCell sx={{ color: "#ff6600", fontWeight: 700 }}>Total</TableCell>
              <TableCell sx={{ color: "#ff6600", fontWeight: 700 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredQuotations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ color: '#b26a00', fontWeight: 600, py: 6 }}>
                  No hay cotizaciones para mostrar.
                </TableCell>
              </TableRow>
            ) : (
              filteredQuotations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((quotation) => (
                <TableRow key={quotation.id} hover sx={{ transition: 'background 0.2s', '&:hover': { background: '#fff8f3' } }}>
                  <TableCell>{quotation.id}</TableCell>
                  <TableCell>{quotation.customer?.nombre || "-"}</TableCell>
                  <TableCell>{new Date(quotation.date).toLocaleDateString()}</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#ff6600' }}>
                    ${getTotal(quotation).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="warning"
                      size="small"
                      sx={{ borderColor: '#ff6600', color: '#ff6600', fontWeight: 700, borderRadius: 2 }}
                      onClick={() => router.push(`/quotations/${quotation.id}`)}
                    >
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredQuotations.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={e => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 8, 15, 25]}
        sx={{
          mt: 2,
          background: '#fff8f3',
          borderRadius: 2,
          boxShadow: '0 2px 8px #ffd8b3',
          '& .MuiTablePagination-toolbar': { color: '#b26a00', fontWeight: 600 },
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { color: '#b26a00' },
          '& .MuiTablePagination-actions button': { color: '#ff6600' },
        }}
      />
    </Box>
  );
};

export default QuotationList;
