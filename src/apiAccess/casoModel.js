export class CasoModel {
    // constructor pensado para tomar datos de 
    // las apis de casos y volcarlos en el objeto
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
}