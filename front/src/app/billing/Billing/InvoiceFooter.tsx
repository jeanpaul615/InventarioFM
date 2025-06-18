import { Box, Typography, Divider, useMediaQuery, useTheme } from "@mui/material";

const InvoiceFooter: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        textAlign: "center",
        color: "#607d8b",
        fontSize: isSmallScreen ? 12 : 14,
        mt: isSmallScreen ? 2 : 3,
        mb: isSmallScreen ? 0.5 : 1,
        p: isSmallScreen ? 1 : 2,
        borderRadius: 2,
        background: "#f5f7fa",
      }}
    >
      <Typography
        variant={isSmallScreen ? "body1" : "subtitle1"}
        sx={{ fontWeight: 600, color: "#1565c0", mb: isSmallScreen ? 0.5 : 1 }}
      >
        ¡Gracias por su compra!
      </Typography>
      <Typography
        variant="body2"
        sx={{ mb: isSmallScreen ? 0.5 : 1, fontSize: isSmallScreen ? 12 : 14 }}
      >
        Esta factura es un documento electrónico generado por Ferremolina.<br />
        Por favor conserve este comprobante para cualquier reclamo o garantía.
      </Typography>
      <Divider sx={{ my: isSmallScreen ? 0.5 : 1, mx: "auto", width: isSmallScreen ? "80%" : "60%" }} />
      <Typography
        variant="body2"
        sx={{ color: "#263238", fontSize: isSmallScreen ? 12 : 14 }}
      >
        Calle 8 Bis N. 37-22 Pereira &nbsp;|&nbsp; Tel: +57 312 346 7272 &nbsp;|&nbsp; Email: cabran112@gmail.com
      </Typography>
    </Box>
  );
};

export default InvoiceFooter;