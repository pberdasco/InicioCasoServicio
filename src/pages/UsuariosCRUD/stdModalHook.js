import { useState } from "react";
import { SimpleEntity } from "../../apiAccess/simpleEntityApi"

export const useModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalOpen = () => setIsModalOpen(true);
    const modalClose = () => setIsModalOpen(false);

    // Este estado se genera en el hook, table lo usa al llamar a config y en config se pasa a la funcion que abre al modal para pasarle row
    // la modal va a guardar aqui el resultado del update. 
    const [updatedInfo, setUpdatedInfo] = useState({ actionType: "", row: {} });
    const [isInfoUpdated, setIsInfoUpdated] = useState(true);

    // Cuando presionan el boton de edit en una fila o create en la cabecera
    const handleRowUpdate = (row, actionType) => {
        setUpdatedInfo({ actionType: actionType, row: row });  
        modalOpen();
    };

    // Graba la actualizacion, marca el estado setInfooUpdated y cierra la modal
    const modalOnSave = async(data) => {
        try{
            if (updatedInfo.actionType === "update"){   
                const simpleEntityData = await SimpleEntity.update(updatedInfo.row.id, data);
                if (!simpleEntityData.status){
                    setIsInfoUpdated(true)
                }else{
                    console.log("Error", simpleEntityData.status, simpleEntityData.message )
                }  
            } else if (updatedInfo.actionType === "create"){
                //TODO: agregar validacion de datos necesarios para el alta
                const simpleEntityData = await SimpleEntity.create(data);
                if (!simpleEntityData.status){
                    setIsInfoUpdated(true)
                }else{
                    console.log("Error", simpleEntityData.status, simpleEntityData.message )
                }  
            } else if (updatedInfo.actionType === "delete"){
                //const simpleEntityData = await SimpleEntity.delete(updatedInfo.row);
                // if (!simpleEntityData.status){
                //     setIsEntityUpdated(true)
                // }else{
                //     console.log("Error", simpleEntityData.status, simpleEntityData.message )
                // }  
            }
        }catch (error){
            console.log("Error en updateState", error)
        }
        modalClose(); // Cerrar el modal después de guardar
    };

    return { isModalOpen, modalClose, modalOnSave, handleRowUpdate, updatedInfo, isInfoUpdated, setIsInfoUpdated };
};