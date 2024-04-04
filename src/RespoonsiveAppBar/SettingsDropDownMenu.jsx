import PropTypes from 'prop-types';
import { useState } from "react"; 
import { Link } from "react-router-dom";

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';


export function SettingsDropDownMenu({settings}) {

    const [anchorElUser, setAnchorElUser] = useState(null);
    
    return(  
        <Box sx={{ flexGrow: 0, ml: 1}}>
            <Tooltip title="Settings">
                <IconButton onClick={(event) => setAnchorElUser(event.currentTarget)} sx={{ p: 0 }}>
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
                onClose={() =>  setAnchorElUser(null)}
            >
                {settings.map((setting) => (
                <MenuItem key={setting.title} onClick={() => setAnchorElUser(null)}>
                    <Link to={setting.route} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Typography textAlign="center">{setting.title}</Typography>
                    </Link>
                </MenuItem>
                ))}
            </Menu>
        </Box>
    )
}

SettingsDropDownMenu.propTypes = {
    settings: PropTypes.array.isRequired,
}