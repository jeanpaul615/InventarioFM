"use client";
import React, { useEffect, useState } from "react";
import { Box, Divider } from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import AddProductModal from "./AddProductModal";
import CustomerForm from "./CustomerForm";
import AlertSnackbar from "./AlertSnackbar";
import ConfirmDialog from "./ConfirmDialog";
import BillingHeader from "./Billing/BillingHeader";
import BillingButtons from "./Billing/BillingButton";
import InvoiceTable from "./Billing/InvoiceTable";
import InvoiceTotals from "./Billing/InvoiceTotals";
import InvoiceFooter from "./Billing/InvoiceFooter";
import { InventoryItem } from "./Billing/InventoryItem";
import InvoiceHeader from "./Billing/InvoiceHeader";

const mockInventory: InventoryItem[] = [
  { id: 1, name: "Producto A", price: 100, stock: 10 },
  { id: 2, name: "Producto B", price: 200, stock: 5 },
  { id: 3, name: "Producto C", price: 50, stock: 20 },
];

const Billing: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<
    { item: InventoryItem & { billProductId?: number }; quantity: number }[]
  >([]);
  const [total, setTotal] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [products, setProducts] = useState<InventoryItem[]>(mockInventory);
  const [customerName, setCustomerName] = useState("");
  const [currentBillId, setCurrentBillId] = useState<number | null>(null);
  const [customerData, setCustomerData] = useState({
    nombre: '',
    cedula: '',
    direccion: '',
    telefono: ''
  });

  // Al montar, busca el customer_id y carga los datos del cliente
  useEffect(() => {
    const stored = localStorage.getItem("currentBillId");
    if (stored) setCurrentBillId(Number(stored));
    const storedCustomerId = localStorage.getItem("customer_id");
    if (storedCustomerId) {
      fetch(`http://localhost:8000/customers/${storedCustomerId}`)
        .then(res => res.json())
        .then(data => {
          setCustomerData({
            nombre: data.nombre || '',
            cedula: data.cedula || '',
            direccion: data.direccion || '',
            telefono: data.telefono || ''
          });
        });
    }
  }, []);

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
              billProductId: bp.id, // <-- agrega el id de la relación
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
    const customerId = localStorage.getItem("customer_id");

    let customer = null;

    if (customerId) {
      // Si ya hay un customer_id, usa ese cliente existente
      const res = await fetch(`http://localhost:8000/customers/${customerId}`);
      if (!res.ok) {
        showAlert("No se pudo obtener el cliente existente", "error");
        return;
      }
      customer = await res.json();
    } else {
      // Si no hay customer_id, crea el cliente
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
      customer = await customerResponse.json();
      localStorage.setItem("customer_id", customer.id?.toString() || '');
    }

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

  const handleRemoveProduct = async (billProductId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/bill-products/${billProductId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        showAlert(errorData.message || "No se pudo eliminar el producto", "error");
        return;
      }
      showAlert("Producto eliminado de la factura", "success");
      // Recarga la factura para reflejar el cambio
      if (currentBillId) {
        const res = await fetch(`http://localhost:8000/bills/${currentBillId}`);
        if (res.ok) {
          const bill = await res.json();
          if (Array.isArray(bill.billProducts)) {
            const items = bill.billProducts.map((bp: any) => ({
              item: {
                id: bp.product?.id ?? bp.id,
                name: bp.product?.nombre ?? "Producto SIN NOMBRE",
                price: bp.price ?? bp.product?.price ?? 0,
                stock: bp.product?.stock ?? 0,
                billProductId: bp.id,
              },
              quantity: bp.quantity,
            }));
            setSelectedItems(items);
            const totalFactura = items.reduce(
              (acc: number, curr: any) => acc + curr.item.price * curr.quantity,
              0
            );
            setTotal(totalFactura);
          }
        }
      }
    } catch (error: any) {
      showAlert(error?.message || "Error al eliminar el producto", "error");
    }
  };

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setSelectedItems(prev =>
      prev.map(({ item, quantity }) =>
        item.id === productId
          ? { item, quantity: newQuantity }
          : { item, quantity }
      )
    );
    // Si quieres persistir en backend, aquí puedes hacer un fetch PATCH/PUT
  };

  // Sincroniza inventario y factura: descuenta stock y setea la factura
  const handleSyncStockAndBill = async () => {
    if (!currentBillId) {
      showAlert("No hay factura activa para modificar.", "warning");
      return;
    }
    try {
      // 1. Actualizar el stock de cada producto en el backend
      for (const { item, quantity } of selectedItems) {
        await fetch(`http://localhost:8000/products/${item.id}/decrement-stock`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity }),
        });
      }
      // 2. Setear la factura como finalizada (o el estado que corresponda)
      await fetch(`http://localhost:8000/bills/${currentBillId}/finalize`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      // 3. Reiniciar la factura (limpiar estado y localStorage)
      setCurrentBillId(null);
      setSelectedItems([]);
      setTotal(0);
      setCustomerName("");
      localStorage.removeItem("currentBillId");
      localStorage.removeItem("customerName");
      showAlert("Inventario actualizado y factura finalizada. Factura reiniciada.", "success");
    } catch (error) {
      showAlert("Error al actualizar inventario o factura", "error");
    }
  };

  return (
    <Box sx={{ p: 5, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <BillingHeader currentBillId={currentBillId} />
      <Divider sx={{ mb: 4 }} />
      <BillingButtons
        onAddProduct={handleOpenAddModal}
        onDownloadPDF={handleGeneratePDF}
        onSyncStock={handleSyncStockAndBill}
      />
      <CustomerForm onSubmit={(customer) => {
        setCustomerData({
          nombre: customer.nombre,
          cedula: customer.cedula,
          direccion: customer.direccion,
          telefono: customer.telefono
        });
        localStorage.setItem("customer_id", customer.id?.toString() || '');
        localStorage.setItem("customer_cedula", customer.cedula || '');
        localStorage.setItem("customer_direccion", customer.direccion || '');
        localStorage.setItem("customer_telefono", customer.telefono || '');
        handleCreateBill(customer.nombre);
      }} />
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
        <InvoiceHeader
          currentBillId={currentBillId}
          customer={customerData}
        />
        <Divider sx={{ mb: 2 }} />
      <InvoiceTable
        groupedItems={groupedItems}
        billId={currentBillId!}
        handleQuantityChange={handleQuantityChange}
        handleRemoveProduct={handleRemoveProduct}
        total={total}
        updateTotal={setTotal}
      />
        <InvoiceTotals total={total} />
        <Divider sx={{ my: 2 }} />
        <InvoiceFooter />
      </Box>
      <AlertSnackbar
        open={alert.open}
        message={alert.message}
        severity={alert.severity}
        onClose={() => setAlert({ ...alert, open: false })}
      />
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