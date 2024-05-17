import PropTypes from 'prop-types';
import { Link } from '@mui/material';
import { MessageContainer } from './MessageContainer';

export const FormAgradecimiento = ({ name, product, token, casoIdCRM }) => {
  return (
    <MessageContainer
      title={`¡Muchas gracias ${name}!`}
      body={`Tu solicitud por problemas con ${product} ha sido enviado a nuestro departamento de servicio técnico.`}
      footer={
        <>
          Podrás seguir el estado del caso accediendo al mismo link con el que ingresaste a cargar el formulario<br/>
          <Link href={`/service/${token}`}>{`Consultar estado del caso: ${casoIdCRM}`}</Link>.
        </>
      }
    />
  );
};

FormAgradecimiento.propTypes = {
  name: PropTypes.string.isRequired,  
  product: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  casoIdCRM: PropTypes.string.isRequired,
};
