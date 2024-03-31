import PropTypes from 'prop-types';
import { useState } from "react"; 

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';


export function SettingsDropDownMenu({settings, handleCloseMenu}) {

    const [anchorElUser, setAnchorElUser] = useState(null);
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = (route) => {
        setAnchorElUser(null);
        handleCloseMenu(route)
      };
    
    return(  
        <Box sx={{ flexGrow: 0, ml: 1}}>
            <Tooltip title="Settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <ManageAccountsIcon sx={{ color: 'white' }}/>
                </IconButton>
            </Tooltip>
            <Menu
                sx={{ mt: '45px' }}
                id="settings-appbar"
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
    )
}

SettingsDropDownMenu.propTypes = {
    settings: PropTypes.array.isRequired,
    handleCloseMenu: PropTypes.func.isRequired
  }