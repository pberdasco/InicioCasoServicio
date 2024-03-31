import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import dayjs from 'dayjs';

export const useFormConfig = () => {
  const theme = useTheme();
  const formWidth = useMediaQuery(theme.breakpoints.down('md')) ? '99%' : '90%';
  const requiredMsg = 'Campo Requerido';
  const formatDate = (date) => dayjs(date).format("D/M/YYYY")

  return {
    formWidth,
    requiredMsg,
    formatDate, 
  };
};