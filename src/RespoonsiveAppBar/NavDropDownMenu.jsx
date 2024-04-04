import PropTypes from 'prop-types';
import { useState } from "react"; 
import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';


export function NavDropDownMenu({pages}) {

    const [anchorElNav, setAnchorElNav] = useState(null);

    return (
        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            {/* Hamburguesa */}
            <Tooltip title="Menu">
                <IconButton onClick={(event) => setAnchorElNav(event.currentTarget)} 
                            size="large" aria-label="acciones posibles" aria-controls="menu-appbar" aria-haspopup="true" color="inherit">
                    <MenuIcon />
                </IconButton>
            </Tooltip>
            {/* Opciones de menu hamburguesa */}
            <Menu
                sx={{display: { xs: 'block', md: 'none' }}}
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                keepMounted
                transformOrigin={{vertical: 'top', horizontal: 'left'}}
                open={Boolean(anchorElNav)}
                onClose={() => setAnchorElNav(null)}
                >
                {pages.map((page) => (
                    <MenuItem key={page.title} onClick={() => setAnchorElNav(null)}>
                        <Link to={page.route} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Typography textAlign="center">{page.title}</Typography>
                        </Link>
                    </MenuItem>
                ))}
            </Menu>
      </Box>
    )
}

NavDropDownMenu.propTypes = {
    pages: PropTypes.array.isRequired,
  }
  