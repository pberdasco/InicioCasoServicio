import * as React from 'react';

import { useGeneralContext } from '../Context/GeneralContextHook';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

const pages = [{title:'Inicio Caso', route: "/inicio"}, {title:'Ej.Garantías', route: "/"}, {title:'TextInput', route: "/text"}, 
               {title:'AutoComplete', route: "/autocomplete"}];
const settings = [{title: 'Login', route: "/login"}, {title: 'Cuentas', route: '/account'}];

export function ResponsiveAppBar() {
  const {loggedUser} = useGeneralContext()
  console.log("<ResponsiveAppBar> LoggedUser:", loggedUser);

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (route) => {
    setAnchorElNav(null);
    if (route) window.location.href = route;
  };

  const handleCloseUserMenu = (route) => {
    setAnchorElUser(null);
    if (route) window.location.href = route
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>  
          {/* Pantalla Grande - Logo Empresa */}
          <Button component="a" href="/" sx={{marginRight: '1rem', alignItems: 'center', width: '160px', display: { xs: 'none', md: 'flex' } }}>
            <img src="./tool-box.png" alt="ReactForm UI Kit" style={{ width: '40%' }}/>
          </Button>

          {/* Pantalla Celular - Hamburguesa y menú descolgable */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            {/* Hamburguesa */}
            <IconButton onClick={handleOpenNavMenu} size="large" aria-label="acciones posibles" aria-controls="menu-appbar" aria-haspopup="true" color="inherit">
              <MenuIcon />
            </IconButton>
            {/* Opciones de menu hamburguesa */}
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
              keepMounted
              transformOrigin={{vertical: 'top', horizontal: 'left'}}
              open={Boolean(anchorElNav)}
              onClose={() => handleCloseNavMenu(null)}
              sx={{display: { xs: 'block', md: 'none' }}}
            >
              {pages.map((page) => (
                <MenuItem key={page.title} onClick={() => handleCloseNavMenu(page.route)}>
                  <Typography textAlign="center">{page.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          {/* Pantalla Celular - Logo Empresa*/}
          <Button component="a" href="/" sx={{marginRight: '1rem', alignItems: 'center', width: '160px', display: { xs: 'flex', md: 'none' } }}>
            <img src="./tool-box.png" alt="ReactForm UI Kit" style={{ width: '40%' }}/>
          </Button>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button key={page.title} onClick={() => handleCloseNavMenu(page.route)} sx={{ my: 2, color: 'white', display: 'block' }}>
                {page.title}
              </Button>
            ))}
          </Box>

          {/* Nombre de usuario loggeado */}
          {loggedUser && (
            <Box sx={{ flexGrow: 0 }}>
              <Typography variant="body1" sx={{ color: 'white' }}>
                {loggedUser?.user?.nombre}
              </Typography>
            </Box>
          )}

          {/* Settings a la derecha -tanto para pantallas grandes como para celular */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <ManageAccountsIcon sx={{ color: 'white' }}/>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{vertical: 'top', horizontal: 'right'}}
              keepMounted
              transformOrigin={{vertical: 'top', horizontal: 'right'}}
              open={Boolean(anchorElUser)}
              onClose={() =>  handleCloseUserMenu(null)}
            >
              {settings.map((setting) => (
                <MenuItem key={setting.title} onClick={() => handleCloseUserMenu(setting.route)}>
                  <Typography textAlign="center">{setting.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

