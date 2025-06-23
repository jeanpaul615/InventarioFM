import { Box, Typography } from "@mui/material";

const QuotationFooter = () => (
  <Box sx={{
    background: "linear-gradient(90deg, #ff6600 0%, #ffb366 100%)",
    color: "#fff",
    borderRadius: 2,
    p: 2,
    mt: 2,
    textAlign: "center",
    boxShadow: "0 2px 8px #ffd8b3",
  }}>
    <Typography variant="subtitle1" fontWeight={600}>
      ¡Gracias por confiar en Ferremolina!
    </Typography>
    <Typography variant="body2" sx={{ mt: 0.5 }}>
      Cotización sujeta a cambios sin previo aviso.
    </Typography>
    <Typography variant="body2" sx={{ mt: 0.5 }}>
      Disponibilidad sujeta a existencias en el momento de la compra.
    </Typography>
  </Box>
);

export default QuotationFooter;
