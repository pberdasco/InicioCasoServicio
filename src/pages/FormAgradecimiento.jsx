import PropTypes from 'prop-types';
import { Typography, Link, styled } from '@mui/material';

const RootDiv = styled('div')({
  textAlign: "center",
  marginTop: "3rem",
});

export const FormAgradecimiento = ({name, product, token, casoIdCRM}) => {
  return (
    <RootDiv>
      <Typography variant="h5" gutterBottom>
        {`¡Muchas gracias ${name}!`}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {`Tu solicitud por problemas con ${product} ha sido enviado a nuestro departamento de servicio técnico.`}
      </Typography>
      <Typography variant="body2">
        Podrás seguir el estado del caso accediendo al mismo link con el que ingresaste a cargar el formulario<br/>
        <Link href={`/service/${token}`}>{`Consultar estado del caso: ${casoIdCRM}`}</Link>.
      </Typography>
    </RootDiv>
  );
};

FormAgradecimiento.propTypes = {
  name: PropTypes.string.isRequired,  
  product: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  casoIdCRM: PropTypes.string.isRequired,
}  