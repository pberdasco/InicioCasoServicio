import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/es';

import { CasoModel } from './casoModel';

const apiBaseUrl = `http://192.168.78.103:5001/`;

export class Caso {
    // Busca al cliente por mail y si no lo encuentra lo crea
    static async searchOrCreateCliente(casoData) {
        try {
            const clienteResponse = await fetch(`${apiBaseUrl}clientes/email/${casoData.mail}`);
            if (clienteResponse.ok) {
                const clienteData = await clienteResponse.json();
                return clienteData.id;
            } else if (clienteResponse.status === 404) {
                return await Caso.createNewCliente(casoData);
            } else {
                throw new Error("Error al buscar el cliente");
            }
        } catch (error) {
            console.log(error);
            throw new Error("Error al buscar o crear el cliente");
        }
    }

    // Crea un cliente con datos mínimos
    static async createNewCliente(casoData) {
        try {
            const nuevoClienteResponse = await fetch(`${apiBaseUrl}clientes/`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    nombre: casoData.nombre,
                    apellido: casoData.apellido,
                    mail: casoData.mail,
                    dirProvincia: 1
                })
            });

            if (nuevoClienteResponse.ok) {
                const nuevoClienteData = await nuevoClienteResponse.json();
                return nuevoClienteData.id;
            } else {
                throw new Error("Error al crear el cliente");
            }
        } catch (error) {
            console.log(error);
            throw new Error("Error al crear el cliente");
        }
    }

    // Crea un caso con datos minimos teniendo en cuenta que ya el cliente existe
    static async createCaso(casoData, clienteId) {
        try {
            const fInicioSQLFormat = dayjs(casoData.fInicio, 'D-M-YYYY').format('YYYY-MM-DD');
            const casoResponse = await fetch(`${apiBaseUrl}casos`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    clienteId: clienteId,
                    fechaAlta: fInicioSQLFormat,
                    statusDatosID: 0,
                    estadoID: 1,
                    idCRM: casoData.casoNro,
                    dirProvinciaId: 1, // solo porque es requerido
                    tipoCaso: "C", // consumidor final
                    items: []
                })
            });

            if (casoResponse.ok) {
                const casoResult = await casoResponse.json();
                return casoResult;
            } else {
                throw new Error("Error al crear el caso");
            }
        } catch (error) {
            console.log(error);
            throw new Error("Error al crear el caso");
        }
    }

    // Crea un caso encargandose de verifiicar antes si el cliente existe y si no crearlo tambien
    // eslint-disable-next-line no-unused-vars
    static async Create(casoData, loggedUser) {
        // TODO: Usar loggedUser para el token. Eventualmente también incorporarlo como campo en el caso.
        try {
            dayjs.extend(customParseFormat);
            const clienteId = await Caso.searchOrCreateCliente(casoData);
            const casoResult = await Caso.createCaso(casoData, clienteId);
            return casoResult;
        } catch (error) {
            console.log(error);
            return { status: 500, message: "Error interno del servidor" };
        }
    }

    static async GetByToken(token){
        try {
            const casoResponse = await fetch(`${apiBaseUrl}casos/token/${token}`);
            if (casoResponse.ok) {
                const casoData = await casoResponse.json();
                return new CasoModel(casoData);
            } else if (casoResponse.status === 404) {
                const status = casoResponse.status;
                const errorData = await casoResponse.json(); 
                const message = errorData?.message || "Caso por token no encontrado";
                return { status, message };
            } 
        } catch (error) {
            console.log(error);
            return { status: 400, message: "Error al buscar el caso" };
        }
    }

    // Arma el body para llamar al endpoint PUT ../casos/all
    static bodyUpdate(casoIds, casoData){
        console.groupCollapsed("bodyUpdate");
        console.log("casoIds: ", casoIds);
        console.log("casoData: ", casoData);
        
        const fCargaSQLFormat = dayjs().format('YYYY-MM-DD');
        const body = 
            {caso: JSON.stringify({    
                //clienteId: casoIds.clienteId,  //no deberia modificarso
                //fechaAlta: fInicioSQLFormat,   //no deberia modificarse
                //fechaInicio y fechaFin deben seguir en blanco hasta statusdatosok
                //idCRM: casoData.casoNro,       //no deberia modificarse
                fechaCarga: fCargaSQLFormat,
                statusDatosID: 2, // lo pone en revision 
                estadoID: 1, // Inicial
                dirCalle: casoData.calle,
                dirNumero: 0, //TODO: separar los campos
                dirProvinciaId: casoData.provincia.id,
                dirLocalidad: casoData.localidad,
                dirCodigoPostal: casoData.codPostal,
                fallaStdId: 0,  // falla no definida aun
                tokenLink: casoIds.tokenLink,  // lo tiene que mandar para que no lo calcule de nuevo

                items: [{
                    //id: se define al grabarlo
                    //casoId: lo pone la api
                    fila: 1,
                    productoId: casoData.producto.id,
                    tipoProductoId: casoData.producto.tipoId,
                    //color pareceria que no va mas
                    serie: casoData.serie,
                    fechaFactura: casoData.fechaFacturaCompra,
                    nroFactura: casoData.nroFacturaCompra,
                    estadoID: 1,
                    fallaCliente: casoData.falla,
                    fallaStdId: 5, // 5= no definida aun
                    fotoDestuccionLink: casoData.hiddenFotoProducto,
                    fotoFacturaLink: casoData.hiddenFotoFactura,
                }]
            }),      
            cliente: JSON.stringify({
                nombre: casoData.nombre,
                apellido: casoData.apellido,
                telefono: casoData.telefono,
                tipoDoc: "D",
                documento: casoData.dni,
                dirCalle: casoData.calle,
                dirProvincia: casoData.provincia.id,
                dirLocalidad: casoData.localidad,
                dirCodigoPostal: casoData.codPostal,
            })
        }
        console.log("body: ", body);
        console.groupEnd();
        return body;
    }

    static async Update(casoIds, casoData){
        try {
            const bodyUpdate = Caso.bodyUpdate(casoIds, casoData);

            const casoResponse = await fetch(`${apiBaseUrl}casos/all/${casoIds.id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: bodyUpdate.caso,
            });
            if (casoResponse.ok) {
                const clienteResponse = await fetch(`${apiBaseUrl}clientes/${casoIds.clienteId}`, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: bodyUpdate.cliente,
                });
                if (clienteResponse.ok) {
                    const casoResult = await casoResponse.json();
                    const clienteResult = await clienteResponse.json();
                    return {casoResult, clienteResult};
                } else {
                    const status = clienteResponse.status;
                    const errorData = await clienteResponse.json(); 
                    const message = errorData?.message || "Error en la carga del caso"; 
                    return { status, message };
                }        
            } else {
                const status = casoResponse.status;
                const errorData = await casoResponse.json(); 
                const message = errorData?.message || "Error en la carga del caso"; 
                return { status, message };
            }
        } catch (error) {
            console.log(error);
            return { status: 500, message: "Error interno del servidor" };
        }
    }
}