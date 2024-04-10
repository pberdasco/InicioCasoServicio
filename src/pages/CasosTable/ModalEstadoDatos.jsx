/* eslint-disable react/prop-types */
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { FormEstadoDatos } from './FormEstadoDatos';

export const ModalEstadoDatos = ({ isOpen, onClose, onSave, setCasosUpdated }) => {
  const handleSaveClick = (data) => {
    onSave(data, setCasosUpdated);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Complete el formulario</DialogTitle>
      <DialogContent>
        <FormEstadoDatos onSave={handleSaveClick} /> {/* Renderiza tu formulario dentro del modal */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
