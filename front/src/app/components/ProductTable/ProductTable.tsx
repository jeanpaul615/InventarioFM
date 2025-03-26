"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Toolbar from '@mui/material/Toolbar';
import SearchBar from './SearchBar';
import FileUploadButton from './FileUploadButton';
import ProductTableContent from './ProductTableContent';
import SnackbarNotification from './SnackbarNotification';
import AddProduct from '../AddProduct';
import * as XLSX from 'xlsx';
import Image from 'next/image';

import { Product } from './ProductTableContent';

const ProductTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      await axios.post('http://localhost:8000/products/bulk', jsonData);
      fetchProducts();
      setSnackbarMessage('Productos cargados exitosamente');
      setSnackbarOpen(true);
    };
    reader.readAsBinaryString(file);
  };

  const filteredProducts = products.filter((product) =>
    product.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <React.Fragment>
      <div className="flex items-center justify-center p-5">
        <Image src="/logo.webp" alt="Logo" width={200} height={50} />
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600 ml-3 drop-shadow-lg">
          INVENTARIO FERREMOLINA
        </h1>
      </div>
      <Toolbar className="flex justify-between mb-4">
        <SearchBar search={search} onSearchChange={handleSearch} />
        <div className="flex space-x-4">
          <FileUploadButton onFileUpload={handleFileUpload} />
          <AddProduct onAdd={fetchProducts} />
        </div>
      </Toolbar>
      <ProductTableContent products={filteredProducts} onDelete={handleDelete} onUpdate={fetchProducts} />
      <SnackbarNotification open={snackbarOpen} message={snackbarMessage} onClose={() => setSnackbarOpen(false)} />
    </React.Fragment>
  );
};

export default ProductTable;