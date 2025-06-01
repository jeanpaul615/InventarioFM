"use client";
import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    // Solo se ejecuta en el cliente
    const stored = localStorage.getItem("currentBillId");
    if (stored) setCurrentBillId(Number(stored));
    const storedCustomerName = localStorage.getItem("customerName");
    if (storedCustomerName) setCustomerName(storedCustomerName);
  }, []);

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

    // Aumenta la resolución del canvas
    const scale = 4;
    const canvas = await html2canvas(invoiceElement, {
      scale,
      backgroundColor: "#fff", // Fondo blanco
      useCORS: true,
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

  useEffect(() => {
    const fetchBill = async () => {
      if (!currentBillId) return;
      try {
        const response = await fetch(`http://localhost:8000/bills/${currentBillId}`);
        if (!response.ok) {
          showAlert("No se pudo obtener la factura actual", "error");
          return;
        }
        const bill = await response.json();
        // Mapea los productos solo con los datos disponibles
        if (Array.isArray(bill.billProducts)) {
          const items = bill.billProducts.map((bp: any) => ({
            item: {
              id: bp.product?.id ?? bp.id,
              name: bp.product?.nombre ?? "Producto SIN NOMBRE",
              price: bp.price ?? bp.product?.price ?? 0,
              stock: bp.product?.stock ?? 0,
            },
            quantity: bp.quantity,
          }));
          setSelectedItems(items);

          // Calcula el total
          const totalFactura = items.reduce(
            (acc: number, curr: any) => acc + curr.item.price * curr.quantity,
            0
          );
          setTotal(totalFactura);
        }
        // Setea el nombre del cliente si lo necesitas
        if (bill.customer && bill.customer.nombre) {
          setCustomerName(bill.customer.nombre);
        }
      } catch (error) {
        showAlert("Error al consultar la factura", "error");
      }
    };

    fetchBill();
  }, [currentBillId]);


  const createBillFlow = async (name: string) => {
    setCustomerName(name);
    localStorage.setItem("customerName", name);

    // Recupera la lista seleccionada (o usa una por defecto)
    const lista = localStorage.getItem("customer_lista") || "lista_1";

    // 1. Crear el cliente y obtener su ID
    const customerResponse = await fetch("http://localhost:8000/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: name,
        caracterizacion: lista,
      }),
    });

    if (!customerResponse.ok) {
      showAlert("Error al crear el cliente", "error");
      return;
    }

    const customer = await customerResponse.json();

    // 2. Crear la factura usando el ID del cliente
    const billResponse = await fetch("http://localhost:8000/bills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: customer.id, // <-- solo el ID
      }),
    });

    if (!billResponse.ok) {
      showAlert("Error al crear la factura", "error");
      return;
    }

    const bill = await billResponse.json();
    setCurrentBillId(bill.id);
    // 3. (Opcional) Agregar productos a la factura si hay productos seleccionados
    if (selectedItems.length > 0) {
      for (const { item, quantity } of selectedItems) {
        await fetch("http://localhost:8000/bill-products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bill: item.id,
            product: item.id,
            quantity,
            price: item.price,
          }),
        });
      }
    }

    showAlert("Factura creada correctamente", "success");
  };

  useEffect(() => {
    if (currentBillId) {
      localStorage.setItem("currentBillId", currentBillId.toString());
    } else {
      localStorage.removeItem("currentBillId");
      //localStorage.removeItem("customerName"); // <-- Limpia el nombre si no hay factura
      //setCustomerName(""); // <-- Limpia el estado también
    }
  }, [currentBillId]);

  // Agrupa los productos por id y suma cantidades y subtotales
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

      {/* --- Mejora visual de los botones --- */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          gap: 3,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenAddModal}
          startIcon={
            <span
              style={{
                display: "inline-block",
                width: 22,
                height: 22,
                background: "linear-gradient(135deg, #1976d2 60%, #64b5f6 100%)",
                borderRadius: "50%",
                color: "#fff",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 18,
                lineHeight: "22px",
              }}
            >
              +
            </span>
          }
          sx={{
            px: 3,
            py: 1.2,
            fontWeight: 700,
            fontSize: 16,
            borderRadius: 2,
            boxShadow: "0 2px 8px #1976d233",
            letterSpacing: 1,
            background: "linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)",
            transition: "all 0.2s",
            "&:hover": {
              background: "linear-gradient(90deg, #1565c0 60%, #42a5f5 100%)",
              boxShadow: "0 4px 16px #1976d244",
              transform: "translateY(-2px) scale(1.03)",
            },
          }}
        >
          Agregar Producto
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleGeneratePDF}
          startIcon={
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <rect x="4" y="4" width="16" height="16" rx="3" fill="#fff" />
              <path d="M8 12h8M12 8v8" stroke="#43a047" strokeWidth="2" strokeLinecap="round" />
            </svg>
          }
          sx={{
            px: 3,
            py: 1.2,
            fontWeight: 700,
            fontSize: 16,
            borderRadius: 2,
            boxShadow: "0 2px 8px #43a04733",
            letterSpacing: 1,
            background: "linear-gradient(90deg, #43a047 60%, #81c784 100%)",
            transition: "all 0.2s",
            "&:hover": {
              background: "linear-gradient(90deg, #388e3c 60%, #66bb6a 100%)",
              boxShadow: "0 4px 16px #43a04744",
              transform: "translateY(-2px) scale(1.03)",
            },
          }}
        >
          Descargar Factura en PDF
        </Button>
      </Box>
      {/* --- Fin de mejora visual de los botones --- */}

      {/* Customer Form */}
      <CustomerForm onSubmit={(customer) => handleCreateBill(customer.nombre)} />

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
        {/* Encabezado de factura y empresa */}
        <Box sx={{
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: 2,
}}>
  {/* Logo y nombre empresa */}
  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
    <img
      src="logo.webp"
      alt="Logo de Ferremolina"
      style={{ width: 90, height: "auto", borderRadius: 8, boxShadow: "0 2px 8px #e0e7ef" }}
    />
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, color: "#1565c0", letterSpacing: 1 }}>
        Ferremolina
      </Typography>
      <Typography variant="subtitle2" sx={{ color: "#607d8b", fontWeight: 500 }}>
        Distribuciones Ferremolina
      </Typography>
    </Box>
  </Box>
  {/* Datos de la factura */}
  <Box sx={{ textAlign: "right" }}>
    <Typography variant="body2" sx={{ color: "#607d8b", fontWeight: 500 }}>
      Factura N°: <span style={{ color: "#263238", fontWeight: 700 }}>{currentBillId || "En curso"}</span>
    </Typography>
    <Typography variant="body2" sx={{ color: "#607d8b" }}>
      Fecha: <span style={{ color: "#263238" }}>{new Date().toLocaleDateString()}</span>
    </Typography>
  </Box>
</Box>

<Divider sx={{ mb: 2 }} />

{/* Dirección y Teléfono en bloque aparte */}
<Box sx={{
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: 2,
  px: 1,
}}>
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
    <Typography variant="body2" sx={{ color: "#607d8b" }}>
      Email: <span style={{ color: "#222" }}>cabran112@gmail.com</span>
    </Typography>
  </Box>
</Box>

<Divider sx={{ mb: 2 }} />

{/* Cliente en bloque aparte */}
<Box sx={{ mb: 2 }}>
  <Typography variant="subtitle2" sx={{ color: "#607d8b", fontWeight: 500 }}>
    Cliente:
  </Typography>
  <Typography variant="body1" sx={{ fontWeight: 600, color: "#222" }}>
    {customerName || <span style={{ color: "#bdbdbd" }}>Sin nombre</span>}
  </Typography>
</Box>

        {/* Tabla de productos */}
        <TableContainer
          component={Paper}
          sx={{
            mb: 3,
            borderRadius: 2,
            border: "1.5px solid #e0e7ef",
            background: "#f8fafc",
            boxShadow: "0 2px 8px #e0e7ef",
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ background: "#e3eafc" }}>
                <TableCell
                  sx={{
                    color: "#1565c0",
                    fontWeight: 800,
                    fontSize: 16,
                    borderBottom: "2.5px solid #b0bec5",
                    letterSpacing: 1,
                    textAlign: "center",
                  }}
                >
                  Código
                </TableCell>
                <TableCell
                  sx={{
                    color: "#1565c0",
                    fontWeight: 800,
                    fontSize: 16,
                    borderBottom: "2.5px solid #b0bec5",
                    letterSpacing: 1,
                    textAlign: "center",
                  }}
                >
                  Producto
                </TableCell>
                <TableCell
                  sx={{
                    color: "#1565c0",
                    fontWeight: 800,
                    fontSize: 16,
                    borderBottom: "2.5px solid #b0bec5",
                    letterSpacing: 1,
                    textAlign: "center",
                  }}
                >
                  Cantidad
                </TableCell>
                <TableCell
                  sx={{
                    color: "#1565c0",
                    fontWeight: 800,
                    fontSize: 16,
                    borderBottom: "2.5px solid #b0bec5",
                    letterSpacing: 1,
                    textAlign: "center",
                  }}
                >
                  Precio Unitario
                </TableCell>
                <TableCell
                  sx={{
                    color: "#1565c0",
                    fontWeight: 800,
                    fontSize: 16,
                    borderBottom: "2.5px solid #b0bec5",
                    letterSpacing: 1,
                    textAlign: "center",
                  }}
                >
                  Subtotal
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groupedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ color: "#bdbdbd", fontStyle: "italic" }}>
                    No hay productos agregados a la factura.
                  </TableCell>
                </TableRow>
              ) : (
                groupedItems.map((item, idx) => (
                  <TableRow
                    key={item.id}
                    hover
                    sx={{
                      background: idx % 2 === 0 ? "#f5f7fa" : "#ffffff",
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell sx={{ color: "#607d8b", fontWeight: 600, textAlign: "center" }}>{item.id}</TableCell>
                    <TableCell sx={{ color: "#263238", fontWeight: 500, textAlign: "center" }}>{item.name}</TableCell>
                    <TableCell sx={{ color: "#263238", textAlign: "center" }}>{item.quantity}</TableCell>
                    <TableCell sx={{ color: "#263238", textAlign: "center" }}>
                      ${item.price.toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ color: "#1565c0", fontWeight: 700, textAlign: "center" }}>
                      ${(item.price * item.quantity).toLocaleString()}
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

        <Box sx={{
  textAlign: "center",
  color: "#607d8b",
  fontSize: 14,
  mt: 3,
  mb: 1,
  p: 2,
  borderRadius: 2,
  background: "#f5f7fa",
}}>
  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1565c0", mb: 1 }}>
    ¡Gracias por su compra!
  </Typography>
  <Typography variant="body2" sx={{ mb: 1 }}>
    Esta factura es un documento electrónico generado por Ferremolina.<br />
    Por favor conserve este comprobante para cualquier reclamo o garantía.
  </Typography>
  <Divider sx={{ my: 1, mx: "auto", width: "60%" }} />
  <Typography variant="body2" sx={{ color: "#263238" }}>
    Calle 8 Bis N. 37-22 Pereira &nbsp;|&nbsp; Tel: +57 312 346 7272 &nbsp;|&nbsp; Email: cabran112@gmail.com
  </Typography>
</Box>
      </Box>

      {/* Snackbar de alertas */}
      <AlertSnackbar
        open={alert.open}
        message={alert.message}
        severity={alert.severity}
        onClose={() => setAlert({ ...alert, open: false })}
      />



      {/* Add Product Modal */}
      <AddProductModal
         open={isAddModalOpen}
          onClose={handleCloseAddModal}
          onAdd={handleAddItem}
          billId={currentBillId}
        />

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