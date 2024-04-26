import { useState } from 'react';

export const useModalFotos = () => {
  const [modalFotosOpen, setModalFotosOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleOpenModalFotos = (row) => {
    setSelectedRow(row);
    setModalFotosOpen(true);
  };

  const handleCloseModalFotos = () => {
    setModalFotosOpen(false);
    setSelectedRow(null);
  };

  return { modalFotosOpen, handleOpenModalFotos, handleCloseModalFotos, selectedRow };
};