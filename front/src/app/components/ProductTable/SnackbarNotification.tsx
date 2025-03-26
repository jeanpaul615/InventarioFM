import React from 'react';
import { Snackbar, Alert } from '@mui/material';

interface SnackbarNotificationProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

const SnackbarNotification: React.FC<SnackbarNotificationProps> = ({ open, message, onClose }) => {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
      <Alert onClose={onClose} severity="success">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarNotification;