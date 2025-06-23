"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import UpdateProduct from '../UpdateProduct';
import Paginator from './Paginator'; // Import the Paginator component
import ItemsPerPageSelector from './ItemsPerPageSelector'; // Import the ItemsPerPageSelector component
import AddQuantityModal from './AddQuantityModal';

export interface Product {
  id: number;
  nombre: string;
  valor_comercial: number;
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

// Nuevo componente HeaderCell empresarial
const BusinessHeaderCell: React.FC<{ children: React.ReactNode; align?: 'left' | 'right' | 'center'; onClick?: () => void; active?: boolean }> = ({
  children,
  align = 'left',
  onClick,
  active = false,
}) => (
  <TableCell
    align={align}
    onClick={onClick}
    sx={{
      background: active
        ? 'linear-gradient(90deg, #1e293b 0%, #334155 100%)'
        : 'linear-gradient(90deg, #334155 0%, #64748b 100%)',
      fontWeight: 'bold',
      color: active ? '#FFD700' : '#F1F5F9',
      padding: '18px 14px',
      borderRight: '1px solid #e2e8f0',
      borderBottom: '2.5px solid #0f172a',
      fontSize: '1.08rem',
      letterSpacing: '0.5px',
      cursor: onClick ? 'pointer' : 'default',
      boxShadow: active ? '0 2px 8px 0 rgba(30,41,59,0.10)' : undefined,
      transition: 'background 0.2s, color 0.2s',
      '&:hover': onClick
        ? {
            background: 'linear-gradient(90deg, #475569 0%, #1e293b 100%)',
            color: '#FFD700',
          }
        : {},
      textTransform: 'uppercase',
      textAlign: align,
      userSelect: 'none',
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
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{id: number, nombre: string} | null>(null);

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

  const handleOpenAddModal = (product: Product) => {
    setSelectedProduct({ id: product.id, nombre: product.nombre });
    setAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setAddModalOpen(false);
    setSelectedProduct(null);
  };

  const handleQuantityAdded = () => {
    onUpdate();
  };

  return (
    <div className="flex flex-col space-y-4 bg-gradient-to-br from-amber-50 to-gray-100 min-h-screen py-6">
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: 'rgba(255,251,235,0.97)',
          minHeight: '70vh',
          borderRadius: '18px',
          boxShadow: '0 8px 32px 0 rgba(30,41,59,0.13)',
          border: '1.5px solid #e2e8f0',
          overflow: 'hidden',
        }}
        className="shadow-2xl"
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <BusinessHeaderCell
                onClick={onSortById}
                active
                align="center"
              >
                ID {sortOrder === 'asc' ? '↑' : '↓'}
              </BusinessHeaderCell>
              <BusinessHeaderCell>Nombre</BusinessHeaderCell>
              <BusinessHeaderCell align="right">Valor Comercial</BusinessHeaderCell>
              <BusinessHeaderCell align="right">Lista 1</BusinessHeaderCell>
              <BusinessHeaderCell align="right">Lista 2</BusinessHeaderCell>
              <BusinessHeaderCell align="right">Lista 3</BusinessHeaderCell>
              <BusinessHeaderCell align="right">Cantidad</BusinessHeaderCell>
              <BusinessHeaderCell align="center">Acciones</BusinessHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.map((product, index) => (
              <TableRow
                key={product.id}
                sx={{
                  backgroundColor: index % 2 === 0 ? '#fff' : '#f8fafc',
                  transition: 'background 0.2s',
                  '&:hover': {
                    backgroundColor: '#ffe082',
                  },
                }}
              >
                <TableCell sx={{ fontWeight: 500 }}>{product.id}</TableCell>
                <TableCell>{product.nombre}</TableCell>
                <TableCell>${product.valor_comercial.toLocaleString()}</TableCell>
                <TableCell>{product.lista_1.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</TableCell>
                <TableCell>{product.lista_2.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</TableCell>
                <TableCell>{product.lista_3.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</TableCell>
                <TableCell>{product.cantidad}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <UpdateProduct product={product} onUpdate={onUpdate} />

                    <Button
                      sx={{
                        backgroundColor: '#da0007',
                        '&:hover': {
                          backgroundColor: '#ffd6d6',
                          color: '#da0007',
                          boxShadow: '0 2px 8px 0 rgba(218,0,7,0.15)',
                        },
                        fontWeight: 'bold',
                        borderRadius: '8px',
                        fontSize: '0.95rem',
                        textTransform: 'none',
                      }}
                      variant="contained"
                      color="error"
                      onClick={() => onDelete(product.id)}
                    >
                      ELIMINAR
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
      <AddQuantityModal
        open={addModalOpen}
        onClose={handleCloseAddModal}
        productId={selectedProduct?.id ?? null}
        productName={selectedProduct?.nombre ?? ''}
        onQuantityAdded={handleQuantityAdded}
      />
    </div>
  );
};

export default ProductTableContent;