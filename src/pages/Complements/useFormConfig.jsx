import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import dayjs from 'dayjs';
import { useCallback } from 'react';

export const useFormConfig = () => {
  const theme = useTheme();
  const formWidth = useMediaQuery(theme.breakpoints.down('md')) ? '99%' : '90%';
  const requiredMsg = 'Campo Requerido';

  const formatDate = useCallback((date) => {
    return dayjs(date).format("D/M/YYYY");
  }, []);
  // const formatDate = (date) => dayjs(date).format("D/M/YYYY")

  return {
    formWidth,
    requiredMsg,
    formatDate, 
  };
};