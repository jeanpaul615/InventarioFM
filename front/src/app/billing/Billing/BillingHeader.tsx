import { Box, Typography } from "@mui/material";

interface BillingHeaderProps {
  currentBillId: number | null;
}

const BillingHeader: React.FC<BillingHeaderProps> = ({ currentBillId }) => (
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
      <img src="logo.webp" alt="Logo de Ferremolina" style={{ width: "100px", height: "auto" }} />
    </Box>
  </Box>
);

export default BillingHeader;