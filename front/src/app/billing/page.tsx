"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import AddProductModal from "./AddProductModal"; // Asegúrate de que la ruta sea correcta
import { useApi } from "../../context/ApiContext"; // Asegúrate de que la ruta sea correcta

interface InventoryItem {
  id: number;
  name: string;
  price: number;
  stock: number;
}

const mockInventory: InventoryItem[] = [
  { id: 1, name: "Producto A", price: 100, stock: 10 },
  { id: 2, name: "Producto B", price: 200, stock: 5 },
  { id: 3, name: "Producto C", price: 50, stock: 20 },
];

const Billing: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<
    { item: InventoryItem; quantity: number }[]
  >([]);
  const [total, setTotal] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Estado para el modal
  const [products, setProducts] = useState<InventoryItem[]>(mockInventory); // Lista de productos

  const handleAddItem = (item: InventoryItem, quantity: number) => {
    if (quantity > item.stock) {
      alert("Cantidad excede el stock disponible");
      return;
    }

    const existingItem = selectedItems.find((i) => i.item.id === item.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      setSelectedItems([...selectedItems, { item, quantity }]);
    }

    setTotal(total + item.price * quantity);
  };

  const handleGeneratePDF = async () => {
    const invoiceElement = document.getElementById("invoice");
    if (!invoiceElement) return;

    const canvas = await html2canvas(invoiceElement);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgWidth = 190; // Width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    pdf.save("Factura_Ferremolina.pdf");
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleAddProduct = (newProduct: InventoryItem) => {
    setProducts([...products, newProduct]); // Agregar el nuevo producto a la lista
    setIsAddModalOpen(false); // Cerrar el modal
  };

  return (
    <Box sx={{ p: 5, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      {/* Header with Logo and Company Info */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
          p: 2,
          backgroundColor: "#ffffff",
          borderRadius: 2,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#000000" }}>
            Ferremolina
          </Typography>
          <Typography
            sx={{ fontWeight: "bold", color: "#5e5e5e" }}
            variant="body1"
          >
            Calle 8 Bis N. 37-22 Pereira
          </Typography>
          <Typography
            sx={{ fontWeight: "bold", color: "#5e5e5e" }}
            variant="body1"
          >
            Tel: +57 312 346 7272
          </Typography>
          <Typography
            sx={{ fontWeight: "bold", color: "#5e5e5e" }}
            variant="body1"
          >
            Email: cabran112@gmail.com
          </Typography>
        </Box>
        <Box>
          <img
            src="logo.webp" // Cambia esta ruta al logo de tu empresa
            alt="Logo de Ferremolina"
            style={{ width: "100px", height: "auto" }}
          />
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Invoice Section */}
      <Box
        id="invoice"
        sx={{
          p: 3,
          backgroundColor: "#ffffff",
          borderRadius: 2,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
          Factura
        </Typography>
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#ff5722" }}>
                <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>
                  Producto
                </TableCell>
                <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>
                  Cantidad
                </TableCell>
                <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>
                  Precio
                </TableCell>
                <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>
                  Subtotal
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedItems.map(({ item, quantity }) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{quantity}</TableCell>
                  <TableCell>${item.price}</TableCell>
                  <TableCell>${item.price * quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Total: ${total}
        </Typography>
      </Box>

      {/* Buttons */}
      <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenAddModal}
        >
          Agregar Producto
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleGeneratePDF}
          sx={{
            backgroundColor: "#4caf50",
            "&:hover": { backgroundColor: "#45a049" },
          }}
        >
          Descargar Factura en PDF
        </Button>
      </Box>

      {/* Add Product Modal */}
      <AddProductModal
        open={isAddModalOpen}
        onClose={handleCloseAddModal}
        onAdd={handleAddProduct}
      />
    </Box>
  );
};

export default Billing;