import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  content: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title = "Confirmar acción",
  content,
  onConfirm,
  onCancel,
  confirmText = "Crear Nueva Factura",
  cancelText = "Continuar Editando",
}) => (
  <Dialog open={open} onClose={onCancel}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <Typography>{content}</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel} color="error" variant="outlined">
        {cancelText}
      </Button>
      <Button onClick={onConfirm} color="primary" variant="contained" autoFocus>
        {confirmText}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;