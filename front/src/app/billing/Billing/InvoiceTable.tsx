import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
} from "@mui/material";
import { InventoryItem } from "./InventoryItem";

interface InvoiceTableProps {
  groupedItems: (InventoryItem & { quantity: number })[];
  handleQuantityChange: (productId: number, newQuantity: number) => void;
  handleRemoveProduct: (productId: number) => void;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({
  groupedItems,
  handleQuantityChange,
  handleRemoveProduct,
}) => (
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
          <TableCell sx={{ color: "#1565c0", fontWeight: 800, fontSize: 16, borderBottom: "2.5px solid #b0bec5", letterSpacing: 1, textAlign: "center" }}>Código</TableCell>
          <TableCell sx={{ color: "#1565c0", fontWeight: 800, fontSize: 16, borderBottom: "2.5px solid #b0bec5", letterSpacing: 1, textAlign: "center" }}>Producto</TableCell>
          <TableCell sx={{ color: "#1565c0", fontWeight: 800, fontSize: 16, borderBottom: "2.5px solid #b0bec5", letterSpacing: 1, textAlign: "center" }}>Cantidad</TableCell>
          <TableCell sx={{ color: "#1565c0", fontWeight: 800, fontSize: 16, borderBottom: "2.5px solid #b0bec5", letterSpacing: 1, textAlign: "center" }}>Precio Unitario</TableCell>
          <TableCell sx={{ color: "#1565c0", fontWeight: 800, fontSize: 16, borderBottom: "2.5px solid #b0bec5", letterSpacing: 1, textAlign: "center" }}>Subtotal</TableCell>
          <TableCell sx={{ color: "#1565c0", fontWeight: 800, fontSize: 16, borderBottom: "2.5px solid #b0bec5", letterSpacing: 1, textAlign: "center" }} className="no-print">Eliminar</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {groupedItems.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} align="center" sx={{ color: "#bdbdbd", fontStyle: "italic" }}>
              No hay productos agregados a la factura.
            </TableCell>
          </TableRow>
        ) : (
          groupedItems.map((item, idx) => (
            <TableRow
              key={item.id}
              hover
              sx={{
                background: idx % 2 === 0 ? "#f5f7fa" : "#ffffff",
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              <TableCell sx={{ color: "#607d8b", fontWeight: 600, textAlign: "center" }}>{item.id}</TableCell>
              <TableCell sx={{ color: "#263238", fontWeight: 500, textAlign: "center" }}>{item.name}</TableCell>
              <TableCell sx={{ color: "#263238", textAlign: "center" }}>
                <TextField
                  type="number"
                  size="small"
                  value={item.quantity}
                  inputProps={{ min: 1, style: { width: 60, textAlign: "center" } }}
                  onChange={e => handleQuantityChange(item.id, Number(e.target.value))}
                  className="no-print"
                />
              </TableCell>
              <TableCell sx={{ color: "#263238", textAlign: "center" }}>${item.price.toLocaleString()}</TableCell>
              <TableCell sx={{ color: "#1565c0", fontWeight: 700, textAlign: "center" }}>${(item.price * item.quantity).toLocaleString()}</TableCell>
              <TableCell sx={{ textAlign: "center" }} className="no-print">
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleRemoveProduct(item.id)}
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </TableContainer>
);

export default InvoiceTable;