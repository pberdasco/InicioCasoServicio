import PropTypes from 'prop-types';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { FormEntity } from './FormEntity';


export const EntityModal = ({ isOpen, onClose, onSave, setEntityUpdated, updatedInfo }) => {
  const handleSaveClick = (data) => {
    onSave(data, setEntityUpdated);
    onClose();
  };

  //TODO: Sacar el boton Cancelar y reemplazarlo por uno en el form.
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Complete el formulario</DialogTitle>
      <DialogContent>
        <FormEntity onSave={handleSaveClick} onClose={onClose} updatedInfo={updatedInfo}/> 
      </DialogContent>
      {/* <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
      </DialogActions> */}
    </Dialog>
  );
};

EntityModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  setEntityUpdated: PropTypes.func.isRequired,
  updatedInfo: PropTypes.object.isRequired,
};