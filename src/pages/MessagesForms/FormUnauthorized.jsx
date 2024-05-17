import PropTypes from 'prop-types';
import { MessageContainer } from './MessageContainer';

export const FormUnauthorized = ({ user, module }) => {
  return (
    <MessageContainer
      title="¡Lo sentimos!"
      body={`El usuario: ${user}, no tiene autorización para ingresar en el módulo: ${module}`}
      footer="Consulte con el administrador del Sistema para mayor información"
    />
  );
};

FormUnauthorized.propTypes = {
  user: PropTypes.string,
  module: PropTypes.string,
};
