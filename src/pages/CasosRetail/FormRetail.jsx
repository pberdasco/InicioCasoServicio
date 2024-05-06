import PropTypes from 'prop-types';

//# De React y React-hook-form
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useFormConfig } from "../Complements/useFormConfig";

//# de MaterialUI puro y dayjs
import { Container, Box, Grid, Divider } from "@mui/material";
import dayjs from 'dayjs';

//# de stdComponents
import { StdTextInput } from "../../stdComponents/StdTextInput";
import { StdAutoComplete } from "../../stdComponents/StdAutoComplete";
import { StdSnackAlert } from "../../stdComponents/StdSnackAlert";
import { StdSubmitButton } from "../../stdComponents/StdSubmitButton"; 
import { StdBlock } from "../../stdComponents/StdBlock";
import { FormAgradecimiento } from "../FormAgradecimiento";
import { FormError} from "../FormError";

//# de Apis y Utils
import { Caso } from "../../apiAccess/casoApi";
import { Producto } from "../../apiAccess/productoApi";
import { Provincia } from "../../apiAccess/provinciaApi";
import { loadDefaultsRetail } from '../Complements/loadDefaultsRetail';
import { StdTextShow } from '../../stdComponents/StdTextShow';

/**
 * Formulario de casos (alta / modificacion) para Retails
 * @param {Number} casoId - Numero de caso (id de la tabla casos)
 * @returns jsx con el formulario de alta o modificacion de un caso
 */
export const FormRetail = ({casoId}) => {

//***************************************************************
// SOLICITUD REPARACION SMARTLIFE - Visuar Servicio Tecnico
// Solicitante:  *Razon Social, *Contacto, *mail --> Surge del usuario , Telefono ??
// Punto de retiro: *Direccion, *Localidad, *Provincia, *CodPostal, *Contacto, Telefono, Rango Horario
// Para cada producto:
//                  *Producto, Serie, Nro Factura, Fecha Factura, Descripcion Falla
//**************************************************************** 

//? Cuando a este componente se lo llame desde una grilla de casos habra que definir si va sobre modal fullpage o 

//? Recibir por parametro solo el numero de caso, null = create
//? Validar que el caso no este marcado "bloqueado por update" en ese caso setear
//? Marcar el caso "bloqueado por update" y cargarlo (incluye todos los items)
//?         Nota: va completo en memoria, (por ahora no: la posibilidad de cargar en tabla temporal para no perder la carga si hay algun problema...)
//? Render datos de la cabecera
//? Render tabla de items (opciones crear item, modificar item, borrar item)
//? Crear y Modificar item sobre modal (son unos 5 datos)
//?        Crear <Modal/> y <FormItem/>
//?        El Grabar sobre un item se maneja en este form, guardando el cambio en memoria inmutable
//? Cuando no esta en modo edicion de item se presentan botones cancelar y grabar caso
//?        La grabacion de la actualizacion o creacion de un caso: 
//?            - se maneja en este form y se avisa a la grilla de casos que se actualizo o
//?            - se recibe una funcion de grabacion desde la grilla?? (esto parece mas complejo y no se si tiene ventaja)
//? Al grabar: 
//?             - reemplazar datos de cabecera, borrar los datos de items y cargar los nuevos (nunca van a ser tantos como para que sea critico grabar solo lo modificado) 
//?             - desmarcar "bloquead por update"
//? Estudiar: que pasa si el usuario se desconecta y queda bloqueado por update un registro?

    const {formWidth, requiredMsg, formatDate} = useFormConfig();

    const [submit, setSubmit] = useState(0);             // 0=no submit, 1=submit ok, -1=submit error: se setea al intentar grabar. Habilita al AlertBlock
    const [submitData, setSubmitData] = useState("")     // funciona en tandem con submit, lleva el mensaje a mostrar en el alert
    const [success, setSuccess] = useState(false);       // Valor diferido de submit, se setea cuando se cierra el AlertBlok para mostrar pantalla de Agradecimiento
    const [casoActual, setCasoActual] = useState({items: []});    // registro del caso actual (lo que trae un get de la api + modo)
    const [productos, setProductos] = useState([]);      // array picklist de productos
    const [provincias, setProvincias] = useState([]);    // array picklist de provincias
    const [errorMsg, setErrorMsg] = useState("");        // Indica si estoy en una situacion de error para desplegar pantalla de error

     
    //* React-hook-form: elementos a utilizar del useForm
    const {
        handleSubmit,
        control,
        // register,
        setValue,
        // setError,
        // clearErrors,
        // watch,
        formState: { errors },
    } = useForm();

    //* Carga de defaults y picklists + casoActual
    useEffect(() => {
        async function fetchData() {
            try {
                console.log("useEffect triggered");
                const productosData = await Producto.GetAll();
                setProductos(productosData);
                const provinciasData = await Provincia.GetAll();
                setProvincias(provinciasData);
                // Obtener los datos del caso y setear: Los campos del fomulario y setCasoActual
                // status sera un string "Ok" o "Error ..."
                const status = await loadDefaultsRetail(1, setValue, setCasoActual, formatDate);
                if (status != "Ok") setErrorMsg(status);
            } catch (error) {
                console.error("Error al obtener el caso:", error);
                setErrorMsg("Error al obtener el caso");
            }
        }
        fetchData();
    }, [casoId, setValue, formatDate]);

    console.log("FormRetail-casoActual: ", casoActual);
    //* Grabación y envio de mail al completar el form
    const onSubmit = async (formData) => {
        //! const casoGrabado = await Caso.UpdateRetail(formData, itemsData, casoActual, setCasoActual); 
        const casoGrabado = {status: 900, message: "Error Forzado"} 
        if (casoGrabado.status){
            setSubmitData(`No se pudo enviar el caso. ${casoGrabado.message}. Intentelo nuevamente o contacte a Servicio técnico`);
            setSubmit(-1);
        }else{
            setSubmitData(`Caso ${formData.nroCaso} enviado con exito`);
            setSubmit(1);
        }      
    };

    //* Render formulario
    return (
        (errorMsg) ? (
            <FormError errorMsg={errorMsg}/>
        ): (
        (success) ? (
            <FormAgradecimiento name= {`${casoActual.cliente.nombre} ${casoActual.cliente.apellido}`} 
                                product= {`${casoActual.items[0]?.producto.tipo} ${casoActual.items[0]?.producto.nombre}`}
                                token= {casoActual.tokenLink}  casoIdCRM= {casoActual.idCRM}/>
        ) : (
            <Container maxWidth={false} component="main" disableGutters>
            <Box component="section" id="FormService" display="flex" justifyContent="center" alignItems="center" paddingY="8px">

                <form onSubmit={handleSubmit(onSubmit)} style={{width: formWidth}}>
                    <Box> <h1>Formulario Retail</h1> </Box>
                    <Box paddingX="8px">                   
                        <IdBlock control={control} errors={errors}/>  
                        <ContactBlock control={control} errors={errors} requiredMsg={requiredMsg} formWidth={formWidth} consulta={casoActual.modo == "Consulta"}/>
                        <AddressBlock control={control} errors={errors} requiredMsg={requiredMsg} formWidth={formWidth} provincias={provincias} consulta={casoActual.modo == "Consulta"}/>
                        <ProductBlock formWidth={formWidth} items={casoActual.items}/>

                        <Divider textAlign="left" variant="middle" style={{ margin: "10px 0" }}>Acciones</Divider>           
                        {casoActual.modo !== "Consulta" && (<StdSubmitButton label="Enviar" size="s"/>)}
                        {casoActual.modo === "Consulta" && (<StdSubmitButton label="Salir" size="s" onClick={() => {}}/>)}
                    </Box>
                </form>

                <AlertBlock submit={submit} setSubmit={setSubmit} submitData={submitData} setSuccess={setSuccess}/> 

                {/* <DevTool control={control} /> */}
            </Box>
        </Container>
        )) 
    );
};

//# Bloques del formulario
const IdBlock = ({control, errors}) => {
    return (
        <Grid container spacing={3}>
            <StdTextInput label="Nro Caso" name="nroCaso" control={control} errors={errors} size='s' readOnly/>
            <StdTextInput label="Fecha de Creación del Caso" name="fInicio" control={control} errors={errors} size='s' readOnly/>
        </Grid>
    )
}


const ContactBlock = ({ control, errors, requiredMsg, formWidth, consulta}) => {
    return (
        <StdBlock formWidth={formWidth} title="Contacto">
            <StdTextInput label="e-Mail" name="mail" control={control} errors={errors} readOnly/>
            <StdTextInput label="Nombre" name="nombre" control={control} errors={errors} validationRules={{required: requiredMsg}} helperText="Ingrese su nombre" readOnly={consulta}/>
            <StdTextInput label="Apellido" name="apellido" control={control} errors={errors} validationRules={{required: requiredMsg}} helperText="Ingrese su apellido" readOnly={consulta}/>
            <StdTextInput label="Teléfono" name="telefono" control={control} errors={errors} toolTip="Ingrese (nnn) nnnn-nnnn"
                            validationRules={{ required: requiredMsg, pattern: {value: /^(?:\+\d{1,3}\s?)?(?:[()\s-]*\d){7,}$/,
                            message: "El teléfono no es válido. Ingrese (nnn) nnnn-nnnn"} }} focus readOnly={consulta}/>
            <StdTextInput label="DNI" name="dni" control={control} errors={errors} validationRules={{required: requiredMsg}} readOnly={consulta}/>
        </StdBlock>
    )
}

const AddressBlock = ({control, errors, requiredMsg, formWidth, provincias, consulta}) => {
    return (
        <StdBlock formWidth={formWidth} title="Dirección">
            <StdTextInput label="Calle y número" name="calle" control={control} errors={errors} toolTip="Ingrese el domicilio de entrega" 
                            helperText="Ingresar calle, numero (mas piso y dpto de corresponder)" validationRules={{required: requiredMsg}} size="l" readOnly={consulta}/>    
            <StdAutoComplete label="Provincia" name="provincia" control={control} optionsArray={provincias} optionLabel="name" validationRules={{required: requiredMsg}} errors={errors} readOnly={consulta}/>
            <StdTextInput label="Localidad" name="localidad" control={control} errors={errors} validationRules={{required: requiredMsg}} readOnly={consulta}/>
            <StdTextInput label="Codigo Postal" name="codPostal" control={control} errors={errors} validationRules={{required: requiredMsg}} readOnly={consulta}/>           
        </StdBlock>
    )
}

const ProductBlock = ({ formWidth, items }) => {
    return (
        <StdBlock formWidth={formWidth} title="Productos">         
            {items.map((x) => (<div key={x.id}>
                                    <StdTextShow>
                                        {"---"+x.producto?.idERP.toString()}
                                    </StdTextShow>
                                </div>))}
        </StdBlock>
    )
}

const AlertBlock = ({submit, setSubmit, submitData, setSuccess}) => {
    return (
    (submit != 0) && ( 
        <StdSnackAlert  open={submit != 0} 
            close= {() => {
                submit == 1 ? setSuccess(true) : setSuccess(false); 
                setSubmit(0);
            }}
            text= {submitData}
            severity={submit === 1 ? "success" : "error"}/>
    ))
}

//# Proptypes
FormRetail.propTypes = {
    casoId: PropTypes.string,
}
IdBlock.propTypes = {
    control: PropTypes.object.isRequired,          // control de react-hook-form 
    errors: PropTypes.object.isRequired,           // errors de react-hook-form 
} 
ContactBlock.propTypes = {
    control: PropTypes.object.isRequired,          // control de react-hook-form 
    errors: PropTypes.object.isRequired,           // errors de react-hook-form 
    requiredMsg: PropTypes.string.isRequired,      // mensaje de error estandar para datos obligatorios / requeridos
    formWidth: PropTypes.string.isRequired,        // para determinar el ancho de la pantalla 
    consulta: PropTypes.bool
} 
AddressBlock.propTypes = {
    control: PropTypes.object.isRequired,          // control de react-hook-form 
    errors: PropTypes.object.isRequired,           // errors de react-hook-form 
    requiredMsg: PropTypes.string.isRequired,      // mensaje de error estandar para datos obligatorios / requeridos
    formWidth: PropTypes.string.isRequired,         // para determinar el ancho de la pantalla 
    provincias: PropTypes.array.isRequired,
    consulta: PropTypes.bool
} 
ProductBlock.propTypes = {
    formWidth: PropTypes.string.isRequired,        // para determinar el ancho de la pantalla 
    items: PropTypes.array.isRequired,
}
AlertBlock.propTypes = {
    submit: PropTypes.number.isRequired,           
    setSubmit: PropTypes.func.isRequired,          
    submitData: PropTypes.string.isRequired,
    setSuccess: PropTypes.func.isRequired 
}  