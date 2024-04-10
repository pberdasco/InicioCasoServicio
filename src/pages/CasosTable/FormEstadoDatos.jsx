// De React y React-hook-form
import { useForm } from "react-hook-form";
import { useFormConfig } from "../Complements/useFormConfig";

// de MaterialUI puro
import { Container, Box, Divider } from "@mui/material";

// de stdComponents
import { StdTextInput } from "../../stdComponents/StdTextInput";
import { StdSubmitButton} from "../../stdComponents/StdSubmitButton";
import { StdBlock } from "../../stdComponents/StdBlock";


// eslint-disable-next-line react/prop-types
export const FormEstadoDatos = ({onSave}) => {
    const {formWidth, requiredMsg} = useFormConfig();

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm(); 
    
    const onSubmit = async (data) => {
        onSave(data);
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
                        <h1>Faltantes</h1>
                    </Box>
                    <Box paddingX="8px">
                        <StdBlock formWidth={formWidth}>
                            <StdTextInput label="Mensaje" name="msg" control={control} errors={errors} 
                                            size="x" helperText="Mensaje de faltantes al cliente" />
                            <StdTextInput label="Campos" name="campos" control={control} errors={errors} 
                                            size="x" validationRules={{required: requiredMsg}} />
                        </StdBlock>
                        <Divider textAlign="left" variant="middle" style={{ margin: "10px 0" }}>Acciones</Divider>          
                        <StdSubmitButton label="Enviar" size="s"/>
                    </Box>
                </form>
            </Box>
        </Container>
    );
};





