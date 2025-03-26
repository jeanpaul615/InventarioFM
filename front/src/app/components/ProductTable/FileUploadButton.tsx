import React from 'react';
import { Button } from '@mui/material';
import { Upload } from '@mui/icons-material';

interface FileUploadButtonProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({ onFileUpload }) => {
  return (
    <Button variant="outlined" component="label" startIcon={<Upload />}>
      Cargar Excel
      <input type="file" hidden accept=".xlsx, .xls" onChange={onFileUpload} />
    </Button>
  );
};

export default FileUploadButton;