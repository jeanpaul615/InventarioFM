import { Box, Button } from "@mui/material";

interface BillingButtonsProps {
  onAddProduct: () => void;
  onDownloadPDF: () => void;
}

const BillingButtons: React.FC<BillingButtonsProps> = ({
  onAddProduct,
  onDownloadPDF,
}) => (
  <Box
    sx={{
      mb: 4,
      display: "flex",
      gap: 3,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Button
      variant="contained"
      color="primary"
      onClick={onAddProduct}
      startIcon={
        <span
          style={{
            display: "inline-block",
            width: 22,
            height: 22,
            background: "linear-gradient(135deg, #1976d2 60%, #64b5f6 100%)",
            borderRadius: "50%",
            color: "#fff",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 18,
            lineHeight: "22px",
          }}
        >
          +
        </span>
      }
      sx={{
        px: 3,
        py: 1.2,
        fontWeight: 700,
        fontSize: 16,
        borderRadius: 2,
        boxShadow: "0 2px 8px #1976d233",
        letterSpacing: 1,
        background: "linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)",
        transition: "all 0.2s",
        "&:hover": {
          background: "linear-gradient(90deg, #1565c0 60%, #42a5f5 100%)",
          boxShadow: "0 4px 16px #1976d244",
          transform: "translateY(-2px) scale(1.03)",
        },
      }}
    >
      Agregar Producto
    </Button>
    <Button
      variant="contained"
      color="success"
      onClick={onDownloadPDF}
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
);

export default BillingButtons;