import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

export function NavBarMenu({pages, handleCloseMenu}) {
    return (
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {pages.map((page) => (
                <Button key={page.title} onClick={() => handleCloseMenu(page.route)} sx={{ my: 2, color: 'white', display: 'block' }}>
                    {page.title}
                </Button>
            ))}
            </Box>
    )
}

NavBarMenu.propTypes = {
    pages: PropTypes.array.isRequired,
    handleCloseMenu: PropTypes.func.isRequired
  }
  