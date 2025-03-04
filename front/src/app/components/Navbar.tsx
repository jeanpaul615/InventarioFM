"use client";

import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, ListItemIcon, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import LoginIcon from '@mui/icons-material/Login';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import { useRouter } from 'next/navigation';
import { styled } from '@mui/system';

const NAVIGATION = [
  { title: 'Home', icon: <HomeIcon />, path: '/' },
  { title: 'About', icon: <InfoIcon />, path: '/about' },
  { title: 'Contact', icon: <ContactMailIcon />, path: '/contact' },
  { title: 'Login', icon: <LoginIcon />, path: '/login' },
  { title: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { title: 'Orders', icon: <ShoppingCartIcon />, path: '/orders' },
  { title: 'Sales Reports', icon: <BarChartIcon />, path: '/reports/sales' },
  { title: 'Traffic Reports', icon: <DescriptionIcon />, path: '/reports/traffic' },
  { title: 'Integrations', icon: <LayersIcon />, path: '/integrations' },
];

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    background: 'linear-gradient(to right, #ff9800, #ff5722)',
    color: 'white',
    width: 240,
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
      <StyledDrawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerClose}
      >
        <Toolbar />
        <Divider />
        <List>
          {NAVIGATION.map((item) => (
            <ListItem button={1} key={item.title} onClick={() => handleNavigation(item.path)}>
              <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItem>
          ))}
        </List>
      </StyledDrawer>
    </>
  );
};

export default Navbar;