import PropTypes from 'prop-types';
import { Navigate } from "react-router-dom";

// Compoonente para redireccionar a Login antes de componentes que requieran al usuario logueado
// o continuar al componente si el usuario ya esta logueado.
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