import React, { useState } from "react";
import { Box, TextField, Button} from "@mui/material";

interface CustomerFormProps {
  onSubmit: (customerName: string) => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ onSubmit }) => {
  const [customerName, setCustomerName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerName.trim() === "") return;
    onSubmit(customerName);
    setCustomerName("");
  };

  return (
<Box
  component="form"
  onSubmit={handleSubmit}
  sx={{
    mb: 2,
    display: "flex",
    flexDirection: "column",
    gap: 2,
    maxWidth: 400,
    backgroundColor: "#fff",
    p: 3,
    borderRadius: 2,
    boxShadow: "0px 2px 8px rgba(0,0,0,0.06)",
  }}
>
  <TextField
    label="Nombre del Cliente"
    value={customerName}
    onChange={(e) => setCustomerName(e.target.value)}
    required
    fullWidth
    variant="outlined"
    sx={{ mb: 1 }}
  />
  <Button
    type="submit"
    variant="contained"
    color="secondary"
    sx={{ fontWeight: "bold", py: 1.2 }}
  >
    Generar Factura Nueva
  </Button>
</Box>
  );
};

export default CustomerForm;