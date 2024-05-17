import PropTypes from 'prop-types';
import { Navigate } from "react-router-dom";

/**
 * Componente para redireccionar a Login antes de componentes que requieran al usuario logueado
 * o continuar al componente si el usuario ya esta logueado.
 * Valida mirando directamente localStorage (no esta usando la variable de estado loggedUser)
 * @param {{form: JSX.Element, from: string}} props - form: formulario al que se pretende redirigir from: ruta desde donde se llamo
 * @returns {JSX.Element} El formulario form si está logueado o Navigate al formulario de login si no esta logueado
 */
export const FormRedirect = ({form, from}) => {
    const hasToken = localStorage.getItem('loggedUser');
  
    return (
      <div>
        {hasToken ? (
          form
        ) : (
          <Navigate to="/login" replace state={{ from: {from} }} />
        )}
      </div>
    );
  };

  FormRedirect.propTypes = {
    form: PropTypes.element.isRequired,
    from: PropTypes.string.isRequired
  } 