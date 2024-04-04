import { Typography, Link, styled } from '@mui/material';

const RootDiv = styled('div')({
  textAlign: "center",
  marginTop: "3rem",
});

export const InvalidLinkMessage = () => {
  return (
    <RootDiv>
      <Typography variant="h5" gutterBottom>
        ¡Enlace incorrecto!
      </Typography>
      <Typography variant="body1" gutterBottom>
        El enlace que has proporcionado no es válido. Por favor, verifica y
        asegúrate de que estás ingresando el enlace correcto.
      </Typography>
      <Typography variant="body2">
        Si necesitas ayuda, por favor contacta con el administrador del sistema o
        visita nuestra <Link href="/ayuda">página de ayuda</Link>.
      </Typography>
    </RootDiv>
  );
};
