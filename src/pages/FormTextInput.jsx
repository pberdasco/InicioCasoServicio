// De React y React-hook-form
import { useState } from "react";
import { useForm } from "react-hook-form";

// de MaterialUI puro
import { Container, Box, Divider, Chip } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import dayjs from 'dayjs';

// de stdComponents
import { StdTextInput } from "../stdComponents/StdTextInput";
import { StdAutoComplete } from "../stdComponents/StdAutoComplete";
import { StdDatePicker } from "../stdComponents/StdDatePicker";
import { StdSnackAlert } from "../stdComponents/StdSnackAlert";
import { StdSubmitButton } from "../stdComponents/StdSubmitButton"; 
import { StdBlock } from "../stdComponents/StdBlock";
import { StdTextShow } from "../stdComponents/StdTextShow";

// Rellenos de campos
import { DondeSerie } from "./Complements/DondeSerie";
import { provincias } from "./picklists/Provincias";
import { productos } from "./picklists/Productos";

// Herramienta desarrollo / test
import { DevTool } from "@hookform/devtools"


export const FormTextInput = () => {

    const {
        handleSubmit,
        // watch,
        control,
        // register,
        setValue,
        formState: { errors },
    } = useForm({defaultValues:{fInicio: dayjs().format('D/M/YYYY')}}); 


    const theme = useTheme();
    const formWidth = useMediaQuery(theme.breakpoints.down('md')) ? '99%' : '90%';
    const requiredMsg = "Campo Requerido";

    const [submit, setSubmit] = useState(false);
    const [submitData, setSubmitData] = useState("")
    const onSubmit = (data) => {
            setSubmitData(JSON.stringify(data))
            setSubmit(true);
            console.log(JSON.stringify(data));
    };

    // Asignación de valor fuera del useForm
    setValue("mail", "mi.mail@gmail.com");
    setValue("nombre", "Mi Nombre y Apellido");

    return (
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
                        <h1>Usos del &lt;StdTextInput&gt;</h1>
                    </Box>
                    <Box paddingX="8px">
                        <StdBlock formWidth={formWidth} title={<Chip label="Contacto" size="small" color="primary" />}>
                            <StdTextInput label="Fecha Inicio" name="fInicio" control={control} errors={errors} size='s' helperText="size='s' | disabled | defaultValue en el useForm" disabled/>
                            <StdTextInput label="e-Mail" name="mail" control={control} errors={errors} helperText="size='m' (default) | disabled | tooltip | variant='filled'" 
                                            toolTip="No podrá ingresar un texto porque el control esta 'disabled'"
                                            validationRules={{ required: requiredMsg, pattern: {value: /^[\w.-]+@[\w.-]+\.\w+$/, 
                                            message: "La dirección de correo electrónico no es válida"} }} disabled variant="filled"/>
                            <StdTextInput label="Nombre y Apellido" name="nombre" control={control} errors={errors} validationRules={{required: requiredMsg}} />
                            <StdTextInput label="Teléfono" name="telefono" control={control} errors={errors} helperText="validationRules: required & +nn (nnn) nnnn-nnnn" 
                                            toolTip="Ingrese (nnn) nnnn-nnnn" validationRules={{ required: requiredMsg, pattern: {value: /^(?:\+\d{1,3}\s?)?(?:[()\s-]*\d){7,}$/,
                                            message: "El teléfono no es válido. Ingrese +nn (nnn) nnnn-nnnn"} }}/>
                            <StdTextInput label="DNI" name="dni" control={control} errors={errors} color="secondary" variant="outlined" 
                                          helperText="color='secondary' | type='number' | variant='outlined'" type="number" validationRules={{required: requiredMsg}} />
                            <StdTextShow size="m">Para ver las diferencias de los tamaños de los campos achicar la pantalla para verla como monitor grande, 
                                                  monitor std, tablet y celular</StdTextShow>
                            <StdTextShow>Este bloque de Contacto muestra el uso de atributos size, disables, tooltip, variant, color, type. Muestra también el 
                                         compoente StdTextShow  en estos mensajes </StdTextShow>
                            <StdTextShow>Notar en este StdBlock el uso de un chip como titulo</StdTextShow>
                        </StdBlock>
                        <StdBlock formWidth={formWidth} title="Dirección">
                            <StdTextInput label="Calle y número" name="calle" control={control} errors={errors} toolTip="Ingrese el domicilio de entrega" 
                                            helperText="Notar que este campo es el que toma foco al cargarse el form" validationRules={{required: requiredMsg}} size="l" focus/>    
                            <StdAutoComplete label="Provincia" name="provincia" control={control} optionsArray={provincias} optionLabel="name" valueProp="id" 
                                             validationRules={{required: requiredMsg}} errors={errors} />
                            <StdTextInput label="Localidad" name="localidad" control={control} errors={errors} validationRules={{required: requiredMsg}}/>
                            <StdTextInput label="Codigo Postal" name="codPostal" control={control} errors={errors} validationRules={{required: requiredMsg}}/>           
                        </StdBlock>
                        <StdBlock formWidth={formWidth} title="Producto">
                            
                            <StdAutoComplete label="Producto" name="producto" control={control} optionsArray={productos} optionLabel="name" 
                                         valueProp="id" validationRules={{required: requiredMsg}} errors={errors} />
                            <StdTextInput label="Nro de Serie" name="serie" control={control} errors={errors} toolTip={<DondeSerie/>}/>   {/* TODO: obligar segun producto */}

                            <StdDatePicker label="Fecha factura compra" name="fechaFacturaCompra" control={control} validationRules={{required: requiredMsg}} pickerMaxDate={dayjs()} errors={errors} />
                            <StdTextInput label="Descripción de la Falla" name="falla" control={control} validationRules={{required: requiredMsg}} errors={errors} size='l' toolTip="Indicar de la forma mas detallada posible"/>
                        </StdBlock>
                        <Divider textAlign="left" variant="middle" style={{ margin: "10px 0" }}>Acciones</Divider>          
                        <StdSubmitButton label="Enviar" size="s"/>
                    </Box>
                </form>
                {submit && ( <StdSnackAlert  open={submit} 
                                            close= {() => setSubmit(false)}
                                            text= {submitData}
                                            severity="success"/>)}

                <DevTool control={control} />
            </Box>
        </Container>
    );
};





