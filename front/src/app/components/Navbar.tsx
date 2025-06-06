"use client";

import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import LoginIcon from '@mui/icons-material/Login';
import DashboardIcon from '@mui/icons-material/Dashboard';

import { useRouter } from 'next/navigation'
import { styled } from '@mui/system';

const NAVIGATION = [
  { title: 'Inventario', icon: <HomeIcon />, path: '/' },
  { title: 'Facturacion', icon: <InfoIcon />, path: '/billing' },
  { title: 'Clientes', icon: <ContactMailIcon />, path: '/customer' },
  { title: 'Registro de Facturas', icon: <LoginIcon />, path: '/billinglist' },
  { title: 'Registro de Cotizaciones', icon: <DashboardIcon />, path: '/quoteslist' },
];

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    background: '#1c1c1c', // Fondo gris oscuro
    color: '#e0e0e0', // Texto gris claro
    width: 260,
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease-in-out',
  },
}));

const Navbar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    handleDrawerClose();
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <AppBar position="fixed" sx={{ background: 'linear-gradient(to right, #ff9800, #ff5722)' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerOpen} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <h1 className="pt-7 text-3xl font-bold text-amber-400 mb-6 text-center">INVENTARIO FERREMOLINA</h1>
        </Toolbar>
      </AppBar>
      <StyledDrawer anchor="left" open={drawerOpen} onClose={handleDrawerClose}>
        <Toolbar />
        <Divider sx={{ backgroundColor: 'rgba(224, 224, 224, 0.2)' }} /> {/* Divider gris claro */}
        <List>
          {NAVIGATION.map((item) => (
            <ListItem
              key={item.title}
              onClick={() => handleNavigation(item.path)}
              sx={{
              '&:hover': {
                backgroundColor: 'rgba(255,255,255, 0.8)', // Naranja más brillante al hacer hover
                transform: 'scale(1.05)', // Efecto de zoom
                color: '#000000', // Texto blanco al hacer hover
              
              },
              '&:active': {
                transform: 'scale(0.98)', // Efecto de clic
                backgroundColor: 'rgba(255, 87, 34, 0.9)', // Naranja más oscuro al hacer clic
              },
              color: '#ffffff', // Texto blanco
              }}
            >
                <ListItemIcon
                sx={{
                  color: '#ff8300',
                  '&:hover': {
                  color: '#ffffff', // Cambia el color del icono a blanco al hacer hover
                  },
                }}
                >
                {item.icon}
                </ListItemIcon>
              <ListItemText
              primary={item.title}
              primaryTypographyProps={{
                fontWeight: 'bold',
                fontSize: '1rem',
              }}
              />
            </ListItem>
          ))}
        </List>
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            textAlign: 'center',
            py: 2,
            background: 'rgba(44, 62, 80, 0.1)', // Fondo azul oscuro translúcido
          }}
        >
          <Typography variant="body2" sx={{ color: '#e0e0e0', fontSize: '0.9rem' }}>
            © 2025 Ferremolina. Todos los derechos reservados.
          </Typography>
        </Box>
      </StyledDrawer>
    </>
  );
};

export default Navbar;