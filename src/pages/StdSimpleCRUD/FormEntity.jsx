import PropTypes from 'prop-types';

// De React y React-hook-form
import { useState } from "react";
import { useForm } from "react-hook-form";

// import { useGeneralContext } from "../Context/GeneralContextHook";
import { useFormConfig } from "../Complements/useFormConfig";

// de services
import { Auth } from "../../apiAccess/loginApi";

// de MaterialUI puro
import { Container, Box, Divider } from "@mui/material";

// de stdComponents
import { StdTextInput } from "../../stdComponents/StdTextInput";
import { StdSnackAlert } from "../../stdComponents/StdSnackAlert";
import { StdSubmitButton} from "../../stdComponents/StdSubmitButton";
import { StdCancelButton } from "../../stdComponents/StdCancelButton";
import { StdAutoComplete } from "../../stdComponents/StdAutoComplete";
import { StdBlock } from "../../stdComponents/StdBlock";

// Herramienta desarrollo / test
// import { DevTool } from "@hookform/devtools"


//TODO: casi que podria ir al context junto con productos
const clientesERP = [{idClienteERP: "PROPIA", empresa: "Empresa de Servicio"},
                    {idClienteERP: "GARBA", empresa: "Garbarino"},
                    {idClienteERP: "MUSI", empresa: "Musimundo"}];
const derechos = [  {id: "1000", tipo: "Administrador"},
                    {id: "0100", tipo: "Interno"},
                    {id: "0010", tipo: "Cliente Retail"}]

// Formulario de usuarios recibe el row de la grilla desde donde se lo llama con Create o Edit
export const FormEntity = ({onSave, onClose, updatedInfo}) => {
    const {row, actionType} = updatedInfo

    const {formWidth, requiredMsg} = useFormConfig();

    const {
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm(); 

    //* Cargar valores por defecto
    setValue("organizacion", row?.organizacion);
    setValue("derechos", row?.derechos || {id: "0010", tipo: "Cliente Retail"});
    setValue("nombre", row?.nombre || "");
    setValue("mail", row?.mail || "");
    setValue("password", row?.password || ""); 

    //* Meter row en los defaults
    const [submit, setSubmit] = useState(0);  // 0=no submit , 1=submit ok , -1=submit error
    const [submitData, setSubmitData] = useState("")
    const [success, setSuccess] = useState(false);
    
    const onSubmit = async (formData) => {

        if (actionType === "create"){
            const actionResult = await Auth.Register(formData);
            if (actionResult.status){
                setSubmit(-1);
                setSubmitData(`No se pudo crear el usuario. ${actionResult.message}. Intentelo nuevamente o contacte a Servicio técnico`);
            }else{
                setSubmit(1);
                setSubmitData(`Usuario ${formData.user.nombre} enviado con exito`);
            }
        }else{
            const actionResult = await Auth.Update(formData);
            if (actionResult.status){
                setSubmit(-1);
                setSubmitData(`No se pudo modificar el usuario. ${actionResult.message}. Intentelo nuevamente o contacte a Servicio técnico`);
            }else{
                setSubmit(1);
                setSubmitData(`Usuario ${formData.user.nombre} actualizado con exito`);
            }
        }
    }

    return (
        <Container maxWidth={false} component="main" disableGutters>
            <Box
                component="section"
                id="FormEntity"
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
                            <StdAutoComplete label="Derechos" name="derechos" control={control} optionsArray={derechos} optionLabel="tipo" valueProp="id" validationRules={{required: requiredMsg}} errors={errors}/>
                        </StdBlock>
                        <Divider textAlign="left" variant="middle" style={{ margin: "10px 0" }}>Acciones</Divider>  
                        <StdCancelButton label="Cancelar" size="s" onClick={() => setSubmit(0)}/>        
                        <StdSubmitButton label="Guardar Usuario" size="s"/>
                    </Box>
                </form>
                <AlertBlock submit={submit} setSubmit={setSubmit} submitData={submitData} setSuccess={setSuccess}/>

            </Box>
        </Container>
    );
};

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


FormEntity.propTypes = {
    onSave: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    updatedInfo: PropTypes.shape({
        row: PropTypes.object,
        actionType: PropTypes.string,
    }).isRequired,
};
AlertBlock.propTypes = {
    submit: PropTypes.number,
    setSubmit: PropTypes.func,
    submitData: PropTypes.string,
    setSuccess: PropTypes.func
};

