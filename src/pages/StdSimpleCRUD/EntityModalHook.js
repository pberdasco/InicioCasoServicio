import { useState } from "react";
import { SimpleEntity } from "../../apiAccess/simpleEntityApi"
import { useEntityContext } from "./EntityContextHook";

export const useEntityModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalOpen = () => setIsModalOpen(true);
    const modalClose = () => setIsModalOpen(false);

    // Este estado se genera en el hook, table lo usa al llamar a config y en config se pasa a la funcion que abre al modal para pasarle row
    // la modal va a guardar aqui el resultado del update. 
    const [updatedInfo, setUpdatedInfo] = useState({ actionType: "", row: {}, newRow: {} });

    const {setIsEntityUpdated} = useEntityContext();

    // Cuando presionan el boton de edit
    const handleRowUpdate = (row, actionType) => {
        setUpdatedInfo({ actionType: actionType, row: row, newRow: {} });  
        modalOpen();
    };

    // Graba la actualizacion, marca el estado setEntityUpdated y cierra la modal
    // TODO: quizas haya que estudiar donde se desSetea entityUpdated
    const entityModalOnSave = async(data) => {
        if (updatedInfo.actionType === "update"){
            await SimpleEntity.updateState(data, updatedInfo.row, setIsEntityUpdated);
        } else if (updatedInfo.actionType === "create"){
            console.log(" create: " , data);
            //SimpleEntity.createState(data, setEntityUpdated);
        } else if (updatedInfo.actionType === "delete"){
            console.log(" delete: " , updatedInfo.row);
            //SimpleEntity.deleteState(updatedInfo.row, setEntityUpdated);
        }
        modalClose(); // Cerrar el modal después de guardar
    };

    return { isModalOpen, modalClose, entityModalOnSave, handleRowUpdate, updatedInfo };
};