"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import UpdateProduct from '../UpdateProduct';
import Paginator from './Paginator'; // Import the Paginator component
import ItemsPerPageSelector from './ItemsPerPageSelector'; // Import the ItemsPerPageSelector component

export interface Product {
  id: number;
  nombre: string;
  valor_comercial: number;
  valor_unitario: number;
  lista_1: number;
  lista_2: number;
  lista_3: number;
  cantidad: number;
}

interface ProductTableContentProps {
  products: Product[];
  onDelete: (id: number) => void;
  onUpdate: () => void;
  onSortById: () => void; // Nueva función para manejar la ordenación
  sortOrder: 'asc' | 'desc'; // Estado del orden actual
}

// Reusable header cell component
const HeaderCell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <TableCell
    sx={{
      background: 'linear-gradient(to right, #beb7b7, #5b5757)',
      fontWeight: 'bold',
      color: 'white',
      padding: '16px',
      borderRight: '1px solid #e0e0e0',
    }}
  >
    {children}
  </TableCell>
);

const ProductTableContent: React.FC<ProductTableContentProps> = ({
  products,
  onDelete,
  onUpdate,
  onSortById,
  sortOrder,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // State for items per page

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to the first page when items per page changes
  };

  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-amber-50 flex flex-col space-y-4"> {/* Adjust container to reduce spacing */}
      <TableContainer component={Paper} sx={{
        backgroundColor: '#FFFBEB', // Código hexadecimal para bg-amber-50
        minHeight: '100vh', // Asegura que el fondo cubra toda la pantalla
      }} className="bg-amber-50 shadow-lg">
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                onClick={onSortById}
                sx={{
                  background: 'linear-gradient(to right, #beb7b7, #5b5757)',
                  fontWeight: 'bold',
                  color: 'white',
                  padding: '16px',
                  borderRight: '1px solid #e0e0e0',
                  cursor: 'pointer',
                }}
              >
                ID {sortOrder === 'asc' ? '↑' : '↓'}
              </TableCell>
              <HeaderCell>Nombre</HeaderCell>
              <HeaderCell>Valor Comercial</HeaderCell>
              <HeaderCell>Valor Unitario</HeaderCell>
              <HeaderCell>Lista 1</HeaderCell>
              <HeaderCell>Lista 2</HeaderCell>
              <HeaderCell>Lista 3</HeaderCell>
              <HeaderCell>Cantidad</HeaderCell>
              <HeaderCell>Acciones</HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.map((product, index) => (
              <TableRow
                key={product.id}
                sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#f5f5f5' }}
              >
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
                    <UpdateProduct product={product} onUpdate={onUpdate} />
                    <Button sx={{
                      backgroundColor: '#da0007',
                      '&:hover': { backgroundColor: '#ffa8aa', boxShadow: 'none', borderColor: '#c0edff', color: '#da0007' },
                      fontWeight: 'bold',
                    }} variant="contained" color="error" onClick={() => onDelete(product.id)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="flex justify-between items-center px-4">
        <ItemsPerPageSelector
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
        <Paginator
          currentPage={currentPage}
          totalItems={products.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ProductTableContent;