import { Typography, Link, styled } from '@mui/material';

const RootDiv = styled('div')({
  textAlign: "center",
  marginTop: "3rem",
});

const SpacedTypography = styled(Typography)({
  marginBottom: "2rem", 
});

export const FormAviso = () => {
  return (
    <RootDiv>
      <SpacedTypography variant="h5" gutterBottom>
        ¡Gracias por utilizar nuestros productos!
      </SpacedTypography>
      <SpacedTypography variant="body1" gutterBottom>
        Recorda que podes volver a consultar el estado de tu caso en cualquier momento ingresando al mismo link.
      </SpacedTypography>
      <Typography variant="body2">
        Si necesitas ayuda, por favor contacta con el administrador del sistema o
        visita nuestra <Link href="/ayuda">página de ayuda</Link>.
      </Typography>
    </RootDiv>
  );
};



