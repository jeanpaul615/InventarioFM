"use client";
import React, { useState, useEffect } from "react";
import { Box, Divider, Button, Typography } from "@mui/material";
import AddProductModalQuotation from "./AddProductModalQuotation";
import CustomerForm from "../billing/CustomerForm";
import AlertSnackbar from "../billing/AlertSnackbar";
import QuotationHeader from "./QuotationHeader";
import QuotationFooter from "./QuotationFooter";
import QuotationTable from "./QuotationTable";
import InvoiceTotals from "./InvoiceTotals";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Tipo específico para cotización
interface InventoryItem {
  id: number;
  nombre: string;
  cantidad: number;
  price?: number;
  lista_1?: number;
  lista_2?: number;
  lista_3?: number;
}

const Quotation: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<
    { item: InventoryItem; quantity: number }[]
  >([]);
  const [total, setTotal] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customer, setCustomer] = useState<any>(null);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });
  const [quotationId, setQuotationId] = useState<number | null>(null);
  const [isFinalized, setIsFinalized] = useState(false);

  const showAlert = (message: string, severity: "success" | "error" | "info" | "warning" = "info") => {
    setAlert({ open: true, message, severity });
  };

  const handleAddItem = (item: InventoryItem, quantity: number) => {
    // Si el producto tiene listas de precio, toma la primera disponible
    const price = typeof item.price === 'number' ? item.price : (item.lista_1 ?? item.lista_2 ?? item.lista_3 ?? 0);
    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + quantity, item: { ...i.item, price } } : i
        );
      } else {
        return [...prev, { item: { ...item, price }, quantity }];
      }
    });
    showAlert("Producto agregado a la cotización", "success");
  };

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setSelectedItems((prev) =>
      prev.map(({ item, quantity }) =>
        item.id === productId ? { item, quantity: newQuantity } : { item, quantity }
      )
    );
  };

  const handleRemoveProduct = (productId: number) => {
    setSelectedItems(selectedItems.filter(({ item }) => item.id !== productId));
    const newTotal = selectedItems
      .filter(({ item }) => item.id !== productId)
      .reduce((acc, curr) => acc + ((curr.item.price ?? 0) * curr.quantity), 0);
    setTotal(newTotal);
  };

  const groupedItems = Object.values(
    selectedItems.reduce((acc, { item, quantity }) => {
      if (!acc[item.id]) {
        acc[item.id] = { ...item, quantity };
      } else {
        acc[item.id].quantity += quantity;
      }
      return acc;
    }, {} as Record<number, InventoryItem & { quantity: number }>)
  );

  // Cargar datos guardados al montar
  useEffect(() => {
    const saved = localStorage.getItem("ferremolina-quotation");
    if (saved) {
      const { selectedItems, customer, quotationId, isFinalized } = JSON.parse(saved);
      setSelectedItems(selectedItems || []);
      setCustomer(customer || null);
      setQuotationId(quotationId || null);
      setIsFinalized(isFinalized || false);
    }
  }, []);

  // Guardar datos en localStorage al cambiar
  useEffect(() => {
    localStorage.setItem(
      "ferremolina-quotation",
      JSON.stringify({ selectedItems, customer, quotationId, isFinalized })
    );
  }, [selectedItems, customer, quotationId, isFinalized]);

  // Calcular el total correctamente cada vez que cambian los productos
  useEffect(() => {
    const newTotal = selectedItems.reduce((acc, curr) => acc + ((curr.item.price ?? 0) * curr.quantity), 0);
    setTotal(newTotal);
  }, [selectedItems]);

  const handleSaveQuotation = async () => {
    if (!customer || !customer.id) {
      showAlert("Selecciona un cliente válido", "error");
      return;
    }
    if (selectedItems.length === 0) {
      showAlert("Agrega al menos un producto", "error");
      return;
    }
    try {
      const payload = {
        customer: customer.id,
        products: selectedItems.map(({ item, quantity }) => ({
          product: item.id,
          quantity,
          price: item.price,
        })),
      };
      const res = await fetch("http://localhost:8000/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Error al guardar la cotización");
      const data = await res.json();
      setQuotationId(data.id); // Guardar el ID retornado
      setIsFinalized(true); // Bloquear edición
      showAlert("Cotización guardada correctamente", "success");
    } catch (err: any) {
      showAlert(err.message || "Error al guardar la cotización", "error");
    }
  };

  const handleNewQuotation = () => {
    setSelectedItems([]);
    setTotal(0);
    setCustomer(null);
    setQuotationId(null);
    setIsFinalized(false);
    localStorage.removeItem("ferremolina-quotation");
  };

  const handleGeneratePDF = async () => {
    const invoiceElement = document.getElementById("quotation-invoice");
    if (!invoiceElement) return;

    // Ocultar elementos no imprimibles antes de generar el PDF
    const nonPrintableElements = invoiceElement.getElementsByClassName('no-print');
    Array.from(nonPrintableElements).forEach((element: Element) => {
      (element as HTMLElement).style.display = 'none';
    });

    // Aumenta la resolución del canvas
    const scale = 4;
    const canvas = await html2canvas(invoiceElement, {
      scale,
      backgroundColor: "#fff",
      useCORS: true,
    });

    // Restaurar elementos no imprimibles
    Array.from(nonPrintableElements).forEach((element: Element) => {
      (element as HTMLElement).style.display = '';
    });

    const imgData = canvas.toDataURL("image/png", 1.0);

    const pdf = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Ajusta el tamaño de la imagen al PDF
    const imgWidth = pageWidth - 20; // 10mm margin each side
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight <= pageHeight - 20) {
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight, undefined, "FAST");
    } else {
      // Paginación automática
      let pageCanvas = document.createElement("canvas");
      let pageCtx = pageCanvas.getContext("2d")!;
      const pageImgHeight = Math.floor((canvas.width * (pageHeight - 20)) / imgWidth);

      let renderedHeight = 0;
      while (renderedHeight < canvas.height) {
        pageCanvas.width = canvas.width;
        pageCanvas.height = pageImgHeight;
        pageCtx.fillStyle = "#fff";
        pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

        pageCtx.drawImage(
          canvas,
          0,
          renderedHeight,
          canvas.width,
          pageImgHeight,
          0,
          0,
          canvas.width,
          pageImgHeight
        );

        const pageData = pageCanvas.toDataURL("image/png", 1.0);
        if (renderedHeight > 0) pdf.addPage();
        pdf.addImage(pageData, "PNG", 10, 10, imgWidth, pageHeight - 20, undefined, "FAST");

        renderedHeight += pageImgHeight;
      }
    }

    pdf.save("Cotizacion_Ferremolina.pdf");
    showAlert("Cotización descargada en PDF", "success");
  };

  return (
    <Box sx={{ p: 5, background: "linear-gradient(135deg, #e0e7ef 0%, #f9f9f9 100%)", minHeight: "100vh" }}>
      <Typography variant="h3" fontWeight={900} color="#1e88e5" mb={2} letterSpacing={2} sx={{ textShadow: "0 2px 8px #b3c6e0" }}>
        Cotización
      </Typography>
      <Typography variant="subtitle1" color="#1976d2" mb={4} fontWeight={600}>
        Documento no fiscal. Solo informativo para el cliente.
      </Typography>
      <Divider sx={{ mb: 4, borderColor: "#1976d2" }} />
      <Button
        variant="outlined"
        color="info"
        sx={{ mb: 2, fontWeight: 700, borderRadius: 2, px: 4, py: 1.2, borderWidth: 2, borderColor: '#1976d2' }}
        onClick={() => setIsAddModalOpen(true)}
        startIcon={<span style={{ fontWeight: 900, fontSize: 22 }}>+</span>}
      >
        Agregar Producto
      </Button>
      <CustomerForm onSubmit={(customer) => setCustomer(customer)}  />
      <Box
        id="quotation-invoice"
        sx={{
          p: 4,
          background: "#fff8f3",
          borderRadius: 3,
          boxShadow: "0 4px 24px rgba(255, 102, 0, 0.08)",
          border: "2px dashed #ff6600",
          mb: 4,
          maxWidth: 820,
          mx: "auto",
          fontFamily: "Roboto, Arial, sans-serif",
          transition: "box-shadow 0.2s",
          position: "relative",
        }}
      >
        <Box sx={{ position: "absolute", top: 16, right: 24, color: "#ff6600", fontWeight: 700, fontSize: 18, opacity: 0.7 }}>
          COTIZACIÓN
        </Box>
        <QuotationHeader
          quotationId={quotationId ?? undefined}
          customer={customer ? customer : { nombre: "", cedula: "", direccion: "", telefono: "" }}
        />
        <Divider sx={{ mb: 2, borderColor: "#ff6600" }} />
        <QuotationTable
          groupedItems={groupedItems.map((item) => ({
            id: item.id,
            name: item.nombre, // Usar nombre para la tabla
            price: item.price ?? 0,
            quantity: item.quantity ?? 0,
          }))}
          handleQuantityChange={handleQuantityChange}
          handleRemoveProduct={handleRemoveProduct}
          editable={!isFinalized}
        />
        <InvoiceTotals total={total} />
        <Divider sx={{ my: 2, borderColor: "#ff6600" }} />
        <QuotationFooter />
      </Box>
      <Button
        variant="contained"
        color="info"
        sx={{ fontWeight: 700, borderRadius: 2, px: 4, py: 1.2, background: "#1976d2", boxShadow: "0 2px 8px #b3c6e0" }}
        onClick={handleSaveQuotation}
        disabled={isFinalized}
      >
        Guardar Cotización
      </Button>
      <Button
        variant="outlined"
        color="warning"
        sx={{ fontWeight: 700, borderRadius: 2, px: 4, py: 1.2, ml: 2, borderWidth: 2, borderColor: '#ff6600', color: '#ff6600' }}
        onClick={handleGeneratePDF}
        className="no-print"
      >
        Imprimir PDF
      </Button>
      {isFinalized && (
        <Button
          variant="contained"
          color="success"
          sx={{ ml: 2, fontWeight: 700, borderRadius: 2, px: 4, py: 1.2 }}
          onClick={handleNewQuotation}
        >
          Nueva Cotización
        </Button>
      )}
      <AlertSnackbar
        open={alert.open}
        message={alert.message}
        severity={alert.severity as any}
        onClose={() => setAlert({ ...alert, open: false })}
      />
      <AddProductModalQuotation
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddItem}
      />
      {/* Puedes agregar ConfirmDialog si lo necesitas */}
    </Box>
  );
};

export default Quotation;