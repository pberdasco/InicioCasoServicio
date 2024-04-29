// De React y React-hook-form
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from 'react-router-dom';
import { Auth } from "../apiAccess/authApi";
import { useGeneralContext } from "../Context/GeneralContextHook";
import { useFormConfig } from "./Complements/useFormConfig";

// de MaterialUI puro
import { Container, Box, Divider } from "@mui/material";

// de stdComponents
import { StdTextInput } from "../stdComponents/StdTextInput";
import { StdSnackAlert } from "../stdComponents/StdSnackAlert";
import { StdSubmitButton} from "../stdComponents/StdSubmitButton";
import { StdBlock } from "../stdComponents/StdBlock";

// Herramienta desarrollo / test
import { DevTool } from "@hookform/devtools"

async function tryToLogin(dataLogin) 
{
    try {
        const data = await Auth.Login(dataLogin);
        // Almacena token y datos de usuario en el localstorage
        if (data?.status){
            window.localStorage.removeItem('loggedUser');
        }else{
            window.localStorage.setItem('loggedUser', JSON.stringify(data));
        } 
        return data
      } catch (error) {
            console.error('Error:', error);
            window.localStorage.removeItem('loggedUser');
            return { status: error.name, message: error.message }
      } 
}


export const FormLogin = () => {
    const {formWidth, requiredMsg} = useFormConfig();
    const {setloggedUser} = useGeneralContext()

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm(); 

    // Si vino ruteado por politica de privacidad de algun form se prepara para volver a el
    const location = useLocation();
    const navigate = useNavigate();


    const [submit, setSubmit] = useState(0);  // 0=no submit , 1=submit ok , -1=submit error
    const [submitData, setSubmitData] = useState("")
    
    const onSubmit = async (data) => {
        const logged = await tryToLogin(data);
        
        setSubmitData(logged)
        if (logged?.status){
            setloggedUser(null);
            setSubmit(-1);
            console.log(`<FormLogin> Error de logueo: Status: ${logged.status}  Message: ${logged.message}`)
        }else{
            setloggedUser(logged);
            setSubmit(1);
            console.log('<FormLogin> Login satisfactorio: ', logged.user);
        }      
        navigate(location.state?.from.from || "/"); // Vuelve al form desde el que se redirecciono. (Ver que hacer si no se logea) 
    }

    return (
        <Container maxWidth={false} component="main" disableGutters>
            <Box
                component="section"
                id="FormLogin"
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
                            <StdTextInput label="e-Mail del Usuario" name="mail" control={control} errors={errors} 
                                            size="x" helperText="Ingrese su e-mail para loguearse" 
                                            validationRules={{ required: requiredMsg, pattern: {value: /^[\w.-]+@[\w.-]+\.\w+$/, 
                                            message: "La dirección de correo electrónico no es válida"} }}/>
                            <StdTextInput label="Password" name="password" control={control} errors={errors} type="password" 
                                            size="x" validationRules={{required: requiredMsg}} />
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





