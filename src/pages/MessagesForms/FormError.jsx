import PropTypes from 'prop-types';
import { MessageContainer } from './MessageContainer';

export const FormError = ({ errorMsg }) => {
  return (
    <MessageContainer
      title="¡Lo sentimos!"
      body="Ha ocurrido un problema. Por favor contactate con Servicios"
      footer={errorMsg}
    />
  );
};

FormError.propTypes = {
  errorMsg: PropTypes.string,
};
