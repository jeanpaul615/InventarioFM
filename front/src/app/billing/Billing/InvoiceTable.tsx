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
import React, { useState } from "react";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QuantityModal from "./QuantityModal";

interface InvoiceTableProps {
  groupedItems: (InventoryItem & { quantity: number })[];
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const onQuantityChange = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    handleQuantityChange(productId, newQuantity);
    const updatedTotal = groupedItems.reduce((acc, item) => {
      return item.id === productId
        ? acc + item.price * newQuantity
        : acc + item.price * item.quantity;
    }, 0);
    updateTotal(updatedTotal);
    try {
      const response = await axios.patch(
        `http://localhost:8000/bills/${billId}/products/${productId}/quantity`,
        {
          quantity: newQuantity,
        }
      );
      console.log("Cantidad actualizada en la base de datos:", response.data);
    } catch (error) {
      console.error("Error al actualizar la cantidad en la base de datos:", error);
    }
  };

  const onRemoveProduct = async (productId: number) => {
    await handleRemoveProduct(productId);
    const updatedItems = groupedItems.filter((item) => item.id !== productId);
    const updatedTotal = updatedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    updateTotal(updatedTotal);
  };

  const handleGeneratePDF = async () => {
    const invoiceElement = document.getElementById("invoice");
    if (!invoiceElement) return;

    const canvas = await html2canvas(invoiceElement, {
      scale: 2, // Escalado para mejorar la calidad
      backgroundColor: "#fff",
      useCORS: true,
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
                  <TableCell sx={{ color: "#263238", textAlign: "center" }}>
                    <TextField
                      type="number"
                      size="small"
                      value={item.quantity}
                      inputProps={{
                        min: 1,
                        style: {
                          width: isMobile ? 50 : 60,
                          textAlign: "center",
                          fontSize: isMobile ? 12 : 14, // Ajuste de tamaño de letra
                        },
                      }}
                      onChange={(e) =>
                        onQuantityChange(item.id, Number(e.target.value))
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          "&:hover fieldset": {
                            borderColor: "#1565c0",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#1565c0",
                          },
                        },
                      }}
                    />
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
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => onRemoveProduct(item.id)}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontSize: isMobile ? 12 : 14,
                        "&:hover": {
                          backgroundColor: "#f44336",
                          color: "#fff",
                        },
                      }}
                    >
                      Eliminar
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => handleOpenModal(item.id)}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontSize: isMobile ? 12 : 14,
                        ml: 1,
                        "&:hover": {
                          backgroundColor: "#1976d2",
                          color: "#fff",
                        },
                      }}
                    >
                      Cambiar cantidad
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