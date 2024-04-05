import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/es';

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
                return casoData;
            } else if (casoResponse.status === 404) {
                const status = casoResponse.status;
                const errorData = await casoResponse.json(); 
                const message = errorData?.message || "Caso por token no encontrado"; 
                return { status, message };
            } 
        } catch (error) {
            console.log(error);
            throw new Error("Error al buscar el caso");
        }
    }

    static bodyUpdate(casoIds, casoData){
        const body = JSON.stringify({
            //clienteId: casoIds.clienteId,  //no deberia modificarso
            //fechaAlta: fInicioSQLFormat,   //no deberia modificarse
            //fechaInicio y fechaFin deben seguir en blanco hasta statusdatosok
            //idCRM: casoData.casoNro,       //no deberia modificarse
            statusDatosID: 2, // lo pone en revision 
            estadoID: 1, // Inicial
            dirCalle: casoData.calle,
            dirNumero: 0, //TODO: separar los campos
            dirProvincia: casoData.provincia.id,
            dirLocalidad: casoData.dirLocalidad,
            dirCodigoPostal: casoData.codPostal,
            fotoDestuccionLink: casoData.hiddenFotoProducto,
            fallaStdId: 0,  // falla no definida aun
            //falta foto factura hiddenFotoFactura
            tokenLink: casoIds.tokenLink,  // lo tiene que mandar para que no lo calcule de nuevo

            items: [{
                //id: se define al grabarlo
                //casoId: lo pone la api
                fila: 1,
                tipoProductoId: 1, //TODO: ver de donde sacarlo
                //color pareceria que no va mas
                serie: casoData.serie,
                productoId: 10, // TODO: por ahora solo tenemos el codigo erp y descripcion
                fechaFactura: casoData.fechaFacturaCompra,
                nroFactura: "ND", // TODO: pedir el dato
                estadoID: 1,
                fallaCliente: casoData.falla,
            }]
        });
        console.log("Body: ", body);
        return body;
    }

    static async Update(casoIds, casoData){
        console.log(JSON.stringify(casoData));
        try {
            const casoResponse = await fetch(`${apiBaseUrl}casos/all/${casoIds.id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: Caso.bodyUpdate(casoIds, casoData),
            });
            if (casoResponse.ok) {
                const casoResult = await casoResponse.json();
                return casoResult;
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



/* 
Cliente
{
    "codigo": "",
  * "nombre": "",
  * "apellido": "",
  * "mail": "",
    "empresa": "",
    "tipoDoc": "D",
    "documento": "",
    "entregaDefault": 1,
    "tipo": "I",
    "dirCalle": "",
    "dirNumero": "",
    "dirProvincia": 1,  este hay que pasarlo aunque no lo tengamos porque es fk de la tabla de provincias
    "dirLocalidad": "",
    "dirCodigoPostal": "",
    "idERP": "",
    "idCRM": ""
}

Caso
{

}
*/