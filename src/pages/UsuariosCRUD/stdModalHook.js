import { useState } from "react";
import { Auth } from "../../apiAccess/authApi";
import { StdConfirm } from "../../stdComponents/StdConfirm";

export const useModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalOpen = () => setIsModalOpen(true);
    const modalClose = () => {  setAlert({});
                                setIsModalOpen(false);}
    const [alert, setAlert] = useState({})
    const alertSet = (alertRecord) => {setAlert(alertRecord);}

    // Este estado se genera en el hook, table lo usa al llamar a config y en config se pasa a la funcion que abre al modal para pasarle row
    // la modal va a guardar aqui el resultado del update. 
    const [updatedInfo, setUpdatedInfo] = useState({ actionType: "", row: {} });
    const [isInfoUpdated, setIsInfoUpdated] = useState(true);

    // Cuando presionan el boton de edit en una fila o create en la cabecera
    const handleRowUpdate = (row, actionType) => {
        setUpdatedInfo({ actionType: actionType, row: row }); 
        if (actionType === "delete"){
            StdConfirm({ title: "Confirmación de Baja",
                        message: `Está seguro de querer eliminar el usuario ${row.nombre} - ${row.mail}.`,
                        yesFunction: onDelete, yesArgs: [row.id]});
        }else{
            modalOpen();
        }
    };

    const onDelete = async (id) => {
        try{
            const result = await Auth.Delete(id);
            if (!result.status){
                setIsInfoUpdated(true);
            }else{
                console.log("Error", result.status, result.message )
                // Ver como mostrar el mensaje de error
            }  
        }catch(error){
            console.log("Error en delete", error)
            // ver como mostrar el mensaje de error
        }
    }

    // Graba la actualizacion, marca el estado setInfooUpdated y cierra la modal
    const modalOnSave = async(data) => {
        let estado = {};
        try{
            if (updatedInfo.actionType === "update"){   
                const result = await Auth.Update(data);
                if (!result.status){
                    setIsInfoUpdated(true);
                    estado = {error: false, status: "", message: `Usuario ${data.nombre} acualizado correctamente` };
                }else{
                    console.log("Error", result.status, result.message )
                    estado = {error: true, status: result.status, message: result.message };
                }  
            } else if (updatedInfo.actionType === "create"){
                console.log("User Data: ", data);
                const result = await Auth.Register(data);
                if (!result.status){
                    setIsInfoUpdated(true);
                    estado = {error: false, status: "", message: `Usuario ${data.nombre} creado correctamente` };
                }else{
                    console.log("Error", result.status, result.message )
                    estado = {error: true, status: result.status, message: result.message };
                }  
            } else if (updatedInfo.actionType === "delete"){
                //const result = await Auth.Delete(data.id)
            }
        }catch (error){
            console.log("Error en updateState", error)
            estado = {error: true, status: error.status, message: error.message };
        }
        
        if (!estado.error){
            return "Ok";
        }else{
            alertSet(estado);
            //setAlert(() => estado)     // Ver si funciona con setAlert abandonando alertSet. 
            return "Error";              // Error avisa que no cierre la modal.
        }
    };

    return { isModalOpen, modalClose, modalOnSave, handleRowUpdate, updatedInfo, isInfoUpdated, setIsInfoUpdated, alert, alertSet };
};