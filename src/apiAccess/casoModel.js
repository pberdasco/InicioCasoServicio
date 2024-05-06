import dayjs from 'dayjs';
import 'dayjs/locale/es';

export class CasoModel {
    // constructor pensado para tomar datos de 
    // las apis de casos de webapi (ej: getByToken) y volcarlos en el objeto
    constructor(data) {
        this.id = data.id;                    
        this.idCRM = data.idCRM;
        this.tokenLink = data.tokenLink       // token de acceso al caso
        this.fechaAlta = data.fechaAlta;      // contact crea el caso
        this.fechaCarga = data.fechaCarga;    // cliente carga el form
        this.fechaInicio = data.fechaInicio;  // servicios aprueba la carga y comienza el proceso
        this.fechaFin = data.fechaFin;        // fin del caso
        this.statusDatosID = data.statusDatosID;   // 0: caso creado / 2: esperando revision de servicios / 1 : datosOk / 3 : datos faltantes
        this.estadoID = data.estadoID;
        // this.retiro => no se usa
        // this. opcionRetiroId => no se usa
        this.tipoCaso = data.tipoCaso;        // C: cons final / R: retail
        this.mensaje = data.mensaje;
        
        // === datos direccion ===
        this.direccion = {};
        this.direccion.calle = data.direccion.calle;   //calle, nro, piso, dpto
        // this.numero => no se usa
        this.direccion.provinciaId = data.direccion.provinciaId; 
        this.direccion.provincia = data.direccion.provincia;  // la api la toma de la tabla de provincias
        this.direccion.localidad = data.direccion.localidad;
        this.direccion.codigoPostal = data.direccion.codigoPostal;
        
        // === datos cliente ===
        this.cliente = {};
        this.cliente.id = data.cliente.id;
        this.cliente.nombre = data.cliente.nombre;
        this.cliente.apellido = data.cliente.apellido;
        this.cliente.mail = data.cliente.mail;
        this.cliente.empresa = data.cliente.empresa;
        this.cliente.tipoDoc = data.cliente.tipoDoc;
        this.cliente.documento = data.cliente.documento;
        this.cliente.idERP = data.cliente.idERP;
        this.cliente.telefono = data.cliente.telefono;
        
        // === items ===
        this.items = [];
        data.items.forEach(itemData => {
            const item = {
                id: itemData.id,
                casoId: itemData.casoId,
                fila: itemData.fila,
                // tipoProductoId: itemData.tipoProductoId,
                producto: itemData.producto,
                // color: itemData.color,   ==> no se usa
                serie: itemData.serie,
                nroFactura: itemData.nroFactura,
                fechaFactura: itemData.fechaFactura,
                estadoID: itemData.estadoID,
                fallaCliente: itemData.fallaCliente,
                fallaStdId: itemData.fallaStdId,
                causa: itemData.causa,
                fotoDestruccionLink: itemData.fotoDestruccionLink,
                fotoFacturaLink: itemData.fotoFacturaLink
            };
            this.items.push(item);
        });
    }


   /**
    * Crea el cuerpo de la solicitud para actualizar un caso en la API (/casos/all)
    * @param {object} casoActual - Datos actuales del caso (para cambios que no vienen en el form por ejemplo el token).
    * @param {object} casoData - Los campos de caso del formulario.
    * @param {object} validacionFactura - resultados de la funcion de validacion de la imagen de factura con AI
    * @returns {object} - El cuerpo de la solicitud para la actualización del caso.
    */
    static buildCasoUpdateBody(casoActual, formData, validacionFactura){
        const fCargaSQLFormat = dayjs().format('YYYY-MM-DD');
        const body = JSON.stringify({    
                //clienteId: casoActual.cliente.id,  //no deberia modificarso
                //fechaAlta: fInicioSQLFormat,   //no deberia modificarse
                //fechaInicio y fechaFin deben seguir en blanco hasta statusdatosok
                //idCRM: casoData.casoNro,       //no deberia modificarse
                fechaCarga: fCargaSQLFormat,
                statusDatosID: 2, // lo pone en revision 
                estadoID: 1, // Inicial
                dirCalle: formData.calle,
                dirNumero: 0, //TODO: separar los campos
                dirProvincia: formData.provincia.id,
                dirLocalidad: formData.localidad,
                dirCodigoPostal: formData.codPostal,
                fallaStdId: 0,  // falla no definida aun
                tokenLink: casoActual.tokenLink,  // lo tiene que mandar para que no lo calcule de nuevo
                items: [{
                    //id: se define al grabarlo
                    //casoId: lo pone la api
                    fila: 1,
                    productoId: formData.producto.id,
                    tipoProductoId: formData.producto.tipoId,
                    //color pareceria que no va mas
                    serie: formData.serie,
                    fechaFactura: formData.fechaFacturaCompra,
                    nroFactura: formData.nroFacturaCompra,
                    estadoID: 1,
                    fallaCliente: formData.falla,
                    fallaStdId: 5, // 5= no definida aun
                    fotoDestuccionLink: formData.hiddenFotoProducto,
                    fotoFacturaLink: formData.hiddenFotoFactura,
                    aiFacturaWarn: (validacionFactura.status == "Warn") ? 1 : 0,
                    aiFotoWarn:  0, //? Hasta que se agregue en validacionFactura el chequeo de Imagen
                    aiEsFactura: (validacionFactura.ai.esFactura) ? 1 : 0,
                    aiFechaFactura: validacionFactura.ai.fecha,
                    aiTieneItemValido: (validacionFactura.ai.tieneItemElectrodomestico) ? 1 : 0,
                    aiTextoItemValido: validacionFactura.ai.textoItemElectrodomestico,
                    aiTextoImagen: "",
                }]
            });            
        return body;
    }

    /**
    * Crea el cuerpo de la solicitud para actualizar el cliente en la API.
    * @param {object} casoData - Nuevos datos del caso.
    * @returns {object} - El cuerpo de la solicitud para la actualización del cliente.
    */
    static buildClienteUpdateBody(formData){
        const body = JSON.stringify({ 
            nombre: formData.nombre,
            apellido: formData.apellido,
            telefono: formData.telefono,
            tipoDoc: "D",
            documento: formData.dni,
            dirCalle: formData.calle,
            dirProvincia: formData.provincia.id,
            dirLocalidad: formData.localidad,
            dirCodigoPostal: formData.codPostal,
        })
        return body;
    }

    static buildItemsUpdateBody(itemsData){
        const items = itemsData.map((x) => ({
            //id: se define al grabarlo
            //casoId: lo pone la api
            fila: 1,
            productoId: x.producto.id,
            tipoProductoId: x.producto.tipoId,
            serie: x.serie,
            fechaFactura: x.fechaFacturaCompra,
            nroFactura: x.nroFacturaCompra,
            estadoID: 1,
            fallaCliente: x.falla,
            fallaStdId: 5, // 5= no definida aun
            fotoDestuccionLink: "",    //retail no manda fotos
            fotoFacturaLink: "",
            aiFacturaWarn: -1,  // -1 indica que no aplica.
            aiFotoWarn:  -1,
            aiEsFactura: -1,
            aiFechaFactura: null,
            aiTieneItemValido: -1,
            aiTextoItemValido: "",
            aiTextoImagen: "",
        }))
        

        return items;  // procesar itemsData para que devuleva lo que necesita buildCasosRetailUpdateBody
    }


    static buildCasoRetailUpdateBody(casoActual, formData, itemsData){
        const items = CasoModel.buildItemsUpdateBody(itemsData);
        const fCargaSQLFormat = dayjs().format('YYYY-MM-DD');
        const body = JSON.stringify({    
                //clienteId: casoActual.cliente.id,  //no deberia modificarso
                //fechaAlta: fInicioSQLFormat,   //no deberia modificarse
                //fechaInicio y fechaFin deben seguir en blanco hasta statusdatosok
                //idCRM: casoData.casoNro,       //no deberia modificarse
                fechaCarga: fCargaSQLFormat,
                statusDatosID: 2, // lo pone en revision 
                estadoID: 1, // Inicial
                dirCalle: formData.calle,
                dirNumero: 0, //TODO: separar los campos
                dirProvincia: formData.provincia.id,
                dirLocalidad: formData.localidad,
                dirCodigoPostal: formData.codPostal,
                fallaStdId: 0,  // falla no definida aun
                tokenLink: casoActual.tokenLink,  // lo tiene que mandar para que no lo calcule de nuevo
                items: items,
            });            
        return body;
    }
}