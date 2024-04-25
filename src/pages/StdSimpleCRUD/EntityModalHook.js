import { useState } from "react";
import { SimpleEntity } from "../../apiAccess/simpleEntityApi"

export const useEntityModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalOpen = () => setIsModalOpen(true);
    const modalClose = () => setIsModalOpen(false);

    // Este estado se genera en el hook, table lo usa al llamar a config y en config se pasa a la funcion que abre al modal para pasarle row
    // la modal va a guardar aqui el resultado del update. 
    const [updatedInfo, setUpdatedInfo] = useState({ actionType: "", row: {}, newRow: {} });

    // Cuando presionan el boton de edit
    const handleRowUpdate = (row, actionType) => {
        setUpdatedInfo({ actionType: actionType, row: row, newRow: {} });  //TODO: ajustar esto vers si status es algo estandar
        modalOpen();
    };

    // Graba la actualizacion, marca el estado setEntityUpdated y cierra la modal
    // TODO: quizas haya que estudiar donde se desSetea entityUpdated
    const onSave = (data, setEntityUpdated) => {
        if (updatedInfo.actionType === "update")
            SimpleEntity.updateState(data, updatedInfo.row, setEntityUpdated);
        else if (updatedInfo.actionType === "create")
            console.log(" create: " , data);
            //SimpleEntity.createState(data, setEntityUpdated);
        else if (updatedInfo.actionType === "delete")
            console.log(" delete: " , updatedInfo.row);
            //SimpleEntity.deleteState(updatedInfo.row, setEntityUpdated);
        
        modalClose(); // Cerrar el modal después de guardar
    };

    return { isModalOpen, modalOpen, modalClose, onSave, handleRowUpdate, updatedInfo,setUpdatedInfo };
};