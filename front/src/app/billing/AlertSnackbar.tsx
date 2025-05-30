import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertColor } from "@mui/material/Alert";

interface AlertSnackbarProps {
  open: boolean;
  message: string;
  severity?: AlertColor;
  onClose: () => void;
}

const AlertSnackbar: React.FC<AlertSnackbarProps> = ({
  open,
  message,
  severity = "info",
  onClose,
}) => (
  <Snackbar open={open} autoHideDuration={4000} onClose={onClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
    <MuiAlert elevation={6} variant="filled" onClose={onClose} severity={severity} sx={{ width: "100%" }}>
      {message}
    </MuiAlert>
  </Snackbar>
);

export default AlertSnackbar;