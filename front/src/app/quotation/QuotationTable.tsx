import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Item {
  id: number;
  name: string; // para cotización, será el campo 'nombre'
  price: number;
  quantity: number;
}

interface QuotationTableProps {
  groupedItems: Item[];
  handleQuantityChange?: (productId: number, newQuantity: number) => void;
  handleRemoveProduct?: (productId: number) => void;
  editable?: boolean;
}

const QuotationTable: React.FC<QuotationTableProps> = ({ groupedItems, handleQuantityChange, handleRemoveProduct, editable = true }) => {
  const router = useRouter();
  useEffect(() => {
    // Verifica si el usuario está autenticado (token en localStorage)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
      }
    }
  }, [router]);

  return (
    <TableContainer component={Paper} sx={{ mb: 3, borderRadius: 2, border: "1.5px solid #e3eafc", background: "#f8fafc", boxShadow: "0 2px 8px #e3eafc" }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ background: "#fff3e0" }}>
            <TableCell sx={{ color: "#ff6600", fontWeight: 800, fontSize: 16, borderBottom: "2.5px solid #ffb74d", letterSpacing: 1, textAlign: "center" }}>Código</TableCell>
            <TableCell sx={{ color: "#ff6600", fontWeight: 800, fontSize: 16, borderBottom: "2.5px solid #ffb74d", letterSpacing: 1, textAlign: "center" }}>Producto</TableCell>
            <TableCell sx={{ color: "#ff6600", fontWeight: 800, fontSize: 16, borderBottom: "2.5px solid #ffb74d", letterSpacing: 1, textAlign: "center" }}>Cantidad</TableCell>
            <TableCell sx={{ color: "#ff6600", fontWeight: 800, fontSize: 16, borderBottom: "2.5px solid #ffb74d", letterSpacing: 1, textAlign: "center" }}>Precio Unitario</TableCell>
            <TableCell sx={{ color: "#ff6600", fontWeight: 800, fontSize: 16, borderBottom: "2.5px solid #ffb74d", letterSpacing: 1, textAlign: "center" }}>Subtotal</TableCell>
            {editable && <TableCell className="no-print" />}
          </TableRow>
        </TableHead>
        <TableBody>
          {groupedItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={editable ? 6 : 5} align="center" sx={{ color: "#bdbdbd", fontStyle: "italic" }}>
                No hay productos agregados a la cotización.
              </TableCell>
            </TableRow>
          ) : (
            groupedItems.map((item, idx) => {
              const cells = [
                <TableCell key="id" sx={{ color: "#607d8b", fontWeight: 600, textAlign: "center" }}>{item.id}</TableCell>,
                <TableCell key="name" sx={{ color: "#263238", fontWeight: 500, textAlign: "center" }}>{item.name}</TableCell>,
                <TableCell key="quantity" sx={{ color: "#263238", textAlign: "center" }}>{item.quantity}</TableCell>,
                <TableCell key="price" sx={{ color: "#263238", textAlign: "center" }}>
                  {typeof item.price === "number" ? `$${item.price.toLocaleString()}` : "$0"}
                </TableCell>,
                <TableCell key="subtotal" sx={{ color: "#1565c0", fontWeight: 700, textAlign: "center" }}>
                  {typeof item.price === "number" && typeof item.quantity === "number" ? `$${(item.price * item.quantity).toLocaleString()}` : "$0"}
                </TableCell>
              ];
              if (editable && handleRemoveProduct) {
                cells.push(
                  <TableCell key="remove" sx={{ textAlign: "center" }} className="no-print">
                    <button
                      style={{ background: "none", border: "none", color: "#d32f2f", fontWeight: 700, cursor: "pointer" }}
                      onClick={() => handleRemoveProduct(item.id)}
                    >
                      Quitar
                    </button>
                  </TableCell>
                );
              }
              return (
                <TableRow
                  key={item.id}
                  hover
                  sx={{
                    background: idx % 2 === 0 ? "#f5f7fa" : "#ffffff",
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  {cells}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default QuotationTable;
