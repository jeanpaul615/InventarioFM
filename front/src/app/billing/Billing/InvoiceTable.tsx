import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Box,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { InventoryItem } from "./InventoryItem";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QuantityModal from "./QuantityModal";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from 'next/navigation';
import { useApi } from "../../context/ApiContext";

interface InvoiceTableProps {
  groupedItems: (InventoryItem & { quantity: number, billProductId?: number })[];
  handleQuantityChange: (productId: number, newQuantity: number) => void;
  handleRemoveProduct: (productId: number) => void;
  billId: number;
  total: number;
  updateTotal: (newTotal: number) => void;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({
  groupedItems,
  handleQuantityChange,
  handleRemoveProduct,
  billId,
  total,
  updateTotal,
}) => {
  const { baseUrl } = useApi();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
      }
    }
  }, [router]);

  const onQuantityChange = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1 || !baseUrl) return;
    // Primero actualiza el estado local antes de calcular el total
    await handleQuantityChange(productId, newQuantity);
    // Calcula el total usando el nuevo estado (no el groupedItems anterior)
    // Opcional: puedes pedirle al padre que recalcule el total, o forzar un refetch
    try {
      const response = await axios.patch(
        `${baseUrl}/bills/${billId}/products/${productId}/quantity`,
        {
          quantity: newQuantity,
        }
      );
      console.log("Cantidad actualizada en la base de datos:", response.data);
    } catch (error) {
      console.error("Error al actualizar la cantidad en la base de datos:", error);
    }
  };

  const onRemoveProduct = async (productId: number, billProductId?: number) => {
    if (!baseUrl) return;
    // Confirmación directa (sin modal):
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto de la factura?')) {
      try {
        if (billProductId) {
          await axios.delete(`${baseUrl}/bill-products/${billProductId}`);
        } else {
          await axios.delete(`${baseUrl}/bills/${billId}/products/${productId}`);
        }
        await handleRemoveProduct(productId);
        console.log("Producto eliminado completamente de la base de datos y del estado local");
      } catch (error) {
        console.error("Error al eliminar el producto de la base de datos:", error);
      }
    }
  };

  const handleGeneratePDF = async () => {
    const invoiceElement = document.getElementById("invoice");
    if (!invoiceElement) return;

    // Guardar estilos originales
    const originalWidth = invoiceElement.style.width;
    const originalMinWidth = invoiceElement.style.minWidth;
    const originalOverflow = invoiceElement.style.overflow;
    
    // Forzar ancho de escritorio para la captura
    invoiceElement.style.width = '1024px';
    invoiceElement.style.minWidth = '1024px';
    invoiceElement.style.overflow = 'visible';

    // Forzar tamaños de fuente de escritorio en todas las celdas
    const tableCells = invoiceElement.querySelectorAll('th, td');
    const originalFontSizes: string[] = [];
    tableCells.forEach((cell, index) => {
      const htmlCell = cell as HTMLElement;
      originalFontSizes[index] = htmlCell.style.fontSize || '';
      htmlCell.style.fontSize = '16px';
    });

    // Esperar un momento para que el DOM se actualice
    await new Promise(resolve => setTimeout(resolve, 100));

    const canvas = await html2canvas(invoiceElement, {
      scale: 3, // Escalado para mejorar la calidad
      backgroundColor: "#fff",
      useCORS: true,
      width: 1024,
      windowWidth: 1024,
    });

    // Restaurar estilos originales
    invoiceElement.style.width = originalWidth;
    invoiceElement.style.minWidth = originalMinWidth;
    invoiceElement.style.overflow = originalOverflow;
    tableCells.forEach((cell, index) => {
      (cell as HTMLElement).style.fontSize = originalFontSizes[index];
    });

    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4", // Formato A4 para garantizar consistencia
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20; // Margen de 10mm a cada lado
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight <= pageHeight - 20) {
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight, undefined, "FAST");
    } else {
      let renderedHeight = 0;
      while (renderedHeight < canvas.height) {
        const pageCanvas = document.createElement("canvas");
        const pageCtx = pageCanvas.getContext("2d")!;
        const pageImgHeight = Math.floor((canvas.width * (pageHeight - 20)) / imgWidth);

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

    pdf.save(`Factura_${billId || "Ferremolina"}.pdf`);
  };

  const handleOpenModal = (itemId: number) => {
    setSelectedItemId(itemId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedItemId(null);
  };

  const handleSubmitQuantity = (quantity: number) => {
    if (selectedItemId !== null) {
      onQuantityChange(selectedItemId, quantity);
    }
  };

  return (
    <Box sx={{ p: isMobile ? 2 : 5 }}>
      {/* Encabezado responsivo */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
      </Box>

      <TableContainer
        component={Paper}
        id="invoice"
        sx={{
          mb: 3,
          borderRadius: 2,
          border: "1.5px solid #e0e7ef",
          background: "#f8fafc",
          boxShadow: "0 2px 8px #e0e7ef",
          overflowX: isMobile ? "scroll" : "visible", // Ajuste para pantallas pequeñas
        }}
      >
        <Table size={isMobile ? "small" : "medium"}>
          <TableHead>
            <TableRow sx={{ background: "#e3eafc" }}>
              <TableCell
                sx={{
                  color: "#1565c0",
                  fontWeight: 800,
                  fontSize: isMobile ? 12 : 16, // Ajuste de tamaño de letra
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
                  fontSize: isMobile ? 12 : 16, // Ajuste de tamaño de letra
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
                  fontSize: isMobile ? 12 : 16, // Ajuste de tamaño de letra
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
                  fontSize: isMobile ? 12 : 16, // Ajuste de tamaño de letra
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
                  fontSize: isMobile ? 12 : 16, // Ajuste de tamaño de letra
                  borderBottom: "2.5px solid #b0bec5",
                  letterSpacing: 1,
                  textAlign: "center",
                }}
              >
                Subtotal
              </TableCell>
              <TableCell
                className="no-print"
                sx={{
                  color: "#1565c0",
                  fontWeight: 800,
                  borderBottom: "2.5px solid #b0bec5",
                  letterSpacing: 1,
                  textAlign: "center",
                }}
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groupedItems.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  sx={{ color: "#bdbdbd", fontStyle: "italic", fontSize: isMobile ? 12 : 14 }}
                >
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
                  <TableCell
                    sx={{
                      color: "#607d8b",
                      fontWeight: 600,
                      textAlign: "center",
                      fontSize: isMobile ? 12 : 14, // Ajuste de tamaño de letra
                    }}
                  >
                    {item.id}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#263238",
                      fontWeight: 500,
                      textAlign: "center",
                      fontSize: isMobile ? 12 : 14, // Ajuste de tamaño de letra
                    }}
                  >
                    {item.name}
                  </TableCell>
                  <TableCell sx={{ color: "#263238", textAlign: "center", fontWeight: 600, fontSize: isMobile ? 14 : 16, letterSpacing: 1 }}>
                    {item.quantity} {item.unidad || 'und'}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#263238",
                      textAlign: "center",
                      fontSize: isMobile ? 12 : 14, // Ajuste de tamaño de letra
                    }}
                  >
                    ${item.price.toLocaleString()}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#1565c0",
                      fontWeight: 700,
                      textAlign: "center",
                      fontSize: isMobile ? 12 : 14, // Ajuste de tamaño de letra
                    }}
                  >
                    ${(item.price * item.quantity).toLocaleString()}
                  </TableCell>
                  <TableCell className="no-print">
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => onRemoveProduct(item.id, item.billProductId)}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: isMobile ? 12 : 14,
                        boxShadow: '0 2px 8px #f4433622',
                        transition: 'background 0.2s',
                        px: 1.5,
                        '&:hover': {
                          backgroundColor: '#d32f2f',
                          color: '#fff',
                        },
                      }}
                    >
                      Eliminar
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleOpenModal(item.id)}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: isMobile ? 12 : 14,
                        ml: 1,
                        boxShadow: '0 2px 8px #1976d222',
                        transition: 'background 0.2s',
                        px: 1.5,
                        '&:hover': {
                          backgroundColor: '#115293',
                          color: '#fff',
                        },
                      }}
                    >
                      Editar cantidad
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <QuantityModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitQuantity}
      />
    </Box>
  );
};

export default InvoiceTable;