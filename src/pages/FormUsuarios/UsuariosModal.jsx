/* eslint-disable react/prop-types */
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { FormEstadoDatos } from './FormEstadoDatos';


export const UsuariosModal = ({ isOpen, onClose, onSave, setCasosUpdated }) => {
  const handleSaveClick = (data) => {
    onSave(data, setCasosUpdated);
    onClose();
  };

  //TODO: Sacar el boton Cancelar y reemplazarlo por uno en el form.
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
