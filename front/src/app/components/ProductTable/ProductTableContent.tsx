"use client";
import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button,
} from '@mui/material';
import UpdateProduct from '../UpdateProduct';

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
}

const ProductTableContent: React.FC<ProductTableContentProps> = ({ products, onDelete, onUpdate }) => {
  return (
    <TableContainer component={Paper} className="shadow-lg">
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ backgroundColor: 'lightgray', fontWeight: 'bold' }}>ID</TableCell>
            <TableCell sx={{ backgroundColor: 'lightgray', fontWeight: 'bold' }}>Nombre</TableCell>
            <TableCell sx={{ backgroundColor: 'lightgray', fontWeight: 'bold' }}>Valor Comercial</TableCell>
            <TableCell sx={{ backgroundColor: 'lightgray', fontWeight: 'bold' }}>Valor Unitario</TableCell>
            <TableCell sx={{ backgroundColor: 'lightgray', fontWeight: 'bold' }}>Lista 1</TableCell>
            <TableCell sx={{ backgroundColor: 'lightgray', fontWeight: 'bold' }}>Lista 2</TableCell>
            <TableCell sx={{ backgroundColor: 'lightgray', fontWeight: 'bold' }}>Lista 3</TableCell>
            <TableCell sx={{ backgroundColor: 'lightgray', fontWeight: 'bold' }}>Cantidad</TableCell>
            <TableCell sx={{ backgroundColor: 'lightgray', fontWeight: 'bold' }}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
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
                  <UpdateProduct product={product} onUpdate={onUpdate} />
                  <Button variant="contained" color="error" onClick={() => onDelete(product.id)}>
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductTableContent;