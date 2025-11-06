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

interface BillProduct {
  id: number;
  product: {
    id: number;
    nombre: string;
  };
  quantity: number;
  price: number;
}

interface Bill {
  id: number;
  date: string;
  billProducts: BillProduct[];
  customer: { id: number; nombre: string } | null;
}

const BillView: React.FC = () => {
  const { baseUrl } = useApi();
  const params = useParams();
  const billId = params?.id;
  const [bill, setBill] = useState<Bill | null>(null);

  useEffect(() => {
    if (!billId || !baseUrl) return;
    fetch(`${baseUrl}/bills/${billId}`)
      .then(res => res.json())
      .then(data => setBill(data));
  }, [billId, baseUrl]);

  const getTotal = () =>
    bill?.billProducts.reduce((acc, bp) => acc + bp.price * bp.quantity, 0) ?? 0;

  const handleGeneratePDF = async () => {
    const invoiceElement = document.getElementById("invoice");
    if (!invoiceElement) return;

    const scale = 4;
    const canvas = await html2canvas(invoiceElement, {
      scale,
      backgroundColor: "#fff",
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

    pdf.save(`Factura_${bill?.id || "Ferremolina"}.pdf`);
  };

  if (!bill) {
    return (
      <Box sx={{ p: 5 }}>
        <Typography variant="h6" color="text.secondary">
          Cargando factura...
        </Typography>
      </Box>
    );
  }

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
          <img src="/logo.webp" alt="Logo de Ferremolina" style={{ width: "100px", height: "auto" }} />
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
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
              src="/logo.webp"
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
              Factura N°: <span style={{ color: "#263238", fontWeight: 700 }}>{bill.id}</span>
            </Typography>
            <Typography variant="body2" sx={{ color: "#607d8b" }}>
              Fecha: <span style={{ color: "#263238" }}>{bill.date ? new Date(bill.date).toLocaleDateString() : ""}</span>
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
            {bill.customer?.nombre || <span style={{ color: "#bdbdbd" }}>Sin nombre</span>}
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
                <TableCell sx={{ color: "#1565c0", fontWeight: 800, fontSize: 16, borderBottom: "2.5px solid #b0bec5", letterSpacing: 1, textAlign: "center" }}>
                  Código
                </TableCell>
                <TableCell sx={{ color: "#1565c0", fontWeight: 800, fontSize: 16, borderBottom: "2.5px solid #b0bec5", letterSpacing: 1, textAlign: "center" }}>
                  Producto
                </TableCell>
                <TableCell sx={{ color: "#1565c0", fontWeight: 800, fontSize: 16, borderBottom: "2.5px solid #b0bec5", letterSpacing: 1, textAlign: "center" }}>
                  Cantidad
                </TableCell>
                <TableCell sx={{ color: "#1565c0", fontWeight: 800, fontSize: 16, borderBottom: "2.5px solid #b0bec5", letterSpacing: 1, textAlign: "center" }}>
                  Precio Unitario
                </TableCell>
                <TableCell sx={{ color: "#1565c0", fontWeight: 800, fontSize: 16, borderBottom: "2.5px solid #b0bec5", letterSpacing: 1, textAlign: "center" }}>
                  Subtotal
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bill.billProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ color: "#bdbdbd", fontStyle: "italic" }}>
                    No hay productos agregados a la factura.
                  </TableCell>
                </TableRow>
              ) : (
                bill.billProducts.map((bp, idx) => (
                  <TableRow
                    key={bp.id}
                    hover
                    sx={{
                      background: idx % 2 === 0 ? "#f5f7fa" : "#ffffff",
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell sx={{ color: "#607d8b", fontWeight: 600, textAlign: "center" }}>{bp.product.id}</TableCell>
                    <TableCell sx={{ color: "#263238", fontWeight: 500, textAlign: "center" }}>{bp.product.nombre}</TableCell>
                    <TableCell sx={{ color: "#263238", textAlign: "center" }}>{bp.quantity}</TableCell>
                    <TableCell sx={{ color: "#263238", textAlign: "center" }}>
                      ${bp.price.toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ color: "#1565c0", fontWeight: 700, textAlign: "center" }}>
                      ${(bp.price * bp.quantity).toLocaleString()}
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
              ${(getTotal()).toLocaleString()}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="h6" sx={{ color: "#1565c0", fontWeight: 700 }}>
              Total a Pagar: ${(getTotal()).toLocaleString()}
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
    </Box>
  );
};

export default BillView;