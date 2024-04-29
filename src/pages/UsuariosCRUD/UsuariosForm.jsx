import PropTypes from 'prop-types';

// De React y React-hook-form
// import { useState } from "react";
import { useForm } from "react-hook-form";

// import { useGeneralContext } from "../Context/GeneralContextHook";
import { useFormConfig } from "../Complements/useFormConfig";
import { derechos } from './derechos';

// de MaterialUI puro
import { Container, Box, Divider } from "@mui/material";

// de stdComponents
import { StdTextInput } from "../../stdComponents/StdTextInput";
import { StdAutoComplete } from "../../stdComponents/StdAutoComplete";
import { StdBlock } from "../../stdComponents/StdBlock";
import { StdSnackAlert } from "../../stdComponents/StdSnackAlert";
import { useEffect } from 'react';
import { StdCancelSubmitBtns } from '../../stdComponents/StdCancelSubmitBtns';

// Herramienta desarrollo / test
// import { DevTool } from "@hookform/devtools"


//TODO: casi que podria ir al context junto con productos
const clientesERP = [{idClienteERP: "PROPIA", empresa: "Empresa de servicio"},
                    {idClienteERP: "GARBA", empresa: "Garbarino"},
                    {idClienteERP: "MUSI", empresa: "Musimundo"}];

// Formulario de usuarios recibe el row de la grilla desde donde se lo llama con Create o Edit
export const UsuariosForm = ({onSave, onClose, updatedInfo, alert, alertSet}) => {
    const {row, actionType} = updatedInfo

    const {formWidth, requiredMsg} = useFormConfig();

    const {
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm(); 

    //* Cargar valores por defecto
    useEffect(() => {
        let organizacionRecord = row ? {idClienteERP: row?.idClienteERP,empresa: row?.empresa} : undefined;
        let derechosRecord = row ? {derechos: row?.derechos, rol: row?.rol} : undefined;    
        
        setValue("organizacion", organizacionRecord);
        setValue("derechos", derechosRecord);
        setValue("nombre", row?.nombre || "");
        setValue("mail", row?.mail || "");
        setValue("password", row?.password || ""); 
    }, [row, row?.derechos, row?.empresa, row?.idClienteERP, row?.mail, row?.nombre, row?.password, row?.rol, setValue])

    const onSubmit = async (formData) => {
        onSave(formData, actionType);
    }

    return (
        <Container maxWidth={false} component="main" disableGutters>
            <Box
                component="section"
                id="Usuarios"
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
                                            validationRules={{required: requiredMsg}} focus />
                            <StdTextInput label="e-Mail del Usuario" name="mail" control={control} errors={errors} 
                                            helperText="Ingrese su e-mail para loguearse" 
                                            validationRules={{ required: requiredMsg, pattern: {value: /^[\w.-]+@[\w.-]+\.\w+$/, 
                                            message: "La dirección de correo electrónico no es válida"} }}/>
                            {/* Sólo pide password en modo alta... podria autogenerarla y mandarla en el mail para que la cambie*/}
                            {actionType === "create" && 
                                <StdTextInput label="Password" name="password" control={control} errors={errors} type="password" validationRules={{required: requiredMsg}} />}
                            <StdAutoComplete label="Organizacion" name="organizacion" control={control} optionsArray={clientesERP} optionLabel="empresa" valueProp="idClienteERP" validationRules={{required: requiredMsg}} errors={errors}/>
                            <StdAutoComplete label="Derechos" name="derechos" control={control} optionsArray={derechos} optionLabel="rol" valueProp="derechos" validationRules={{required: requiredMsg}} errors={errors}/>
                        </StdBlock>
                        <Divider textAlign="left" variant="middle" style={{ margin: "10px 0" }}>Acciones</Divider>  
                        <StdCancelSubmitBtns submitLabel='Guardar Usuario' cancelLabel='Cancelar' onCancel={() => onClose()} size="s" />
                    </Box>
                </form>
                {alert?.error && ( <StdSnackAlert  open={true} 
                                            close= {() => alertSet({})}
                                            text= {alert.message}
                                            severity="error"/>)}
            </Box>
        </Container>
    );
};

UsuariosForm.propTypes = {
    onSave: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    updatedInfo: PropTypes.shape({
        row: PropTypes.object,
        actionType: PropTypes.string,
    }).isRequired,
    alert: PropTypes.object,
    alertSet: PropTypes.func.isRequired,
};


