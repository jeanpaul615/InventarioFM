import { Box, Typography, Divider } from "@mui/material";

interface InvoiceTotalsProps {
  total: number;
}

const InvoiceTotals: React.FC<InvoiceTotalsProps> = ({ total }) => (
  <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 4 }}>
    <Box>
      <Typography variant="subtitle2" sx={{ color: "#607d8b", fontWeight: 500 }}>
        Subtotal:
      </Typography>
      <Typography variant="body1" sx={{ color: "#222", fontWeight: 600 }}>
        ${total.toLocaleString()}
      </Typography>
      <Divider sx={{ my: 1 }} />
      <Typography variant="h6" sx={{ color: "#1565c0", fontWeight: 700 }}>
        Total a Pagar: ${(total).toLocaleString()}
      </Typography>
    </Box>
  </Box>
);

export default InvoiceTotals;