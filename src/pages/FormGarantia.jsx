import PropTypes from 'prop-types';

// De React y React-hook-form
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from 'react-router-dom';
import { useFormConfig } from "./Complements/useFormConfig";

// de MaterialUI puro y dayjs
import { Container, Box, Grid, Divider } from "@mui/material";
import dayjs from 'dayjs';

// de stdComponents
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

// de Apis y Utils
import { Caso } from "../apiAccess/casoApi";
import { Producto } from "../apiAccess/productoApi";
import { Provincia } from "../apiAccess/provinciaApi";
import { loadDefaults } from './Complements/loadDefaultsGarantia';


export const FormGarantia = () => {
    const {formWidth, requiredMsg, formatDate} = useFormConfig();
    const {token} = useParams();

    const [submit, setSubmit] = useState(0); // 0=no submit, 1=submit ok, -1=submit error
    const [submitData, setSubmitData] = useState("")
    const [success, setSuccess] = useState(false);
    const [casoIds, setCasoIds] = useState({id: 0, tokenLink: "", clienteId: 0, statusDatosID: 0, modo: ""});
    const [productos, setProductos] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                const productosData = await Producto.GetAll();
                setProductos(productosData);
                const provinciasData = await Provincia.GetAll();
                setProvincias(provinciasData);
                // Obtener los datos del caso y setear:
                // - Los campos del fomulario
                // - setCasoIds
                const status = await loadDefaults(token, setValue, setCasoIds, formatDate);
                if (status != "Ok") setErrorMsg(status);
            } catch (error) {
                console.error("Error al obtener el caso:", error);
                setErrorMsg("Error al obtener el caso");
            }
        }
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const {
        handleSubmit,
        control,
        register,
        setValue,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        const casoGrabado = await Caso.Update(casoIds, data);
        if (casoGrabado.status){
            setSubmitData(`No se pudo enviar el caso. ${casoGrabado.message}. Intentelo nuevamente o contacte a Servicio técnico`);
            setSubmit(-1);
        }else{
            setSubmitData(`Caso ${data.nroCaso} enviado con exito`);
            setCasoIds({...casoIds, nombre: data.nombre, apellido: data.apellido, producto: data.producto.name})
            setSubmit(1);
            // enviar mail
        }      
    };

    return (
        (errorMsg) ? (
            <FormError errorMsg={errorMsg}/>
        ): (
        (success) ? (
            <FormAgradecimiento name= {`${casoIds.nombre} ${casoIds.apellido}`} product= {casoIds.producto}
                                token= {token}  casoIdCRM= {casoIds.id}/>
        ) : (
            <Container maxWidth={false} component="main" disableGutters>
            <Box component="section" id="FormService" display="flex" justifyContent="center" alignItems="center" paddingY="8px">

                <form onSubmit={handleSubmit(onSubmit)} style={{width: formWidth}}>
                    <Box> <h1>Formulario de Reclamo de Garantías</h1> </Box>
                    <Box paddingX="8px">                   
                        <IdBlock control={control} errors={errors}/>   
                        <ContactBlock control={control} errors={errors} requiredMsg={requiredMsg} formWidth={formWidth}/>
                        <AddressBlock control={control} errors={errors} requiredMsg={requiredMsg} formWidth={formWidth} provincias={provincias}/>
                        <ProductBlock control={control} errors={errors} register={register} setValue={setValue} requiredMsg={requiredMsg} formWidth={formWidth} productos={productos}/>

                        <Divider textAlign="left" variant="middle" style={{ margin: "10px 0" }}>Acciones</Divider>           
                        <StdSubmitButton label="Enviar" size="s"/>
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

const ContactBlock = ({ control, errors, requiredMsg, formWidth}) => {
    return (
        <StdBlock formWidth={formWidth} title="Contacto">
            <StdTextInput label="e-Mail" name="mail" control={control} errors={errors} readOnly/>
            <StdTextInput label="Nombre" name="nombre" control={control} errors={errors} validationRules={{required: requiredMsg}} helperText="Ingrese su nombre"/>
            <StdTextInput label="Apellido" name="apellido" control={control} errors={errors} validationRules={{required: requiredMsg}} helperText="Ingrese su apellido"/>
            <StdTextInput label="Teléfono" name="telefono" control={control} errors={errors} toolTip="Ingrese (nnn) nnnn-nnnn"
                            validationRules={{ required: requiredMsg, pattern: {value: /^(?:\+\d{1,3}\s?)?(?:[()\s-]*\d){7,}$/,
                            message: "El teléfono no es válido. Ingrese (nnn) nnnn-nnnn"} }} focus/>
            <StdTextInput label="DNI" name="dni" control={control} errors={errors} validationRules={{required: requiredMsg}} />
        </StdBlock>
    )
}

const AddressBlock = ({control, errors, requiredMsg, formWidth, provincias}) => {
    return (
        <StdBlock formWidth={formWidth} title="Dirección">
            <StdTextInput label="Calle y número" name="calle" control={control} errors={errors} toolTip="Ingrese el domicilio de entrega" 
                            helperText="Ingresar calle, numero (mas piso y dpto de corresponder)" validationRules={{required: requiredMsg}} size="l"/>    
            <StdAutoComplete label="Provincia" name="provincia" control={control} optionsArray={provincias} optionLabel="name" valueProp="id" validationRules={{required: requiredMsg}} errors={errors} />
            <StdTextInput label="Localidad" name="localidad" control={control} errors={errors} validationRules={{required: requiredMsg}}/>
            <StdTextInput label="Codigo Postal" name="codPostal" control={control} errors={errors} validationRules={{required: requiredMsg}}/>           
        </StdBlock>
    )
}

const ProductBlock = ({control, errors, register, setValue, requiredMsg, formWidth, productos}) => {
    const storageFact = {
        setFunc: setValue,
        field: "hiddenFotoFactura"
    }

    const storageProd = {
        setFunc: setValue,
        field: "hiddenFotoProducto"
    }

    return (
        <StdBlock formWidth={formWidth} title="Producto">         
            <StdAutoComplete label="Producto" name="producto" control={control} optionsArray={productos} optionLabel="name"
                            valueProp="id" validationRules={{required: requiredMsg}} errors={errors} />
            <StdTextInput label="Nro de Serie" name="serie" control={control} errors={errors} toolTip={<DondeSerie/>}/>   {/* TODO: obligar segun producto */}
            
            <StdLoadFile label="Imagen de Factura" name="fotoFactura" control={control} storage={storageFact} />
            <input type="hidden" {...register('hiddenFotoFactura')} />
            
            <StdLoadFile label="Imagen del Producto" name="fotoProducto" control={control} storage={storageProd} />
            <input type="hidden" {...register('hiddenFotoProducto')} />

            <StdDatePicker label="Fecha factura de compra" name="fechaFacturaCompra" control={control} validationRules={{required: requiredMsg}} pickerMaxDate={dayjs()} errors={errors} />
            <StdTextInput label="Número factura de compra" name="nroFacturaCompra" control={control} validationRules={{required: requiredMsg}} errors={errors}  helperText="Ingresar en formato FC 0000-00000000"/>
            <StdTextInput label="Descripción de la Falla" name="falla" control={control} validationRules={{required: requiredMsg}} errors={errors} size='l' toolTip="Indicar de la forma mas detallada posible"/>
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
ContactBlock.propTypes = {
    control: PropTypes.object.isRequired,          // control de react-hook-form 
    errors: PropTypes.object.isRequired,           // errors de react-hook-form 
    requiredMsg: PropTypes.string.isRequired,      // mensaje de error estandar para datos obligatorios / requeridos
    formWidth: PropTypes.string.isRequired         // para determinar el ancho de la pantalla 
} 
AddressBlock.propTypes = {
    control: PropTypes.object.isRequired,          // control de react-hook-form 
    errors: PropTypes.object.isRequired,           // errors de react-hook-form 
    requiredMsg: PropTypes.string.isRequired,      // mensaje de error estandar para datos obligatorios / requeridos
    formWidth: PropTypes.string.isRequired,         // para determinar el ancho de la pantalla 
    provincias: PropTypes.array.isRequired
} 
ProductBlock.propTypes = {
    control: PropTypes.object.isRequired,          // control de react-hook-form 
    errors: PropTypes.object.isRequired,           // errors de react-hook-form 
    requiredMsg: PropTypes.string.isRequired,      // mensaje de error estandar para datos obligatorios / requeridos
    formWidth: PropTypes.string.isRequired,        // para determinar el ancho de la pantalla 
    productos: PropTypes.array.isRequired,
    register: PropTypes.func.isRequired,          // register de react-hook-form
    setValue: PropTypes.func.isRequired,          // setValue de react-hook-form
}
AlertBlock.propTypes = {
    submit: PropTypes.number.isRequired,           
    setSubmit: PropTypes.func.isRequired,          
    submitData: PropTypes.string.isRequired,
    setSuccess: PropTypes.func.isRequired 
}  