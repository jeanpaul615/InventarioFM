"use client";
import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface ItemsPerPageSelectorProps {
  itemsPerPage: number;
  onItemsPerPageChange: (items: number) => void;
}

const ItemsPerPageSelector: React.FC<ItemsPerPageSelectorProps> = ({ itemsPerPage, onItemsPerPageChange }) => {
  const handleChange = (event: SelectChangeEvent<number>) => {
    onItemsPerPageChange(Number(event.target.value));
  };

  return (
    <FormControl
      variant="outlined"
      size="small"
      sx={{
        backgroundColor: '#FFECB3', // Amber background
        borderRadius: '4px', // Rounded corners
      }}
    >
      <InputLabel>Items por página</InputLabel>
      <Select
        value={itemsPerPage}
        onChange={handleChange}
        label="Items por página"
      >
        {[5, 10, 20, 50, 100, 1000].map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ItemsPerPageSelector;
