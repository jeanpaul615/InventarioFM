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
import AddProductModal from "./AddProductModal";
import CustomerForm from "./CustomerForm";
import AlertSnackbar from "./AlertSnackbar";
import ConfirmDialog from "./ConfirmDialog";

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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [products, setProducts] = useState<InventoryItem[]>(mockInventory);
  const [customerName, setCustomerName] = useState("");
  const [currentBillId, setCurrentBillId] = useState<number | null>(null);

  // Alert state
  const [alert, setAlert] = useState<{ open: boolean; message: string; severity?: "success" | "error" | "info" | "warning" }>({
    open: false,
    message: "",
    severity: "info",
  });

  const showAlert = (message: string, severity: "success" | "error" | "info" | "warning" = "info") => {
    setAlert({ open: true, message, severity });
  };

  const handleAddItem = (item: InventoryItem, quantity: number) => {
    if (quantity > item.stock) {
      showAlert("Cantidad excede el stock disponible", "warning");
      return;
    }

    const existingItem = selectedItems.find((i) => i.item.id === item.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      setSelectedItems([...selectedItems, { item, quantity }]);
    }

    setTotal(total + item.price * quantity);
    showAlert("Producto agregado a la factura", "success");
  };

  const handleGeneratePDF = async () => {
    const invoiceElement = document.getElementById("invoice");
    if (!invoiceElement) return;

    const canvas = await html2canvas(invoiceElement);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    pdf.save("Factura_Ferremolina.pdf");
    showAlert("Factura descargada en PDF", "success");
  };

  const handleOpenAddModal = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => setIsAddModalOpen(false);

  const handleAddProduct = (newProduct: InventoryItem) => {
    setProducts([...products, newProduct]);
    setIsAddModalOpen(false);
    showAlert("Producto agregado al inventario", "success");
  };

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingCustomerName, setPendingCustomerName] = useState<string | null>(null);

  const handleCreateBill = async (name: string) => {
    if (currentBillId) {
      setPendingCustomerName(name);
      setConfirmOpen(true);
      return;
    }
    await createBillFlow(name);
  };

  const createBillFlow = async (name: string) => {
    setCustomerName(name);

    // 1. Crear la factura
    const billResponse = await fetch("http://localhost:8000/bills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerName: name }),
    });

    if (!billResponse.ok) {
      showAlert("Error al crear la factura", "error");
      return;
    }

    const bill = await billResponse.json();
    setCurrentBillId(bill.id);

    // 2. (Opcional) Agregar productos a la factura si hay productos seleccionados
    if (selectedItems.length > 0) {
      for (const { item, quantity } of selectedItems) {
        await fetch("http://localhost:8000/bill-products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bill: bill.id,
            product: item.id,
            quantity,
            price: item.price,
          }),
        });
      }
    }

    showAlert("Factura creada correctamente", "success");
  };

  return (
    <Box sx={{ p: 5, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      {/* Header */}
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
          <Typography sx={{ fontWeight: "bold", color: "#5e5e5e" }} variant="body1">
            Calle 8 Bis N. 37-22 Pereira
          </Typography>
          <Typography sx={{ fontWeight: "bold", color: "#5e5e5e" }} variant="body1">
            Tel: +57 312 346 7272
          </Typography>
          <Typography sx={{ fontWeight: "bold", color: "#5e5e5e" }} variant="body1">
            Email: cabran112@gmail.com
          </Typography>
        </Box>
        <Box>
          <img src="logo.webp" alt="Logo de Ferremolina" style={{ width: "100px", height: "auto" }} />
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Customer Form */}
      <CustomerForm onSubmit={handleCreateBill} />

      {/* Invoice Section */}
      <Box
        id="invoice"
        sx={{
          p: 4,
          background: "#fff",
          borderRadius: 2,
          boxShadow: "0 2px 12px rgba(44,62,80,0.07)",
          border: "1.5px solid #e0e7ef",
          mb: 4,
          maxWidth: 820,
          mx: "auto",
          fontFamily: "Roboto, Arial, sans-serif",
          transition: "box-shadow 0.2s",
          "&:hover": { boxShadow: "0 4px 24px rgba(44,62,80,0.13)" },
        }}
      >
        {/* Encabezado de factura */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#222", letterSpacing: 1 }}>
              FACTURA 
            </Typography>
            <Typography variant="body2" sx={{ color: "#607d8b", fontWeight: 500 }}>
              Distribuciones Ferremolina
            </Typography>
            <Typography variant="body2" sx={{ color: "#607d8b" }}>
              Factura Numero: {currentBillId || "En curso"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#607d8b" }}>
              Fecha: {new Date().toLocaleDateString()}
            </Typography>
          </Box>
          <Box>
            <img src="logo.webp" alt="Logo de Ferremolina" style={{ width: 80, height: "auto" }} />
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Datos del cliente */}
        <Box sx={{ mb: 2, display: "flex", gap: 4 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ color: "#607d8b", fontWeight: 500 }}>
              Cliente:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, color: "#222" }}>
              {customerName || <span style={{ color: "#bdbdbd" }}>Sin nombre</span>}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ color: "#607d8b", fontWeight: 500 }}>
              Dirección:
            </Typography>
            <Typography variant="body1" sx={{ color: "#222" }}>
              Calle 8 Bis N. 37-22 Pereira
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ color: "#607d8b", fontWeight: 500 }}>
              Teléfono:
            </Typography>
            <Typography variant="body1" sx={{ color: "#222" }}>
              +57 312 346 7272
            </Typography>
          </Box>
        </Box>

        {/* Tabla de productos */}
        <TableContainer
          component={Paper}
          sx={{
            mb: 3,
            borderRadius: 1,
            border: "1px solid #e0e7ef",
            background: "#fafbfc",
            boxShadow: "none",
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ background: "#f5f7fa" }}>
                <TableCell sx={{ color: "#263238", fontWeight: 700, fontSize: 15, borderBottom: "2px solid #e0e7ef" }}>Código</TableCell>
                <TableCell sx={{ color: "#263238", fontWeight: 700, fontSize: 15, borderBottom: "2px solid #e0e7ef" }}>Producto</TableCell>
                <TableCell sx={{ color: "#263238", fontWeight: 700, fontSize: 15, borderBottom: "2px solid #e0e7ef" }}>Cantidad</TableCell>
                <TableCell sx={{ color: "#263238", fontWeight: 700, fontSize: 15, borderBottom: "2px solid #e0e7ef" }}>Precio Unitario</TableCell>
                <TableCell sx={{ color: "#263238", fontWeight: 700, fontSize: 15, borderBottom: "2px solid #e0e7ef" }}>Subtotal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ color: "#bdbdbd", fontStyle: "italic" }}>
                    No hay productos agregados a la factura.
                  </TableCell>
                </TableRow>
              ) : (
                selectedItems.map(({ item, quantity }) => (
                  <TableRow key={item.id} hover>
                    <TableCell sx={{ color: "#607d8b" }}>{item.id}</TableCell>
                    <TableCell sx={{ color: "#263238", fontWeight: 500 }}>{item.name}</TableCell>
                    <TableCell sx={{ color: "#263238" }}>{quantity}</TableCell>
                    <TableCell sx={{ color: "#263238" }}>${item.price}</TableCell>
                    <TableCell sx={{ color: "#263238", fontWeight: 500 }}>
                      ${(item.price * quantity).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Totales y pie de factura */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 4 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ color: "#607d8b", fontWeight: 500 }}>
              Subtotal:
            </Typography>
            <Typography variant="body1" sx={{ color: "#222", fontWeight: 600 }}>
              ${total.toLocaleString()}
            </Typography>
            <Typography variant="subtitle2" sx={{ color: "#607d8b", fontWeight: 500 }}>
              IVA (19%):
            </Typography>
            <Typography variant="body1" sx={{ color: "#222", fontWeight: 600 }}>
              ${(total * 0.19).toLocaleString()}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="h6" sx={{ color: "#1565c0", fontWeight: 700 }}>
              Total a Pagar: ${(total * 1.19).toLocaleString()}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ textAlign: "center", color: "#90a4ae", fontSize: 13, mt: 2 }}>
          <Typography>
            Esta factura es un documento electrónico generado por Ferremolina.
          </Typography>
        </Box>
      </Box>

      {/* Buttons */}
      <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
        <Button variant="contained" color="primary" onClick={handleOpenAddModal}>
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

      {/* Snackbar de alertas */}
      <AlertSnackbar
        open={alert.open}
        message={alert.message}
        severity={alert.severity}
        onClose={() => setAlert({ ...alert, open: false })}
      />

      {/* Add Product Modal */}
      {/* Aquí puedes renderizar tu modal para agregar productos */}
      <ConfirmDialog
        open={confirmOpen}
        title="Factura en curso"
        content="Ya hay una factura en curso. ¿Deseas continuar con la misma o crear una nueva?"
        confirmText="Continuar"
        cancelText="Crear nueva"
        onConfirm={() => {
          setCustomerName(pendingCustomerName || "");
          showAlert("Continuando con la factura en curso", "info");
          setConfirmOpen(false);
          setPendingCustomerName(null);
        }}
        onCancel={async () => {
          setCurrentBillId(null);
          setSelectedItems([]);
          setTotal(0);
          setConfirmOpen(false);
          if (pendingCustomerName) {
            await createBillFlow(pendingCustomerName);
            setPendingCustomerName(null);
          }
        }}
      />
    </Box>
  );
};

export default Billing;