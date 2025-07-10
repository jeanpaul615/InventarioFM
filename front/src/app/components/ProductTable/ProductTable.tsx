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
import { useApi } from '../../context/ApiContext';
import { Product } from './ProductTableContent';
import { useRouter } from 'next/navigation';

const ProductTable: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
      }
    }
  }, [router]);

  const { baseUrl, token } = useApi(); // Obtener la URL base y el token desde el contexto
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Estado para el orden de clasificación

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${baseUrl}/products?limit=100000`);
      const data = response.data;
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (Array.isArray(data.items)) {
        setProducts(data.items);
      } else {
        setProducts([]);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        setSnackbarMessage('No autorizado. Por favor, inicia sesión de nuevo.');
        setSnackbarOpen(true);
        setProducts([]);
      } else {
        setSnackbarMessage('Error al cargar productos.');
        setSnackbarOpen(true);
        setProducts([]);
      }
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`${baseUrl}/products/${id}`);
    fetchProducts();
    setSnackbarMessage('Producto eliminado exitosamente');
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

      await axios.post(`${baseUrl}/products/bulk`, jsonData);
      fetchProducts();
      setSnackbarMessage('Productos cargados exitosamente');
      setSnackbarOpen(true);
    };
    reader.readAsBinaryString(file);
  };

  const handleSortById = () => {
    const sortedProducts = [...products].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.id - b.id; // Orden ascendente
      } else {
        return b.id - a.id; // Orden descendente
      }
    });
    setProducts(sortedProducts);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Alternar el orden
  };

  const filteredProducts = products.filter((product) =>
    product.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <React.Fragment>
      <div className="bg-amber-50 flex items-center justify-center p-5">
        <img src="/logo.webp" alt="Logo" width={200} height={50}/>
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
      <ProductTableContent
        products={filteredProducts}
        onDelete={handleDelete}
        onUpdate={fetchProducts}
        onSortById={handleSortById} // Pasar la función de ordenación
        sortOrder={sortOrder} // Pasar el estado del orden actual
      />
      <SnackbarNotification open={snackbarOpen} message={snackbarMessage} onClose={() => setSnackbarOpen(false)} />
    </React.Fragment>
  );
};

export default ProductTable;