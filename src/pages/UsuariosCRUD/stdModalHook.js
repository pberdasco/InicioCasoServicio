import { useState } from "react";
import { Auth } from "../../apiAccess/authApi";
import { StdConfirm } from "../../stdComponents/StdConfirm";

/**
 * Hook personalizado para gestionar un modal y sus alertas en una aplicación React.
 * Este hook proporciona funciones para abrir y cerrar el modal, así como para guardar
 * datos actualizados y manejar eventos relacionados con el modal, como la actualización
 * de información o la eliminación de elementos.
 *
 * @returns {Object} Un objeto que contiene funciones y estados relacionados con el modal.
 * @property {boolean} isModalOpen - Indica si el modal está abierto o cerrado.
 * @property {function} modalClose - Función para cerrar el modal.
 * @property {function} modalOnSave - Función para guardar datos actualizados en el modal.
 * @property {function} handleRowUpdate - Función para manejar eventos de actualización de filas. En stdTableConfig se hacen las invocaciones. 
 * @property {Object} updatedInfo - Objeto que almacena información actualizada. La "accion a realizar" y la "fila" de la tabla para compartirlo con el formulario asociado
 * @property {boolean} isInfoUpdated - Indica si la información ha sido actualizada. Dispara la re-renderizacion de la tabla de UsuariosCRUD
 * @property {function} setIsInfoUpdated - Función para establecer el estado de información actualizada. Se exporta para que luego del fecth correspondiente se blanquee.
 * @property {Object} alert - Objeto {error, status, message}. Cuando esta seteado dispara alerta (en general error en grabacion) en el form y no deja cerrar la modal. 
 * @property {function} alertSet - Función para establecer alertas. Se exporta para que luego de mostrar la alerta se blanquee.
 * 
 * En general
 */
export const useModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalOpen = () => setIsModalOpen(true);
    const modalClose = () => {  setAlert({});
                                setIsModalOpen(false);}
    const [alert, setAlert] = useState({})
    const alertSet = (alertRecord) => {setAlert(alertRecord);}
 
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