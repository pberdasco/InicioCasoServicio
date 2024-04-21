import PropTypes from 'prop-types';

//* De React y React-hook-form
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from 'react-router-dom';
import { useFormConfig } from "./Complements/useFormConfig";

//* de MaterialUI puro y dayjs
import { Container, Box, Grid, Divider, ButtonBase } from "@mui/material";
import dayjs from 'dayjs';

//* de stdComponents
import { StdTextInput } from "../stdComponents/StdTextInput";
import { StdAutoComplete } from "../stdComponents/StdAutoComplete";
import { StdDatePicker } from "../stdComponents/StdDatePicker";
import { StdLoadFile } from "../stdComponents/StdLoadFile"; 
import { StdSnackAlert } from "../stdComponents/StdSnackAlert";
import { StdSubmitButton } from "../stdComponents/StdSubmitButton"; 
import { StdBlock } from "../stdComponents/StdBlock";
import { DondeSerie } from "./Complements/DondeSerie";
import { FormAgradecimiento } from "./FormAgradecimiento";
import { FormError} from "./FormError";

//* de Apis y Utils
import { AI } from '../apiAccess/aiApi';
import { Caso } from "../apiAccess/casoApi";
import { Producto } from "../apiAccess/productoApi";
import { Provincia } from "../apiAccess/provinciaApi";
import { loadDefaults } from './Complements/loadDefaultsGarantia';


import completar from "../assets/Completar.png";
import secuencia from "../assets/Secuencia.png";

export const FormGarantia = () => {
    const {formWidth, requiredMsg, formatDate} = useFormConfig();
    const {token} = useParams();

    const [submit, setSubmit] = useState(0);             // 0=no submit, 1=submit ok, -1=submit error
    const [submitData, setSubmitData] = useState("")
    const [success, setSuccess] = useState(false);
    const [casoActual, setCasoActual] = useState({});    // registro del caso actual (lo que trae un get de la api + modo)
    const [productos, setProductos] = useState([]);      // array picklist de productos
    const [provincias, setProvincias] = useState([]);    // array picklist de provincias
    const [errorMsg, setErrorMsg] = useState("");        // Indica si estoy en una situacion de error para desplegar pantalla de error
    const [validacionFactura, setValidacionFactura] = useState({})

    // Funcion para validar facturas. 
    // Aporta la respuesta a StdLoadFile y 
    // setea el estado validacionFactura para que mas tarde se pueda grabar
    const validateFile = async (serverFileName, fileName) => {
        const respuesta = AI.checkFactura(serverFileName, fileName);
        respuesta.serverFileName = serverFileName;
        setValidacionFactura(respuesta);
        return respuesta
    } 

    //* Carga de defaults y picklists + casoActual
    useEffect(() => {
        async function fetchData() {
            try {
                const productosData = await Producto.GetAll();
                setProductos(productosData);
                const provinciasData = await Provincia.GetAll();
                setProvincias(provinciasData);
                // Obtener los datos del caso y setear: Los campos del fomulario y setCasoActual
                // status sera un string "Ok" o "Error ..."
                const status = await loadDefaults(token, setValue, setCasoActual, formatDate);
                if (status != "Ok") setErrorMsg(status);
            } catch (error) {
                console.error("Error al obtener el caso:", error);
                setErrorMsg("Error al obtener el caso");
            }
        }
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    //* React-hook-form: elementos a utilizar del useForm
    const {
        handleSubmit,
        control,
        register,
        setValue,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm();

    //* Grabación y envio de mail al completar el form
    const onSubmit = async (data) => {
        const casoGrabado = await Caso.Update(data, casoActual, setCasoActual, validacionFactura); //TODO: falta en casoGrabado grabar validacionFactura
        if (casoGrabado.status){
            setSubmitData(`No se pudo enviar el caso. ${casoGrabado.message}. Intentelo nuevamente o contacte a Servicio técnico`);
            setSubmit(-1);
        }else{
            setSubmitData(`Caso ${data.nroCaso} enviado con exito`);
            setSubmit(1);
            // TODO: enviar mail
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
                    <Box> <h1>Formulario de Reclamo de Garantías</h1> </Box>
                    <Box paddingX="8px">                   
                        <IdBlock control={control} errors={errors}/>  
                        {(casoActual.modo === "Consulta" || casoActual.modo === "Actualiza")
                             && (<InfoBlock formWidth={formWidth} casoActual={casoActual}/>)} 
                        <ContactBlock control={control} errors={errors} requiredMsg={requiredMsg} formWidth={formWidth} consulta={casoActual.modo == "Consulta"}/>
                        <AddressBlock control={control} errors={errors} requiredMsg={requiredMsg} formWidth={formWidth} provincias={provincias} consulta={casoActual.modo == "Consulta"}/>
                        <ProductBlock control={control} errors={errors} setError={setError} clearErrors={clearErrors} register={register} setValue={setValue} requiredMsg={requiredMsg} 
                                      formWidth={formWidth} productos={productos} casoActual={casoActual} validateFile={validateFile} consulta={casoActual.modo == "Consulta"}/>

                        <Divider textAlign="left" variant="middle" style={{ margin: "10px 0" }}>Acciones</Divider>           
                        {casoActual.modo !== "Consulta" && (<StdSubmitButton label="Enviar" size="s"/>)}
                        {casoActual.modo === "Consulta" && (<StdSubmitButton label="Salir" size="s"/>)}
                    </Box>
                </form>

                <AlertBlock submit={submit} setSubmit={setSubmit} submitData={submitData} setSuccess={setSuccess}/> 

                {/* <DevTool control={control} /> */}
            </Box>
        </Container>
        )) 
    );
};

const IdBlock = ({control, errors}) => {
    return (
        <Grid container spacing={3}>
            <StdTextInput label="Nro Caso" name="nroCaso" control={control} errors={errors} size='s' readOnly/>
            <StdTextInput label="Fecha de Creación del Caso" name="fInicio" control={control} errors={errors} size='s' readOnly/>
        </Grid>
    )
}

const InfoBlock = ({formWidth, casoActual}) => {
    return (
        <StdBlock formWidth={formWidth} title="Seguimiento del Caso">
            <Grid item xs={1} >
                <ButtonBase sx={{ width: 128, height: 128 }}>
                    {casoActual.modo === "Consulta" && <img alt="imagen" src={secuencia} style={{ width: "64px", height: "64px" }}/>}
                    {casoActual.modo === "Actualiza" &&  <img alt="imagen" src={completar} style={{ width: "64px", height: "64px" }}/>}
                </ButtonBase>
            </Grid>
            <Grid item xs={11}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100px' }}>
                    <div style={{ textAlign: 'center', padding: '20px'}}>
                        {(casoActual.statusDatosID == 3) ? // Datos Faltantes
                            <div style={{ color: 'red' }}>Oops! Faltan datos o hay datos incorrectos</div> :
                            (casoActual.statusDatosID == 2) ?  // En revisión
                                <div style={{ color: 'blue' }}>Estamos revisando la información que ha registrado. Le informaremos por mail cuando hayamos completado la revisión. En todo momento puede ingresar en el mismo link para conocer el avance del caso</div> :
                                <div style={{ color: 'green' }}>{`Los datos ingresados estaban completos y correctos. Hemos comenzado a procesar el caso el dia ${casoActual.fechaInicio}`}</div>
                        }
                        <div>{casoActual.mensaje}</div>
                        
                    </div>
                </div>        
            </Grid>
        </StdBlock>
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

const ProductBlock = ({control, errors, register, setValue, clearErrors, requiredMsg, formWidth, productos, consulta, casoActual, validateFile}) => {
    const [ubicacionSerie, setUbicacionSerie] = useState("");

    const storageFact = {
        setFunc: setValue,
        field: "hiddenFotoFactura"
    }

    const storageProd = {
        setFunc: setValue,
        field: "hiddenFotoProducto"
    }

    //TODO: ajustar esta funcion con la informacion correcta de las imagenes de ubicacion de nro de serie
    //Eventualmente en la tabla de tipos podria ponerse el nombre del archivo
    function ubicacionSerieSegunProducto(values){
        if (values.tipoId == 1 || values.tipoId == 2)  // audifonos y microcomponentes
            setUbicacionSerie("A");
        else if (values.tipoId == 3 || values.tipoId == 4)  // aspiradoras y ...
            setUbicacionSerie("B");
        else                                            // otros
            setUbicacionSerie("C");
    } 
    
    // Setear los valores para los defaultFile de los StdLoadFile (no estan en campos => los toma de casoActual)
    const fotoProducto = (casoActual.items && casoActual.items[0].fotoDestruccionLink !== null) ? casoActual.items[0].fotoDestruccionLink : "";
    const fotoFactura = (casoActual.items && casoActual.items[0].fotoFactura !== null) ? casoActual.items[0].fotoFactura : "";

    return (
        <StdBlock formWidth={formWidth} title="Producto">         
            <StdAutoComplete label="Producto" name="producto" control={control} optionsArray={productos} optionLabel="tipo" optionLabel2="name"
                             validationRules={{required: requiredMsg}} errors={errors} readOnly={consulta} aditionalOnChange={ubicacionSerieSegunProducto}/>
            <StdTextInput label="Nro de Serie" name="serie" control={control} errors={errors} toolTip={<DondeSerie ubicacionSerie={ubicacionSerie}/>} readOnly={consulta}/>   {/* TODO: obligar segun producto */}
            
            <StdLoadFile label="Imagen de Factura" name="fotoFactura" control={control} errors={errors} storage={storageFact} required={requiredMsg} validateAfterFn={validateFile} clearErrors={clearErrors}
                        readOnly={consulta} defaultFile={fotoFactura} helperText='Archivos .png .jpeg .pdf o foto' allowedTypes={[".jpeg", ".png", ".pdf"]}/>
            <input type="hidden" {...register('hiddenFotoFactura')} />
            
            <StdLoadFile label="Imagen del Producto" name="fotoProducto" control={control} errors={errors} storage={storageProd} required={requiredMsg} clearErrors={clearErrors}
                         readOnly={consulta} defaultFile={fotoProducto} helperText='Archivos .png .jpeg o tomar foto' allowedTypes={[".jpeg", ".png"]}/>
            <input type="hidden" {...register('hiddenFotoProducto')} />

            <StdDatePicker label="Fecha factura de compra" name="fechaFacturaCompra" control={control} validationRules={{required: requiredMsg}} pickerMaxDate={dayjs()} errors={errors} readOnly={consulta}/>
            <StdTextInput label="Número factura de compra" name="nroFacturaCompra" control={control} validationRules={{required: requiredMsg}} errors={errors}  helperText="Ingresar en formato FC 0000-00000000" readOnly={consulta}/>
            <StdTextInput label="Descripción de la Falla" name="falla" control={control} validationRules={{required: requiredMsg}} errors={errors} size='l' toolTip="Indicar de la forma mas detallada posible" readOnly={consulta}/>
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


IdBlock.propTypes = {
    control: PropTypes.object.isRequired,          // control de react-hook-form 
    errors: PropTypes.object.isRequired,           // errors de react-hook-form 
} 
InfoBlock.propTypes = {
    formWidth: PropTypes.string.isRequired,        // para determinar el ancho de la pantalla  
    casoActual: PropTypes.object,
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
    control: PropTypes.object.isRequired,          // control de react-hook-form 
    errors: PropTypes.object.isRequired,           // errors de react-hook-form 
    setError: PropTypes.func.isRequired,           // setErrors de react-hook-form (para que lo reciba StdLoadFile)
    clearErrors: PropTypes.func.isRequired,
    requiredMsg: PropTypes.string.isRequired,      // mensaje de error estandar para datos obligatorios / requeridos
    formWidth: PropTypes.string.isRequired,        // para determinar el ancho de la pantalla 
    productos: PropTypes.array.isRequired,
    register: PropTypes.func.isRequired,          // register de react-hook-form
    setValue: PropTypes.func.isRequired,          // setValue de react-hook-form
    consulta: PropTypes.bool,
    casoActual: PropTypes.object,
    validateFile: PropTypes.func
}
AlertBlock.propTypes = {
    submit: PropTypes.number.isRequired,           
    setSubmit: PropTypes.func.isRequired,          
    submitData: PropTypes.string.isRequired,
    setSuccess: PropTypes.func.isRequired 
}  