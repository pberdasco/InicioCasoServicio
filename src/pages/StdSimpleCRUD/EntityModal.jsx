import PropTypes from 'prop-types';

import { Dialog, DialogContent } from '@mui/material';
import { FormEntity } from './FormEntity';

// Componente para renderizar la modal donde desplegar el form de la entidad que esta manejando la tabla
// Se lo usa en EntityTable.jsx (Entity será la entidad especifica Cliente, Producto, etc)
// En principio solo requiere que se cambie <FormEntity> por el que corresponda (con las mismas props)
export const EntityModal = ({ isOpen, onClose, onSave, updatedInfo }) => {
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
        <FormEntity onSave={handleSaveClick} onClose={onClose} updatedInfo={updatedInfo}/> 
      </DialogContent>
    </Dialog>
  );
};

EntityModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  updatedInfo: PropTypes.object.isRequired,
};