"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Button,
} from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useApi } from "../../context/ApiContext";

interface QuotationProduct {
  id: number;
  product: {
    id: number;
    nombre: string;
  };
  quantity: number;
  price: number;
}

interface Quotation {
  id: number;
  date: string;
  quotationProducts: QuotationProduct[];
  customer: { id: number; nombre: string } | null;
}

const QuotationView: React.FC = () => {
  const { baseUrl } = useApi();
  const params = useParams();
  const quotationId = params?.id;
  const [quotation, setQuotation] = useState<Quotation | null>(null);

  useEffect(() => {
    if (!quotationId || !baseUrl) return;
    fetch(`${baseUrl}/quotations/${quotationId}`)
      .then(res => res.json())
      .then(data => setQuotation(data));
  }, [quotationId, baseUrl]);

  const getTotal = () =>
    quotation?.quotationProducts.reduce((acc, qp) => acc + qp.price * qp.quantity, 0) ?? 0;

  const handleGeneratePDF = async () => {
    const invoiceElement = document.getElementById("quotation-invoice");
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

    const scale = 3;
    const canvas = await html2canvas(invoiceElement, {
      scale,
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
      orientation: "p",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight <= pageHeight - 20) {
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight, undefined, "FAST");
    } else {
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

    pdf.save(`Cotizacion_${quotation?.id || "Ferremolina"}.pdf`);
  };

  if (!quotation) {
    return (
      <Box sx={{ p: 5 }}>
        <Typography variant="h6" color="text.secondary">
          Cargando cotización...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 5, background: "linear-gradient(135deg, #e0e7ef 0%, #f9f9f9 100%)", minHeight: "100vh" }}>
      <Typography variant="h3" fontWeight={900} color="#1e88e5" mb={2} letterSpacing={2} sx={{ textShadow: "0 2px 8px #b3c6e0" }}>
        Cotización
      </Typography>
      <Typography variant="subtitle1" color="#1976d2" mb={4} fontWeight={600}>
        Documento no fiscal. Solo informativo para el cliente.
      </Typography>
      <Divider sx={{ mb: 4, borderColor: "#1976d2" }} />
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
        {/* Encabezado empresa y datos cotización */}
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, gap: 3, mb: 3 }}>
          <img
            src="/logo.webp"
            alt="Logo de Ferremolina"
            style={{ width: 72, height: 72, borderRadius: 12, boxShadow: "0 2px 8px #ffe0b2" }}
          />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: "#ff6600", letterSpacing: 1 }}>
              DISTRIBUCIONES FERREMOLINA
            </Typography>
            <Typography sx={{ color: "#b26a00", fontSize: 14 }}>
              Calle 8 Bis N. 37-22, Pereira, Risaralda
            </Typography>
            <Typography sx={{ color: "#b26a00", fontSize: 14 }}>
              Tel: +57 312 346 7272
            </Typography>
            <Typography sx={{ color: "#b26a00", fontSize: 14 }}>
              Email: <span style={{ color: "#ff6600" }}>ventas.ferremolina@gmail.com</span>
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }} />
          <Box
            sx={{
              textAlign: "right",
              minWidth: 200,
              background: "#fff7ed",
              borderRadius: 3,
              border: "1.5px solid #ffe0b2",
              p: 2,
              boxShadow: "0 4px 10px #ffe0b288",
            }}
          >
            <Typography sx={{ color: "#ff6600", fontWeight: 700, fontSize: 16 }}>
              Cotización
            </Typography>
            <Typography sx={{ color: "#b26a00", fontSize: 14 }}>
              <b>No:</b> {quotation.id}
            </Typography>
            <Typography sx={{ color: "#b26a00", fontSize: 14 }}>
              <b>Fecha:</b> {quotation.date ? new Date(quotation.date).toLocaleDateString() : ""}
            </Typography>
          </Box>
        </Box>
        {/* Cliente */}
        <Box
          sx={{
            border: "1px solid #ff6600",
            borderRadius: 3,
            p: 3,
            background: "#fff8f3",
            boxShadow: "0 4px 10px #ff660020",
            mb: 2,
          }}
        >
          <Typography sx={{ color: "#ff6600", fontWeight: 700, mb: 2, fontSize: 16 }}>
            Datos del Cliente
          </Typography>
          <Typography sx={{ color: "#b26a00", fontSize: 14 }}>
            <b>Nombre:</b> {quotation.customer?.nombre || <span style={{ color: "#ffd8b3" }}>Sin nombre</span>}
          </Typography>
        </Box>
        <Divider sx={{ mb: 2, borderColor: "#ff6600" }} />
        {/* Tabla de productos */}
        <TableContainer
          component={Paper}
          sx={{
            mb: 3,
            borderRadius: 2,
            border: "1.5px solid #ffb74d",
            background: "#fff3e0",
            boxShadow: "0 2px 8px #ffe0b2",
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ background: "#fff3e0" }}>
                <TableCell sx={{ color: "#ff6600", fontWeight: 800, fontSize: 16, borderBottom: "2.5px solid #ffb74d", letterSpacing: 1, textAlign: "center" }}>
                  Código
                </TableCell>
                <TableCell sx={{ color: "#ff6600", fontWeight: 800, fontSize: 16, borderBottom: "2.5px solid #ffb74d", letterSpacing: 1, textAlign: "center" }}>
                  Producto
                </TableCell>
                <TableCell sx={{ color: "#ff6600", fontWeight: 800, fontSize: 16, borderBottom: "2.5px solid #ffb74d", letterSpacing: 1, textAlign: "center" }}>
                  Cantidad
                </TableCell>
                <TableCell sx={{ color: "#ff6600", fontWeight: 800, fontSize: 16, borderBottom: "2.5px solid #ffb74d", letterSpacing: 1, textAlign: "center" }}>
                  Precio Unitario
                </TableCell>
                <TableCell sx={{ color: "#ff6600", fontWeight: 800, fontSize: 16, borderBottom: "2.5px solid #ffb74d", letterSpacing: 1, textAlign: "center" }}>
                  Subtotal
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quotation.quotationProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ color: "#ffd8b3", fontStyle: "italic" }}>
                    No hay productos agregados a la cotización.
                  </TableCell>
                </TableRow>
              ) : (
                quotation.quotationProducts.map((qp, idx) => (
                  <TableRow
                    key={qp.id}
                    hover
                    sx={{
                      background: idx % 2 === 0 ? "#fffbe6" : "#ffffff",
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell sx={{ color: "#607d8b", fontWeight: 600, textAlign: "center" }}>{qp.product.id}</TableCell>
                    <TableCell sx={{ color: "#263238", fontWeight: 500, textAlign: "center" }}>{qp.product.nombre}</TableCell>
                    <TableCell sx={{ color: "#263238", textAlign: "center" }}>{qp.quantity}</TableCell>
                    <TableCell sx={{ color: "#263238", textAlign: "center" }}>
                      ${qp.price.toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ color: "#ff6600", fontWeight: 700, textAlign: "center" }}>
                      ${(qp.price * qp.quantity).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider sx={{ my: 2, borderColor: "#ff6600" }} />
        {/* Totales y pie de cotización */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 4 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ color: "#b26a00", fontWeight: 500 }}>
              Subtotal:
            </Typography>
            <Typography variant="body1" sx={{ color: "#222", fontWeight: 600 }}>
              ${(getTotal()).toLocaleString()}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="h6" sx={{ color: "#ff6600", fontWeight: 700 }}>
              Total Cotización: ${(getTotal()).toLocaleString()}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 2, borderColor: "#ff6600" }} />
        <Box sx={{
          textAlign: "center",
          color: "#b26a00",
          fontSize: 14,
          mt: 3,
          mb: 1,
          p: 2,
          borderRadius: 2,
          background: "#fffbe6",
        }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#ff6600", mb: 1 }}>
            ¡Gracias por su interés!
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Esta cotización es informativa y no constituye un documento fiscal.<br />
            Válida por 15 días a partir de la fecha de emisión.
          </Typography>
          <Divider sx={{ my: 1, mx: "auto", width: "60%" }} />
          <Typography variant="body2" sx={{ color: "#b26a00" }}>
            Calle 8 Bis N. 37-22 Pereira &nbsp;|&nbsp; Tel: +57 312 346 7272 &nbsp;|&nbsp; Email: ventas.ferremolina@gmail.com
          </Typography>
        </Box>
      </Box>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          color="warning"
          onClick={handleGeneratePDF}
          startIcon={
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <rect x="4" y="4" width="16" height="16" rx="3" fill="#fff" />
              <path d="M8 12h8M12 8v8" stroke="#ff6600" strokeWidth="2" strokeLinecap="round" />
            </svg>
          }
          sx={{
            px: 3,
            py: 1.2,
            fontWeight: 700,
            fontSize: 16,
            borderRadius: 2,
            boxShadow: "0 2px 8px #ffd8b3",
            letterSpacing: 1,
            background: "linear-gradient(90deg, #ff6600 60%, #ffb366 100%)",
            transition: "all 0.2s",
            "&:hover": {
              background: "linear-gradient(90deg, #b26a00 60%, #ffd8b3 100%)",
              boxShadow: "0 4px 16px #ffd8b3",
              transform: "translateY(-2px) scale(1.03)",
            },
          }}
        >
          Descargar Cotización en PDF
        </Button>
      </Box>
    </Box>
  );
};

export default QuotationView;
