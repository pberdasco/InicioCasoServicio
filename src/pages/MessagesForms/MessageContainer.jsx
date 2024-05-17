import PropTypes from 'prop-types';
import { Typography, styled } from '@mui/material';

const RootDiv = styled('div')({
  textAlign: "center",
  marginTop: "3rem",
});

const SpacedTypography = styled(Typography)({
  marginBottom: "2rem", 
});

export const MessageContainer = ({ title, body, footer }) => {
  return (
    <RootDiv>
      {title && (
        <SpacedTypography variant="h5" gutterBottom>
          {title}
        </SpacedTypography>
      )}
      {body && (
        <SpacedTypography variant="body1" gutterBottom>
          {body}
        </SpacedTypography>
      )}
      {footer && (
        <Typography variant="body2">
          {footer}
        </Typography>
      )}
    </RootDiv>
  );
};

MessageContainer.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string,
  footer: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
};
