import { Box, Typography, Divider } from "@mui/material";

const InvoiceFooter: React.FC = () => (
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
);

export default InvoiceFooter;