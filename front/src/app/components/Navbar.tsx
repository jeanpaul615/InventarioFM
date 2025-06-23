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
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import LoginIcon from '@mui/icons-material/Login';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import LockResetIcon from '@mui/icons-material/LockReset';

import { useRouter } from 'next/navigation'
import { styled } from '@mui/system';
import { useApi } from '../context/ApiContext';

const NAVIGATION_BILLING = [
  { title: 'Facturación', icon: <InfoIcon />, path: '/billing' },
  { title: 'Registro de Facturas', icon: <LoginIcon />, path: '/billinglist' },
];
const NAVIGATION_QUOTATION = [
  { title: 'Cotización', icon: <AssignmentIcon sx={{ color: '#1976d2' }} />, path: '/quotation' },
  { title: 'Registro de Cotizaciones', icon: <DashboardIcon sx={{ color: '#1976d2' }} />, path: '/quoteslist' },
];
const NAVIGATION_INVENTORY = [
  { title: 'Inventario', icon: <HomeIcon sx={{ color: '#43a047' }} />, path: '/' },
  { title: 'Ingresos Inventario', icon: <AssignmentIcon sx={{ color: '#43a047' }} />, path: '/inventorylog/list' },
];
const NAVIGATION_CLIENTS = [
  { title: 'Clientes', icon: <ContactMailIcon sx={{ color: '#ff9800' }} />, path: '/customer' },
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
  const { user, logout } = useApi();

  useEffect(() => {
    setMounted(true);
    // Redirigir al login si no hay usuario autenticado
    if (mounted && !user) {
      router.push('/login');
    }
  }, [mounted, user, router]);

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
      <AppBar position="fixed" sx={{ background: 'linear-gradient(90deg, #232526 0%, #414345 100%)', boxShadow: '0 4px 24px #0008' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerOpen} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/logo.webp" alt="Logo" style={{ height: 48, marginRight: 16, borderRadius: 8, boxShadow: '0 2px 8px #ff9800' }} />
            <Typography variant="h5" fontWeight={900} sx={{ color: '#ff9800', letterSpacing: 2, textShadow: '0 2px 8px #0006' }}>
              INVENTARIO FERREMOLINA
            </Typography>
          </Box>
          {user ? (
            <>
              <Typography sx={{ color: '#fff', fontWeight: 700, mr: 2 }}>
                <PersonIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} /> {user.username}
              </Typography>
              <Button
                color="inherit"
                startIcon={<LogoutIcon />}
                onClick={() => { logout(); window.location.href = '/login'; }}
                sx={{ fontWeight: 700, borderRadius: 2, background: '#ff6600', color: '#fff', ml: 1, '&:hover': { background: '#b26a00' } }}
              >
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                startIcon={<PersonIcon />}
                onClick={() => router.push('/login')}
                sx={{ fontWeight: 700, borderRadius: 2, background: '#ff6600', color: '#fff', ml: 1, '&:hover': { background: '#b26a00' } }}
              >
                Iniciar sesión
              </Button>
              <Button
                color="inherit"
                startIcon={<LockResetIcon />}
                onClick={() => router.push('/forgot-password')}
                sx={{ fontWeight: 700, borderRadius: 2, background: '#fff3e0', color: '#ff6600', ml: 1, '&:hover': { background: '#ffe0b2' } }}
              >
                Recuperar contraseña
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <StyledDrawer anchor="left" open={drawerOpen} onClose={handleDrawerClose}>
        <Toolbar />
        <Divider sx={{ backgroundColor: 'rgba(224, 224, 224, 0.2)' }} />
        <List subheader={<Typography sx={{ pl: 2, pt: 1, color: '#ff9800', fontWeight: 700 }}>Inventario</Typography>}>
          {NAVIGATION_INVENTORY.map((item) => (
            <ListItem component="button" key={item.title} onClick={() => handleNavigation(item.path)} sx={{ ...navItemSx }}>
              <ListItemIcon sx={{ ...iconSx }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} primaryTypographyProps={{ fontWeight: 'bold', fontSize: '1rem' }} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List subheader={<Typography sx={{ pl: 2, pt: 1, color: '#1976d2', fontWeight: 700 }}>Cotización</Typography>}>
          {NAVIGATION_QUOTATION.map((item) => (
            <ListItem component="button" key={item.title} onClick={() => handleNavigation(item.path)} sx={{ ...navItemSx }}>
              <ListItemIcon sx={{ ...iconSx }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} primaryTypographyProps={{ fontWeight: 'bold', fontSize: '1rem' }} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List subheader={<Typography sx={{ pl: 2, pt: 1, color: '#ff5722', fontWeight: 700 }}>Facturación</Typography>}>
          {NAVIGATION_BILLING.map((item) => (
            <ListItem component="button" key={item.title} onClick={() => handleNavigation(item.path)} sx={{ ...navItemSx }}>
              <ListItemIcon sx={{ ...iconSx }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} primaryTypographyProps={{ fontWeight: 'bold', fontSize: '1rem' }} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List subheader={<Typography sx={{ pl: 2, pt: 1, color: '#ff9800', fontWeight: 700 }}>Clientes</Typography>}>
          {NAVIGATION_CLIENTS.map((item) => (
            <ListItem component="button" key={item.title} onClick={() => handleNavigation(item.path)} sx={{ ...navItemSx }}>
              <ListItemIcon sx={{ ...iconSx }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} primaryTypographyProps={{ fontWeight: 'bold', fontSize: '1rem' }} />
            </ListItem>
          ))}
        </List>
        <Box sx={{ position: 'absolute', bottom: 0, width: '100%', textAlign: 'center', py: 2, background: 'rgba(44, 62, 80, 0.1)' }}>
          <Typography variant="body2" sx={{ color: '#e0e0e0', fontSize: '0.9rem' }}>
            © 2025 Ferremolina. Todos los derechos reservados.
          </Typography>
        </Box>
      </StyledDrawer>
    </>
  );
};

export default Navbar;

// Estilos para los ítems
const navItemSx = {
  '&:hover': {
    backgroundColor: 'rgba(255,255,255, 0.08)',
    transform: 'scale(1.04)',
    color: '#ff9800',
  },
  '&:active': {
    transform: 'scale(0.98)',
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
  },
  color: '#fff',
  borderRadius: 2,
  mx: 1,
  my: 0.5,
  transition: 'all 0.2s',
};
const iconSx = {
  minWidth: 36,
  color: '#ff9800',
  fontSize: 24,
};