import { Caso } from "../../apiAccess/casoApi";
// ==================================================
//      Prueba cambio de un atributo en una fila
export async function setStatusDatos(estado, mensaje, row, setCasosUpdated) {    
    try{
        console.log("grabando el nuevo estado y mensaje: ", estado, mensaje)
        const dataCasos = await Caso.partialUpdate(row.original.id, {statusDatosID: estado, mensaje: mensaje});  
        if (!dataCasos.errorStatus){
            setCasosUpdated({row})
        }else{
            console.log("error", dataCasos.errorStatus, dataCasos.errorMessage )
        }
        console.groupEnd();    
    }catch (error){
        console.log("fallo en setStatusDatos", error)
    }
}