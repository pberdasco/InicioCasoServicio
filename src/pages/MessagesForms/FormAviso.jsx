import { Link } from '@mui/material';
import { MessageContainer } from './MessageContainer';

export const FormAviso = () => {
  return (
    <MessageContainer
      title="¡Gracias por utilizar nuestros productos!"
      body="Recorda que podes volver a consultar el estado de tu caso en cualquier momento ingresando al mismo link."
      footer={
        <>
          Si necesitas ayuda, por favor contacta con el administrador del sistema o
          visita nuestra <Link href="/ayuda">página de ayuda</Link>.
        </>
      }
    />
  );
};




