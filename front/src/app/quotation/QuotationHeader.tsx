import { Box, Typography, Grid, Divider, useMediaQuery, useTheme } from "@mui/material";

interface QuotationHeaderProps {
  quotationId?: number;
  customer: {
    nombre?: string;
    cedula?: string;
    direccion?: string;
    telefono?: string;
  };
}

const QuotationHeader: React.FC<QuotationHeaderProps> = ({ quotationId, customer }) => {
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
          background: "linear-gradient(90deg, #ffe0b2 50%, #fff3e0 100%)",
          border: "1px solid #ff6600",
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          alignItems: isSmallScreen ? "flex-start" : "center",
          gap: isSmallScreen ? 2 : 3,
          boxShadow: "0 4px 10px #ff660020",
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
            border: "2px solid #ff6600",
          }}
        />
        <Box>
          <Typography
            variant={isSmallScreen ? "h6" : "h5"}
            sx={{ fontWeight: 900, color: "#ff6600", letterSpacing: 1 }}
          >
            DISTRIBUCIONES FERREMOLINA
          </Typography>
          <Typography sx={{ color: "#b26a00", fontSize: isSmallScreen ? 12 : 14 }}>
            Calle 8 Bis N. 37-22, Pereira, Risaralda
          </Typography>
          <Typography sx={{ color: "#b26a00", fontSize: isSmallScreen ? 12 : 14 }}>
            Tel: +57 312 346 7272
          </Typography>
          <Typography sx={{ color: "#b26a00", fontSize: isSmallScreen ? 12 : 14 }}>
            Email: <span style={{ color: "#ff6600" }}>ventas.ferremolina@gmail.com</span>
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }} />
        <Box
          sx={{
            textAlign: "right",
            minWidth: isSmallScreen ? "auto" : 200,
            background: "#fff7ed",
            borderRadius: 3,
            border: "1.5px solid #ffe0b2",
            p: isSmallScreen ? 1 : 2,
            boxShadow: "0 4px 10px #ffe0b288",
          }}
        >
          <Typography sx={{ color: "#ff6600", fontWeight: 700, fontSize: isSmallScreen ? 14 : 16 }}>
            Cotización
          </Typography>
          <Typography sx={{ color: "#b26a00", fontSize: isSmallScreen ? 12 : 14 }}>
            <b>No:</b> {quotationId !== null && quotationId !== undefined ? quotationId : "-"}
          </Typography>
          <Typography sx={{ color: "#b26a00", fontSize: isSmallScreen ? 12 : 14 }}>
            <b>Fecha:</b> {new Date().toLocaleDateString()}
          </Typography>
        </Box>
      </Box>

      {/* Cliente */}
      <Box
        sx={{
          border: "1px solid #ff6600",
          borderRadius: 3,
          p: isSmallScreen ? 2 : 3,
          background: "#fff8f3",
          boxShadow: "0 4px 10px #ff660020",
        }}
      >
        <Typography
          sx={{ color: "#ff6600", fontWeight: 700, mb: isSmallScreen ? 1 : 2, fontSize: isSmallScreen ? 14 : 16 }}
        >
          Datos del Cliente
        </Typography>
        <Grid container spacing={isSmallScreen ? 1 : 3}>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ color: "#b26a00", fontSize: isSmallScreen ? 12 : 14 }}>
              <b>Nombre:</b> {customer.nombre || <span style={{ color: "#ffd8b3" }}>Sin nombre</span>}
            </Typography>
            <Typography sx={{ color: "#b26a00", fontSize: isSmallScreen ? 12 : 14 }}>
              <b>Cédula/NIT:</b> {customer.cedula || <span style={{ color: "#ffd8b3" }}>Sin cédula</span>}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ color: "#b26a00", fontSize: isSmallScreen ? 12 : 14 }}>
              <b>Dirección:</b> {customer.direccion || <span style={{ color: "#ffd8b3" }}>Sin dirección</span>}
            </Typography>
            <Typography sx={{ color: "#b26a00", fontSize: isSmallScreen ? 12 : 14 }}>
              <b>Teléfono:</b> {customer.telefono || <span style={{ color: "#ffd8b3" }}>Sin teléfono</span>}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: isSmallScreen ? 2 : 3, borderColor: "#ff6600" }} />
    </Box>
  );
};

export default QuotationHeader;
