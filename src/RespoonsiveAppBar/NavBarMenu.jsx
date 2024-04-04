import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

export function NavBarMenu({pages}) {
    return (
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {pages.map((page) => (
                <Button key={page.title} sx={{ my: 2, color: 'white', display: 'block' }}>
                    <Link to={page.route} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {page.title}
                    </Link>
                </Button>
            ))}
            </Box>
    )
}

NavBarMenu.propTypes = {
    pages: PropTypes.array.isRequired,
}
  