import PropTypes from 'prop-types';
import Button from '@mui/material/Button';

export function BrandLogo({screenSize}) {
    return (
      <Button 
        component="a" 
        href="/" 
        sx={{
          marginRight: '1rem',
          alignItems: 'center',
          width: '160px',
          display: {
            xs: screenSize === "s" ? 'flex' : 'none',
            md: screenSize === "m" ? 'flex' : 'none'
          }
        }}
      >
        <img src="./tool-box.png" alt="ReactForm UI Kit" style={{ width: '40%' }}/>
      </Button>
    );
  }

  BrandLogo.propTypes = {
    screenSize: PropTypes.oneOf(["s", "m"])
  }
  