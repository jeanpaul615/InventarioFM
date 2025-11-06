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
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/products?limit=100000`, {
        timeout: 10000, // 10 segundos de timeout
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = response.data;
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (Array.isArray(data.items)) {
        setProducts(data.items);
      } else {
        setProducts([]);
      }
    } catch (error: any) {
      console.error('Error fetching products:', error);
      if (error.code === 'ECONNABORTED') {
        setSnackbarMessage('Tiempo de espera agotado. Verifica tu conexión.');
        setSnackbarOpen(true);
      } else if (error.response && error.response.status === 401) {
        setSnackbarMessage('No autorizado. Por favor, inicia sesión de nuevo.');
        setSnackbarOpen(true);
        // Redirigir al login después de 2 segundos
        setTimeout(() => router.push('/login'), 2000);
      } else if (error.message === 'Network Error' || !error.response) {
        setSnackbarMessage('Error de conexión. Verifica que el servidor esté corriendo en ' + baseUrl);
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage(`Error al cargar productos: ${error.message}`);
        setSnackbarOpen(true);
      }
      setProducts([]);
    } finally {
      setLoading(false);
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

  // Mostrar indicador de carga
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-amber-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600"></div>
        <p className="mt-4 text-xl font-semibold text-amber-800">Cargando productos...</p>
        <p className="mt-2 text-sm text-gray-600">Conectando a {baseUrl}</p>
      </div>
    );
  }

  return (
    <React.Fragment>
      {/* Header - Responsive */}
      <div className="bg-amber-50 flex flex-col md:flex-row items-center justify-center p-3 md:p-5 gap-2 md:gap-3">
        <img 
          src="/logo.webp" 
          alt="Logo" 
          className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40"
        />
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600 text-center drop-shadow-lg">
          INVENTARIO FERREMOLINA
        </h1>
      </div>

      {/* Toolbar - Responsive */}
      <Toolbar className="flex flex-col md:flex-row justify-between gap-3 md:gap-4 mb-4 px-2 md:px-4">
        <div className="w-full md:flex-1">
          <SearchBar search={search} onSearchChange={handleSearch} />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full md:w-auto">
          <FileUploadButton onFileUpload={handleFileUpload} />
          <AddProduct onAdd={fetchProducts} />
        </div>
      </Toolbar>

      {/* Table Content */}
      <div className="px-2 md:px-4">
        <ProductTableContent
          products={filteredProducts}
          onDelete={handleDelete}
          onUpdate={fetchProducts}
          onSortById={handleSortById}
          sortOrder={sortOrder}
        />
      </div>
      
      <SnackbarNotification open={snackbarOpen} message={snackbarMessage} onClose={() => setSnackbarOpen(false)} />
    </React.Fragment>
  );
};

export default ProductTable;