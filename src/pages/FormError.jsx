import PropTypes from 'prop-types';
import { Typography, styled } from '@mui/material';

const RootDiv = styled('div')({
  textAlign: "center",
  marginTop: "3rem",
});

export const FormError = ({errorMsg}) => {
  return (
    <RootDiv>
      <Typography variant="h5" gutterBottom>
        {`¡Lo sentimos!`}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {`Ha ocurrido un problema. Por favor contactate con Servicios`}
      </Typography>
      <Typography variant="body2">
        {errorMsg}
      </Typography>
    </RootDiv>
  );
};

FormError.propTypes = {
    errorMsg: PropTypes.string,  
}  