import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/es';

import { CasoModel } from './casoModel';
import { apiBaseUrl_db } from './apiUrls';

export class Caso {
    // Busca al cliente por mail y si no lo encuentra lo crea
    static async searchOrCreateCliente(casoData) {
        try {
            const clienteResponse = await fetch(`${apiBaseUrl_db}clientes/email/${casoData.mail}`);
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
            const nuevoClienteResponse = await fetch(`${apiBaseUrl_db}clientes/`, {
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
            const casoResponse = await fetch(`${apiBaseUrl_db}casos`, {
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

    /**
     * *Funcion para hacer el fetch de caso utilizando el token de acceso
     * @param {string} token string generado al grabar el caso como segunda clave de acceso a casos de Consumidores finales
     * @returns {CasoModel | {status: number, message: string}} - Devuelve un objeto `CasoModel` si se encuentra el caso correspondiente al token proporcionado.
     *          En caso de error o de no encontrar el caso, devuelve un objeto con las propiedades `status` indicando el estado de la respuesta y `message` con un mensaje descriptivo.
     * 
     * Tener en cuenta que, a pesar de ser una función asíncrona, no es necesario llamarla con await porque no devuelve una promesa directamente. 
     */
    static async GetByToken(token){
        try {
            const casoResponse = await fetch(`${apiBaseUrl_db}casos/token/${token}`);
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

    /***********
    * * Funcion para buscar un caso por id
    * @param {string} id - id autonumerico del caso
    * @returns { status, message} si hubo un error o
    * @returns { object } = new CasoModel()
    *                       {id, idCRM, ..., 
    *                        direccion:{calle, ...}, 
    *                        cliente:{id, nombre, ...}, 
    *                        items:[{id, casoId, fila, 
    *                                producto:{id, tipoId, ...}},
    *                               ..]}
    ************/
    static async GetById(id){
        try {
            const casoResponse = await fetch(`${apiBaseUrl_db}casos/${id}`);
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

    static async Update(formData, casoActual, setCasoActual, validacionFactura){
        try {
            // const bodyUpdate = CasoModel.buildCasoUpdateBody(casoActual, casoData);

            const casoResponse = await fetch(`${apiBaseUrl_db}casos/all/${casoActual.id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: CasoModel.buildCasoUpdateBody(casoActual, formData, validacionFactura),
            });
            if (casoResponse.ok) {
                const clienteResponse = await fetch(`${apiBaseUrl_db}clientes/${casoActual.cliente.id}`, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: CasoModel.buildClienteUpdateBody(formData),
                });
                if (clienteResponse.ok) {
                    const casoResult = await casoResponse.json();
                    casoResult.modo = "Cargado";
                    setCasoActual(casoResult);
                    return "Ok";
                    //? Ver si tiene sentido agregar datos del cliente en casoActual. En principio para ConsFinal, no.
                    // const clienteResult = await clienteResponse.json();
                    // return {casoResult, clienteResult};
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

    static async UpdateRetail(formData, itemsData, casoActual, setCasoActual){
        try {
            const casoResponse = await fetch(`${apiBaseUrl_db}casos/all/${casoActual.id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: CasoModel.buildCasoRetailUpdateBody(casoActual, formData, itemsData),
            });
            //? En retail no estaria grabando nada del cliente.
            if (casoResponse.ok) {
                const casoResult = await casoResponse.json();
                casoResult.modo = "Cargado";
                setCasoActual(casoResult);
                return "Ok";
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

    //Funcion para grabar algun campo que cambia en la cabecera del caso
    //el casoId es obligatorio, el partialCasoData es un objeto que puede tener uno o mas datos,
    // usa un enpoint distinto a Update porque no modifica items
    //deben coincidir (por el momento) con los nombres que acepta la api.
    //TODO: unificar con Update, haciendo que update no cree los datos que no le lleguen y que haga validaciones
    static async partialUpdate(casoId, partialCasoData){
        try {
            const casoResponse = await fetch(`${apiBaseUrl_db}casos/${casoId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(partialCasoData)
            });
            if (casoResponse.ok) {
                    const casoResult = await casoResponse.json();
                    return {casoResult};
            } else {
                const status = casoResponse.status;
                const errorData = await casoResponse.json(); 
                const message = errorData?.message || "Error en el update del caso"; 
                return { status, message };
            }
        } catch (error) {
            console.log(error);
            return { status: 500, message: "Error interno del servidor" };
        }
    }

    static async GetAll(){
        try {
            const casoResponse = await fetch(`${apiBaseUrl_db}casos/`);
            if (casoResponse.ok) {
                const casoData = await casoResponse.json();
                const casos = casoData.map(caso => new CasoModel(caso));
                return casos;
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
}