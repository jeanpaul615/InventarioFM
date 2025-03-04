"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, TextField, Toolbar, InputAdornment, TablePagination, Snackbar, Alert
} from '@mui/material';
import { Search } from '@mui/icons-material';
import AddProduct from './AddProduct';
import UpdateProduct from './UpdateProduct';

interface Product {
  id: number;
  nombre: string;
  valor_comercial: number;
  valor_unitario: number;
  lista_1: number;
  lista_2: number;
  lista_3: number;
  cantidad: number;
}

const ProductTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await axios.get('http://localhost:8000/products');
    setProducts(response.data);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`http://localhost:8000/products/${id}`);
    fetchProducts();
    setSnackbarMessage('Product deleted successfully');
    setSnackbarOpen(true);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredProducts = products.filter((product) =>
    product.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedProducts = filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-amber-400 mb-6 text-center pt-28">INVENTARIO FERREMOLINA</h1>
      <Toolbar className="flex justify-between mb-4">
        <TextField
          variant="outlined"
          placeholder="Search..."
          value={search}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <AddProduct onAdd={fetchProducts} />
      </Toolbar>
      <TableContainer component={Paper} className="shadow-lg">
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Valor Comercial</TableCell>
              <TableCell>Valor Unitario</TableCell>
              <TableCell>Lista 1</TableCell>
              <TableCell>Lista 2</TableCell>
              <TableCell>Lista 3</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.nombre}</TableCell>
                <TableCell>{product.valor_comercial}</TableCell>
                <TableCell>{product.valor_unitario}</TableCell>
                <TableCell>{product.lista_1}</TableCell>
                <TableCell>{product.lista_2}</TableCell>
                <TableCell>{product.lista_3}</TableCell>
                <TableCell>{product.cantidad}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <UpdateProduct product={product} onUpdate={fetchProducts} />
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredProducts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ProductTable;