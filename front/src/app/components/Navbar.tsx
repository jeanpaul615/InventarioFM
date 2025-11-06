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
import ReplayIcon from '@mui/icons-material/Replay'; // Nuevo ícono para devoluciones

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
const NAVIGATION_RETURNS = [
  { title: 'Devoluciones', icon: <ReplayIcon sx={{ color: '#1976d2' }} />, path: '/returns' },
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
  }, []);

  useEffect(() => {
    // Redirigir al login si no hay usuario autenticado (solo después del montaje)
    if (mounted && !user && typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      // No redirigir si ya estamos en login o forgot-password
      if (currentPath !== '/login' && currentPath !== '/forgot-password') {
        router.push('/login');
      }
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
      <AppBar 
        position="fixed" 
        sx={{ 
          background: 'linear-gradient(90deg, #232526 0%, #414345 100%)', 
          boxShadow: '0 4px 24px #0008',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          '@media print': {
            display: 'none', // Ocultar en impresión
          }
        }}
      >
        <Toolbar sx={{ 
          minHeight: { xs: 56, sm: 64 },
          px: { xs: 1, sm: 2 }
        }}>
          {/* Menú hamburguesa - Solo visible en pantallas */}
          <IconButton 
            edge="start" 
            color="inherit" 
            aria-label="menu" 
            onClick={handleDrawerOpen} 
            sx={{ 
              mr: { xs: 1, sm: 2 },
              display: { xs: 'block', md: 'block' }
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo y Título - Responsive */}
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: { xs: 'flex-start', sm: 'center' },
            overflow: 'hidden',
            mr: { xs: 1, sm: 2 }
          }}>
            <img 
              src="/logo.webp" 
              alt="Logo" 
              style={{ 
                height: window.innerWidth < 600 ? 32 : 48, 
                marginRight: window.innerWidth < 600 ? 8 : 16, 
                borderRadius: 8, 
                boxShadow: '0 2px 8px #ff9800',
                flexShrink: 0
              }} 
            />
            <Typography 
              variant="h5" 
              fontWeight={900} 
              sx={{ 
                color: '#ff9800', 
                letterSpacing: { xs: 0.5, sm: 1, md: 2 }, 
                textShadow: '0 2px 8px #0006',
                fontSize: { xs: '0.875rem', sm: '1.25rem', md: '1.5rem' },
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              INVENTARIO FERREMOLINA
            </Typography>
            {/* Título corto para móvil */}
            <Typography 
              variant="h6" 
              fontWeight={900} 
              sx={{ 
                color: '#ff9800', 
                fontSize: '0.875rem',
                display: { xs: 'block', sm: 'none' }
              }}
            >
              FERREMOLINA
            </Typography>
          </Box>

          {/* Botones de usuario - Responsive */}
          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
              {/* Nombre de usuario - Ocultar en móvil */}
              <Typography sx={{ 
                color: '#fff', 
                fontWeight: 700, 
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                fontSize: { md: '0.875rem', lg: '1rem' }
              }}>
                <PersonIcon sx={{ verticalAlign: 'middle', mr: 0.5, fontSize: 20 }} /> 
                {user.username}
              </Typography>
              
              {/* Botón de cerrar sesión */}
              <Button
                color="inherit"
                startIcon={<LogoutIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />}
                onClick={() => { logout(); window.location.href = '/login'; }}
                sx={{ 
                  fontWeight: 700, 
                  borderRadius: 2, 
                  background: '#ff6600', 
                  color: '#fff', 
                  '&:hover': { background: '#b26a00' },
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  px: { xs: 1, sm: 2 },
                  py: { xs: 0.5, sm: 1 },
                  minWidth: { xs: 'auto', sm: 'auto' }
                }}
              >
                <span className="hidden sm:inline">Cerrar sesión</span>
                <span className="sm:hidden">Salir</span>
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                color="inherit"
                startIcon={<PersonIcon />}
                onClick={() => router.push('/login')}
                sx={{ 
                  fontWeight: 700, 
                  borderRadius: 2, 
                  background: '#ff6600', 
                  color: '#fff', 
                  '&:hover': { background: '#b26a00' },
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  px: { xs: 1, sm: 2 },
                  display: { xs: 'none', sm: 'flex' }
                }}
              >
                Iniciar sesión
              </Button>
              <Button
                color="inherit"
                startIcon={<LockResetIcon />}
                onClick={() => router.push('/forgot-password')}
                sx={{ 
                  fontWeight: 700, 
                  borderRadius: 2, 
                  background: '#fff3e0', 
                  color: '#ff6600', 
                  '&:hover': { background: '#ffe0b2' },
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  px: { xs: 1, sm: 2 },
                  display: { xs: 'none', sm: 'flex' }
                }}
              >
                Recuperar contraseña
              </Button>
            </Box>
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
        {/* NUEVO GRUPO DEVOLUCIONES */}
        <Divider />
        <List subheader={<Typography sx={{ pl: 2, pt: 1, color: '#1976d2', fontWeight: 700 }}>Devoluciones</Typography>}>
          {NAVIGATION_RETURNS.map((item) => (
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