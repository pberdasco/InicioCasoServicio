import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';

import { BrandLogo } from './BrandLogo';
import { NavBarMenu } from './NavBarMenu';
import { NavDropDownMenu } from './NavDropDownMenu';
import { SettingsDropDownMenu } from './SettingsDropDownMenu';
import { UserDisplay } from './UserDisplay';

const pages = [{title:'Inicio Caso', route: "/inicio"}, {title:'Ej.Garantías', route: "/"}];
const settings = [{title: 'Login', route: "/login"}, {title: 'Cuentas', route: '/account'}];

export function ResponsiveAppBar() {

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>  
          <BrandLogo screenSize={"m"}/>                {/* Logo Empresa (pantalla grande)*/}
          <NavDropDownMenu pages={pages}/>             {/* Menu Acciones descolgable (pantalla chica) */}
          <BrandLogo screenSize={"s"}/>                {/* Logo Empresa (pantalla chica - a la derecha) */}
          <NavBarMenu pages={pages}/>                  {/* Menu Acciones en la barra (pantalla grande) */}
          <UserDisplay />                              {/* Nombre de usuario loggeado */}
          <SettingsDropDownMenu settings={settings}/>  {/* Menu Settings descolgable */}    
        </Toolbar>
      </Container>
    </AppBar>
  );
}