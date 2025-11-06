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

interface BillProduct {
  id: number;
  product: {
    id: number;
    nombre: string;
  };
  quantity: number;
  price: number;
}

interface Bill {
  id: number;
  date: string;
  billProducts: BillProduct[];
  customer: { id: number; nombre: string } | null;
}

const BillingList: React.FC = () => {
  const { baseUrl } = useApi();
  const [bills, setBills] = useState<Bill[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (!baseUrl) return;
    fetch(`${baseUrl}/bills`)
      .then(res => res.json())
      .then(data => setBills(data));
  }, [baseUrl]);

  // Calcula el total de una factura
  const getTotal = (bill: Bill) =>
    bill.billProducts.reduce((acc, bp) => acc + bp.price * bp.quantity, 0);

  // Filtro de búsqueda
  const filteredBills = bills.filter(bill =>
    (bill.customer?.nombre || "Sin cliente").toLowerCase().includes(search.toLowerCase()) ||
    bill.id.toString().includes(search)
  );

  // Paginación
  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: isMobile ? 1 : 5 }}>
      <Typography
        variant={isMobile ? "h6" : "h4"}
        sx={{
          mb: 3,
          fontWeight: 700,
          color: "#1565c0",
          textAlign: isMobile ? "center" : "left",
        }}
      >
        Listado de Facturas
      </Typography>

      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: isMobile ? "center" : "flex-end",
          px: isMobile ? 0.5 : 0,
        }}
      >
        <TextField
          size="small"
          variant="outlined"
          placeholder="Buscar por cliente o ID"
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
            sx: { borderRadius: 2, background: "#f5f7fa" },
          }}
          sx={{
            width: isMobile ? "100%" : 320,
            fontSize: isMobile ? 14 : 16,
          }}
        />
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: "0 2px 12px #e0e7ef",
          width: "100%",
          overflowX: "auto",
        }}
      >
        <Table
          size={isMobile ? "small" : "medium"}
          sx={{
            minWidth: 600,
            "& th, & td": {
              fontSize: isMobile ? 12 : 15,
              px: isMobile ? 1 : 2,
              py: isMobile ? 0.5 : 1.5,
              textAlign: "center",
            },
          }}
        >
          <TableHead>
            <TableRow sx={{ background: "#e3eafc" }}>
              <TableCell sx={{ fontWeight: 700, color: "#1565c0" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#1565c0" }}>Cliente</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#1565c0" }}>Fecha</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#1565c0" }}>Total</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#1565c0" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ color: "#bdbdbd" }}>
                  No hay facturas registradas.
                </TableCell>
              </TableRow>
            ) : (
              filteredBills
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((bill, idx) => (
                  <TableRow
                    key={bill.id}
                    hover
                    sx={{
                      background: idx % 2 === 0 ? "#f5f7fa" : "#ffffff",
                      transition: "background 0.2s",
                      cursor: "pointer",
                      "&:hover": { background: "#e3eafc" },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>{bill.id}</TableCell>
                    <TableCell>
                      {bill.customer?.nombre || "Sin cliente"}
                    </TableCell>
                    <TableCell>
                      {bill.date ? new Date(bill.date).toLocaleDateString() : ""}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      ${getTotal(bill).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={e => {
                          e.stopPropagation();
                          router.push(`/bills/${bill.id}`);
                        }}
                        sx={{
                          fontWeight: 700,
                          borderRadius: 2,
                          borderColor: "#1565c0",
                          color: "#1565c0",
                          minWidth: isMobile ? 90 : 120,
                          fontSize: isMobile ? 11 : 15,
                          px: isMobile ? 1 : 2,
                          py: isMobile ? 0.5 : 1,
                          "&:hover": {
                            background: "#e3eafc",
                            borderColor: "#1565c0",
                          },
                        }}
                      >
                        Ver factura
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredBills.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={isMobile ? [5, 8, 10, 20, 50] : [5, 8, 10, 25, 50, 100]}
          labelRowsPerPage="Filas por página"
          sx={{
            ".MuiTablePagination-toolbar": {
              background: "#f5f7fa",
              borderRadius: 2,
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "flex-start" : "center",
              px: isMobile ? 1 : 2,
              py: isMobile ? 0.5 : 1,
            },
            ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
              color: "#1565c0",
              fontSize: isMobile ? 12 : 15,
            },
            ".MuiTablePagination-actions": { color: "#1565c0" },
          }}
        />
      </TableContainer>
    </Box>
  );
};

export default BillingList;