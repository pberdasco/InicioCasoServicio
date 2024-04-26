import PropTypes from 'prop-types';

import { Dialog, DialogContent } from '@mui/material';
import { UsuariosForm } from './UsuariosForm';

export const Modal = ({ isOpen, onClose, onSave, updatedInfo }) => {
  const handleSaveClick = async (data) => {
    await onSave(data);
    onClose();
  };

  const handelBackdropClick = (event, reason) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown")
      event.stopPropagation();
    else
      onClose(event, reason);
  }

  return (
    <Dialog open={isOpen} onClose={handelBackdropClick} maxWidth="lg" fullWidth={true}>
      <DialogContent>
        <UsuariosForm onSave={handleSaveClick} onClose={onClose} updatedInfo={updatedInfo}/> 
      </DialogContent>
    </Dialog>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  updatedInfo: PropTypes.object.isRequired,
};