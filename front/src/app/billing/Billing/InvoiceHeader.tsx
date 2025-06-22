import { Box, Typography, Grid, Divider, useMediaQuery, useTheme } from "@mui/material";

interface InvoiceHeaderProps {
  currentBillId: number | null;
  customer: {
    nombre?: string;
    cedula?: string;
    direccion?: string;
    telefono?: string;
  };
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ currentBillId, customer }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ mb: 4 }}>
      {/* Empresa */}
      <Box
        sx={{
          mb: 3,
          p: isSmallScreen ? 2 : 3,
          borderRadius: 3,
          background: "linear-gradient(90deg, #e3eafc 50%, #f5f7fa 100%)",
          border: "1px solid #1976d2",
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          alignItems: isSmallScreen ? "flex-start" : "center",
          gap: isSmallScreen ? 2 : 3,
          boxShadow: "0 4px 10px #1976d220",
        }}
      >
        <img
          src="logo.webp"
          alt="Logo de Ferremolina"
          style={{
            width: isSmallScreen ? 48 : 72,
            height: isSmallScreen ? 48 : 72,
            borderRadius: 12,
            background: "#fff",
            border: "2px solid #1976d2",
          }}
        />
        <Box>
          <Typography
            variant={isSmallScreen ? "h6" : "h5"}
            sx={{ fontWeight: 900, color: "#1976d2", letterSpacing: 1 }}
          >
            DISTRIBUCIONES FERREMOLINA
          </Typography>
          <Typography sx={{ color: "#455a64", fontSize: isSmallScreen ? 12 : 14 }}>
            Calle 8 Bis N. 37-22, Pereira, Risaralda
          </Typography>
          <Typography sx={{ color: "#455a64", fontSize: isSmallScreen ? 12 : 14 }}>
            Tel: +57 312 346 7272
          </Typography>
          <Typography sx={{ color: "#455a64", fontSize: isSmallScreen ? 12 : 14 }}>
            Email: <span style={{ color: "#1976d2" }}>ventas.ferremolina@gmail.com</span>
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }} />
        <Box
          sx={{
            textAlign: "right",
            minWidth: isSmallScreen ? "auto" : 200,
            background: "#ffffff",
            borderRadius: 3,
            border: "1.5px solid #e0e7ef",
            p: isSmallScreen ? 1 : 2,
            boxShadow: "0 4px 10px #e0e7ef88",
          }}
        >
          <Typography sx={{ color: "#1976d2", fontWeight: 700, fontSize: isSmallScreen ? 14 : 16 }}>
            Factura de Venta
          </Typography>
          <Typography sx={{ color: "#37474f", fontSize: isSmallScreen ? 12 : 14 }}>
            <b>No:</b> {currentBillId || "En curso"}
          </Typography>
          <Typography sx={{ color: "#37474f", fontSize: isSmallScreen ? 12 : 14 }}>
            <b>Fecha:</b> {new Date().toLocaleDateString()}
          </Typography>
        </Box>
      </Box>

      {/* Cliente */}
      <Box
        sx={{
          border: "1px solid #1976d2",
          borderRadius: 3,
          p: isSmallScreen ? 2 : 3,
          background: "#f8fafc",
          boxShadow: "0 4px 10px #1976d220",
        }}
      >
        <Typography
          sx={{ color: "#1976d2", fontWeight: 700, mb: isSmallScreen ? 1 : 2, fontSize: isSmallScreen ? 14 : 16 }}
        >
          Datos del Cliente
        </Typography>
        <Grid container spacing={isSmallScreen ? 1 : 3}>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ color: "#37474f", fontSize: isSmallScreen ? 12 : 14 }}>
              <b>Nombre:</b> {customer.nombre || <span style={{ color: "#b0bec5" }}>Sin nombre</span>}
            </Typography>
            <Typography sx={{ color: "#37474f", fontSize: isSmallScreen ? 12 : 14 }}>
              <b>Cédula/NIT:</b> {customer.cedula || <span style={{ color: "#b0bec5" }}>Sin cédula</span>}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ color: "#37474f", fontSize: isSmallScreen ? 12 : 14 }}>
              <b>Dirección:</b> {customer.direccion || <span style={{ color: "#b0bec5" }}>Sin dirección</span>}
            </Typography>
            <Typography sx={{ color: "#37474f", fontSize: isSmallScreen ? 12 : 14 }}>
              <b>Teléfono:</b> {customer.telefono || <span style={{ color: "#b0bec5" }}>Sin teléfono</span>}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: isSmallScreen ? 2 : 3, borderColor: "#1976d2" }} />
    </Box>
  );
};

export default InvoiceHeader;
