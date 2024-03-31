// De React y React-hook-form
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useGeneralContext } from "../Context/GeneralContextHook";
import { useFormConfig } from "./Complements/useFormConfig";

// de MaterialUI puro y dayjs
import { Container, Box, Divider, Chip } from "@mui/material";
import dayjs from 'dayjs';

// de stdComponents
import { StdTextInput } from "../stdComponents/StdTextInput";
import { StdSnackAlert } from "../stdComponents/StdSnackAlert";
import { StdSubmitButton } from "../stdComponents/StdSubmitButton"; 
import { StdBlock } from "../stdComponents/StdBlock";

// de Apis
import { Caso } from "../apiAccess/casoApi";
import { Mail } from "../apiAccess/mailApi";

// Herramienta desarrollo / test
import { DevTool } from "@hookform/devtools"


export const FormIniciaCaso = () => {
    const {formWidth, requiredMsg, formatDate} = useFormConfig();
    const {loggedUser} = useGeneralContext();

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({defaultValues:{fInicio: formatDate(dayjs())}}); 

    const [submit, setSubmit] = useState(false);
    const [submitData, setSubmitData] = useState("")
    const onSubmit = async (data) => {
        const result = await Caso.Create(data, loggedUser);
        if (result.status){
            setSubmitData(result.message);
        }else{
            setSubmitData(`Caso ${result.idCRM} para ${result.cliente.apellido} creado con éxito`)
            const datosMail = {
                to: result.cliente.mail,
                subject: "Se ha abierto un caso de servicio técnico",
                text: `Estimado ${result.cliente.nombre} ${result.cliente.apellido},
                
                A su soclicitud, hemos iniciado el caso número: ${result.idCRM} para proceder al tratamiento de la garantía de nuestro producto
                
                Le solicitamos, para continuar con el proceso, que complete el formulario de reclamo haciendo click en el siguiente link:
                
                http://localhost:5173/inicio/${result.tokenLink}`,
            }
            Mail.send(datosMail);
        }
        setSubmit(true);
    };

    // Reset del form cuando submit pasa a falso (cierre del snackAlert)
    useEffect(() => {
        if (!submit) {
            reset(); // Restablece el formulario
        }
    }, [submit, reset]);


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
                        <h1>Creación de Caso</h1>
                    </Box>
                    <Box paddingX="8px">
                        <StdBlock formWidth={formWidth} title={<Chip label="Contacto" size="small" color="primary" />}>
                            
                            <StdTextInput label="Fecha Inicio" name="fInicio" control={control} errors={errors} size='s' helperText="Fecha de inicio del caso" disabled/>
                            <StdTextInput label="Nro de Caso" name="casoNro" control={control} errors={errors} size='s' helperText="Ingrese el numero de caso de CRM" type="number"/>
                            <StdTextInput label="Nombre del Cliente" name="nombre" control={control} errors={errors} validationRules={{required: requiredMsg}} />
                            <StdTextInput label="Apellido del Cliente" name="apellido" control={control} errors={errors} validationRules={{required: requiredMsg}} />
                            <StdTextInput label="e-Mail" name="mail" control={control} errors={errors} helperText="Ingrese la dirección de e-mail del Cliente" 
                                            toolTip="Este dato y los siguientes sería ideal capturarlos del CRM basandose en el numero de caso"
                                            validationRules={{ required: requiredMsg, pattern: {value: /^[\w.-]+@[\w.-]+\.\w+$/, 
                                            message: "La dirección de correo electrónico no es válida"} }} />
                        </StdBlock>
                        <Divider textAlign="left" variant="middle" style={{ margin: "10px 0" }}>Acciones</Divider>          
                        <StdSubmitButton label="Crear Caso y enviar link al Cliente" size="s"/>
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





