import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import AddInventoryModal from "./AddInventoryModal";
import { useApi } from "../context/ApiContext";

interface Product {
  id: number;
  nombre: string;
}

const AddInventoryButton: React.FC<{ onAdded: () => void }> = ({ onAdded }) => {
  const { token } = useApi();
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/products`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('No se pudo obtener productos');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
        else if (data.items) setProducts(data.items);
      })
      .catch(() => setProducts([]));
  }, [token]);

  return (
    <>
      <Button
        variant="contained"
        color="warning"
        sx={{ mb: 2, fontWeight: 700, borderRadius: 2 }}
        onClick={() => setOpen(true)}
      >
        Agregar ingreso a inventario
      </Button>
      <AddInventoryModal
        open={open}
        onClose={() => setOpen(false)}
        products={products}
        token={token || ''}
        onAdded={onAdded}
      />
    </>
  );
};

export default AddInventoryButton;
