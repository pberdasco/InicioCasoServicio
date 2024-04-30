import PropTypes from 'prop-types';

import { Dialog, DialogContent } from '@mui/material';
import { UsuariosForm } from './UsuariosForm';  //? junto con <UsuariosForm/> serian los unicos cambios para otros ABMs basicos

export const Modal = ({ isOpen, onClose, modalOnSave, updatedInfo, alert, alertSet }) => {
  const handleSaveClick = async (data) => {
    const result = await modalOnSave(data);
    if (result === "Ok") onClose();
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
        <UsuariosForm onSave={handleSaveClick} onClose={onClose} updatedInfo={updatedInfo} alert={alert} alertSet={alertSet}/> 
      </DialogContent>
    </Dialog>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  modalOnSave: PropTypes.func.isRequired,
  updatedInfo: PropTypes.object.isRequired,
  alert: PropTypes.object,
  alertSet: PropTypes.func.isRequired,
};