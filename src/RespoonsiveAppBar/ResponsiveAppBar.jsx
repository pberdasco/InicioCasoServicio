import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { useLocation } from 'react-router-dom';

import { BrandLogo } from './BrandLogo';
import { NavBarMenu } from './NavBarMenu';
import { NavDropDownMenu } from './NavDropDownMenu';
import { SettingsDropDownMenu } from './SettingsDropDownMenu';
import { UserDisplay } from './UserDisplay';

const pages = [{title:'Inicio Caso', route: "/inicio"}, {title:'Ej.Garantías', route: "/"}];

export function ResponsiveAppBar() {
  const location = useLocation();
  const noNavBar = location.pathname.startsWith('/service');

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>  
          <BrandLogo screenSize={"m"}/>                       {/* Logo Empresa (pantalla grande)*/}
          {!noNavBar && <NavDropDownMenu pages={pages}/>}     {/* Menu Acciones descolgable (pantalla chica) */}
          <BrandLogo screenSize={"s"}/>                       {/* Logo Empresa (pantalla chica - a la derecha) */}
          {!noNavBar && <NavBarMenu pages={pages}/>}          {/* Menu Acciones en la barra (pantalla grande) */}
          {!noNavBar && <UserDisplay />}                      {/* Nombre de usuario loggeado */}
          {!noNavBar && <SettingsDropDownMenu/>}              {/* Menu Settings descolgable */}    
        </Toolbar>
      </Container>
    </AppBar>
  );
} 