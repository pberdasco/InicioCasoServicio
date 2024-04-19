// De React y React-hook-form
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useGeneralContext } from "../Context/GeneralContextHook";
import { useFormConfig } from "./Complements/useFormConfig";

// de MaterialUI puro
import { Container, Box, Divider } from "@mui/material";

// de stdComponents
import { StdTextInput } from "../stdComponents/StdTextInput";
import { StdSnackAlert } from "../stdComponents/StdSnackAlert";
import { StdSubmitButton} from "../stdComponents/StdSubmitButton";
import { StdAutoComplete } from "../stdComponents/StdAutoComplete";
import { StdBlock } from "../stdComponents/StdBlock";

// Herramienta desarrollo / test
import { DevTool } from "@hookform/devtools"

//TODO: casi que podria ir al context junto con productos
const clientesERP = [{idClienteERP: "PROPIA", empresa: "Empresa de Servicio"},
                    {idClienteERP: "GARBA", empresa: "Garbarino"},
                    {idClienteERP: "MUSI", empresa: "Musimundo"}];
const derechos = [  {id: "1000", tipo: "Administrador"},
                    {id: "0100", tipo: "Interno"},
                    {id: "0010", tipo: "Cliente Retail"}]

export const FormLogin = (row) => {
    const {formWidth, requiredMsg} = useFormConfig();
    const {setloggedUser} = useGeneralContext()

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm(); 

    //* Meter row en los defaults
    const [submit, setSubmit] = useState(0);  // 0=no submit , 1=submit ok , -1=submit error
    const [submitData, setSubmitData] = useState("")
    
    const onSubmit = async (data) => {
        // deberia ejecutar onSave donde se graba la actualizacion
    }

    return (
        <Container maxWidth={false} component="main" disableGutters>
            <Box
                component="section"
                id="FormUsuarios"
                display="flex"
                justifyContent="center"
                alignItems="center"
                paddingY="8px"
            >
                <form onSubmit={handleSubmit(onSubmit)} style={{width: formWidth}}>
                    <Box>
                        <h1>Login</h1>
                    </Box>
                    <Box paddingX="8px">
                        <StdBlock formWidth={formWidth}>
                            <StdTextInput label="Nombre" name="nombre" control={control} errors={errors} 
                                            validationRules={{required: requiredMsg}} />
                            <StdTextInput label="e-Mail del Usuario" name="mail" control={control} errors={errors} 
                                            helperText="Ingrese su e-mail para loguearse" 
                                            validationRules={{ required: requiredMsg, pattern: {value: /^[\w.-]+@[\w.-]+\.\w+$/, 
                                            message: "La dirección de correo electrónico no es válida"} }}/>
                            <StdTextInput label="Password" name="password" control={control} errors={errors} type="password" 
                                            validationRules={{required: requiredMsg}} />
                            <StdAutoComplete label="Organizacion" name="organizacion" control={control} optionsArray={clientesERP} optionLabel="empresa" valueProp="idClienteERP" validationRules={{required: requiredMsg}} errors={errors}/>
                            <StdAutoComplete label="Derechos" name="derechs" control={control} optionsArray={derechos} optionLabel="tipo" valueProp="id" validationRules={{required: requiredMsg}} errors={errors}/>
                        </StdBlock>
                        <Divider textAlign="left" variant="middle" style={{ margin: "10px 0" }}>Acciones</Divider>          
                        <StdSubmitButton label="Enviar" size="s"/>
                    </Box>
                </form>
                {submit != 0 && ( <StdSnackAlert  open={true} 
                            close= {() => setSubmit(0)}
                            text= {submit === 1 ? `Bienvenido: ${submitData.user.nombre}` : `Error: Credenciales Invalidas`}
                            severity={submit === 1 ? "success" : "error"}/>)}

                <DevTool control={control} />
            </Box>
        </Container>
    );
};





