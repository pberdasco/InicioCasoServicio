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

// de picklists (TODO: Para reemplazar con cargas desde la base de datos)
import { provincias } from "./picklists/Provincias";
import { productos } from "./picklists/Productos";

// de Apis
import { Caso } from "../apiAccess/casoApi";

// Herramienta desarrollo / test
import { DevTool } from "@hookform/devtools"


export const FormGarantia = () => {
    const {formWidth, requiredMsg, formatDate} = useFormConfig();
    const {token} = useParams();
    

    const [submit, setSubmit] = useState(0); // 0=no submit, 1=submit ok, -1=submit error
    const [submitData, setSubmitData] = useState("")
    const [success, setSuccess] = useState(false);
    const [casoIds, setCasoIds] = useState({id: 0, tokenLink: "", clienteId: 0, statusDatosID: 0});

    useEffect(() => {
        async function fetchData() {
            try {
                const casoData = await Caso.GetByToken(token);
                // Inicializar el formulario aquí después de obtener los datos del caso
                setValue("nroCaso", casoData.idCRM || 0);
                setValue("fInicio", formatDate(dayjs()));
                setValue("mail", casoData.cliente.mail);
                setValue("nombre", casoData.cliente.nombre);
                setValue("apellido", casoData.cliente.apellido);
                setCasoIds({id: casoData.id, clienteId: casoData.cliente.id, tokenLink: token, statusDatosID: casoData.statusDatosID})
            } catch (error) {
                console.error("Error al obtener el caso:", error);
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

    const storageFact = {
        setFunc: setValue,
        field: "hiddenFotoFactura"
    }

    const storageProd = {
        setFunc: setValue,
        field: "hiddenFotoProducto"
    }

    const onSubmit = async (data) => {
            console.log(casoIds);
            const casoGrabado = await Caso.Update(casoIds, data);
            console.log(casoGrabado);
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
        (success) ? (
            <FormAgradecimiento name= {`${casoIds.nombre} ${casoIds.apellido}`} product= {casoIds.producto}
                                token= {token}  casoIdCRM= {casoIds.id}/>
        ) : (
            <Container maxWidth={false} component="main" disableGutters>
            <Box
                component="section"
                id="FormService"
                display="flex"
                justifyContent="center"
                alignItems="center"
                paddingY="8px"
            >
                <form onSubmit={handleSubmit(onSubmit)} style={{width: formWidth}}>
                    <Box>
                        <h1>Formulario de Reclamo de Garantías</h1>
                    </Box>
                    <Box paddingX="8px">
                        <Grid container spacing={3}>
                            <StdTextInput label="Nro Caso" name="nroCaso" control={control} errors={errors} size='s' readOnly/>
                            <StdTextInput label="Fecha Inicio" name="fInicio" control={control} errors={errors} size='s' readOnly/>
                        </Grid>
                        <StdBlock formWidth={formWidth} title="Contacto">
                            <StdTextInput label="e-Mail" name="mail" control={control} errors={errors} toolTip="Ingrese el mail de contacto"
                                            validationRules={{ required: requiredMsg, pattern: {value: /^[\w.-]+@[\w.-]+\.\w+$/, 
                                            message: "La dirección de correo electrónico no es válida"} }}/>
                            <StdTextInput label="Nombre" name="nombre" control={control} errors={errors} validationRules={{required: requiredMsg}} helperText="Ingrese su nombre"/>
                            <StdTextInput label="Apellido" name="apellido" control={control} errors={errors} validationRules={{required: requiredMsg}} helperText="Ingrese su apellido"/>
                            <StdTextInput label="Teléfono" name="telefono" control={control} errors={errors} toolTip="Ingrese (nnn) nnnn-nnnn"
                                            validationRules={{ required: requiredMsg, pattern: {value: /^(?:\+\d{1,3}\s?)?(?:[()\s-]*\d){7,}$/,
                                            message: "El teléfono no es válido. Ingrese (nnn) nnnn-nnnn"} }}/>
                            <StdTextInput label="DNI" name="dni" control={control} errors={errors} validationRules={{required: requiredMsg}} />
                        </StdBlock>
                        <StdBlock formWidth={formWidth} title="Dirección">
                            <StdTextInput label="Calle y número" name="calle" control={control} errors={errors} toolTip="Ingrese el domicilio de entrega" 
                                            helperText="Ingresar calle, numero (mas piso y dpto de corresponder)" validationRules={{required: requiredMsg}} size="l" focus/>    
                            <StdAutoComplete label="Provincia" name="provincia" control={control} optionsArray={provincias} optionLabel="name" valueProp="id" validationRules={{required: requiredMsg}} errors={errors} />
                            <StdTextInput label="Localidad" name="localidad" control={control} errors={errors} validationRules={{required: requiredMsg}}/>
                            <StdTextInput label="Codigo Postal" name="codPostal" control={control} errors={errors} validationRules={{required: requiredMsg}}/>           
                        </StdBlock>
                        <StdBlock formWidth={formWidth} title="Producto">
                            
                            <StdAutoComplete label="Producto" name="producto" control={control} optionsArray={productos} optionLabel="idERP" optionLabel2="name"
                                         valueProp="id" validationRules={{required: requiredMsg}} errors={errors} />
                            <StdTextInput label="Nro de Serie" name="serie" control={control} errors={errors} toolTip={<DondeSerie/>}/>   {/* TODO: obligar segun producto */}
                            <StdLoadFile label="Imagen de Factura" name="fotoFactura" control={control} storage={storageFact} />
                            <input type="hidden" {...register('hiddenFotoFactura')} />
                            
                            <StdLoadFile label="Imagen del Producto" name="fotoProducto" control={control} storage={storageProd} />
                            <input type="hidden" {...register('hiddenFotoProducto')} />

                            <StdDatePicker label="Fecha factura compra" name="fechaFacturaCompra" control={control} validationRules={{required: requiredMsg}} pickerMaxDate={dayjs()} errors={errors} />
                            <StdTextInput label="Descripción de la Falla" name="falla" control={control} validationRules={{required: requiredMsg}} errors={errors} size='l' toolTip="Indicar de la forma mas detallada posible"/>
                        </StdBlock>
                        <Divider textAlign="left" variant="middle" style={{ margin: "10px 0" }}>Acciones</Divider>          
                        <StdSubmitButton label="Enviar" size="s"/>
                    </Box>
                </form>
                {(submit != 0) && ( <StdSnackAlert  open={submit != 0} 
                                            close= {() => {
                                                submit == 1 ? setSuccess(true) : setSuccess(false); 
                                                setSubmit(0);
                                            }}
                                            text= {submitData}
                                            severity={submit === 1 ? "success" : "error"}/>)}

                <DevTool control={control} />
            </Box>
        </Container>
        )
    
    );
};





