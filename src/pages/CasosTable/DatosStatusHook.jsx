import { useState } from "react";
import { setStatusDatos } from "./updateRow.js"

export const useDatosStatusModal = () => {
  const [isDatosModalOpen, setIsDatosModalOpen] = useState(false);
  const [statusUpdateInfo, setStatusUpdateInfo] = useState({ newStatus: 0, row: {} });

  const datosModalOpen = () => setIsDatosModalOpen(true);
  const datosModalClose = () => setIsDatosModalOpen(false);

  const onSave = (data, setCasosUpdated) => {
    console.group("CasosTable-On Save")
    console.log("data:", data)
    console.log("statusUdateInfo: ", statusUpdateInfo)
    console.groupEnd()
    setStatusDatos(statusUpdateInfo.newStatus, data.msg, statusUpdateInfo.row, setCasosUpdated);
    datosModalClose(); // Cerrar el modal después de guardar
  };

  return { isDatosModalOpen, datosModalOpen, datosModalClose, onSave, setStatusUpdateInfo };
};