import { Link } from '@mui/material';
import { MessageContainer } from './MessageContainer';

export const FormInvalidLink = () => {
  return (
    <MessageContainer
      title="¡Enlace incorrecto!"
      body="El enlace que has proporcionado no es válido. Por favor, verifica y asegúrate de que estás ingresando el enlace correcto."
      footer={
        <>
          Si necesitas ayuda, por favor contacta con el administrador del sistema o
          visita nuestra <Link href="/ayuda">página de ayuda</Link>.
        </>
      }
    />
  );
};



