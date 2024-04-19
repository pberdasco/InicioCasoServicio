import { Caso } from "../../apiAccess/casoApi";
import dayjs from 'dayjs';

/**
 * Carga los valores predeterminados en un formulario y actualiza el estado de casoIDs del caso.
 * @param {string} token - Token de acceso para obtener los datos del caso.
 * @param {function} setValue - Función para establecer los valores en el formulario.
 * @param {function} setCasoIds - Función para actualizar el estado de los IDs del caso.
 * @param {function} formatDate - Función para formatear la fecha.
 */
export const loadDefaults = async (token, setValue, setCasoActual, formatDate) => {
    // Obtener los datos del caso utilizando el token.
    // tener en cuenta que estos formularios:
    // si estoy en modo alta (statusDatos = 0) solo cargo datos básicos ingresados por el contact center
    // si el caso ya fue cargado (statusDatas = 1 (ok), 2 (en revision) o 3 (con faltantes))
    // siempre se asume un solo item (por ser casos Consumidor Final)
    const casoData = await Caso.GetByToken(token);
    if (!casoData.status){
        // Cargar los datos del caso en el formulario
        setValue("nroCaso", casoData.idCRM || 0);
        setValue("fInicio", formatDate(dayjs(casoData.fechaAlta)));
        setValue("mail", casoData.cliente.mail);
        setValue("nombre", casoData.cliente.nombre);
        setValue("apellido", casoData.cliente.apellido);
        let modo;
        if (casoData.statusDatosID === 0) {
            modo = "Alta";
        } else {
            // Bloque contacto -resto-
            setValue("telefono", casoData.cliente.telefono || "");
            setValue("dni", casoData.cliente.documento || "");

            // Bloque dirección
            setValue("calle", casoData.direccion.calle || "");
            setValue("provincia", {id: casoData.direccion.provinciaId, name: casoData.direccion.provincia});   
            setValue("localidad", casoData.direccion.localidad || "");  // si llega null lo rompe...
            setValue("codPostal", casoData.direccion.codigoPostal || "");

            // Bloque producto
            const i = casoData.items[0]
            setValue("producto", {id: i.producto.id, idERP: i.producto.idERP, name: i.producto.nombre, tipo: i.producto.tipo})
            setValue("serie", i.serie);
            // fotoFactura y fotoProducto estaran en el estado casoActual, de alli se pueden pasar a los controles correspondientes

            // TODO: buscar por que no anda cuando fInicio va perfecto
            // const f = formatDate(dayjs(i.fechaFactura))
            // console.log(f, typeof(f));
            // setValue("fechaFacturaCompra", f);
            setValue("nroFacturaCompra", i.nroFactura);
            setValue("falla", i.fallaCliente);
            // serie, fotoFactura, fotoProducto, fechaFacturaCompra, nroFacturaCompra, falla
            // Set modo
            if (casoData.statusDatosID === 3) modo = "Actualiza" 
            else modo = "Consulta";
        }
        //Setea casoActual con el registro recibido del get a la BD + modo
        casoData.modo = modo;
        setCasoActual(casoData);
        return "Ok";
    } else {
        return `Error ${casoData.status} - ${casoData.message}`;
    }


}