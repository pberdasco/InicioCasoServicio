import PropTypes from 'prop-types';

// De React y React-hook-form
// import { useState } from "react";
import { useForm } from "react-hook-form";

// import { useGeneralContext } from "../Context/GeneralContextHook";
import { useFormConfig } from "../Complements/useFormConfig";

// de MaterialUI puro
import { Container, Box, Divider } from "@mui/material";

// de stdComponents
import { StdTextInput } from "../../stdComponents/StdTextInput";
import { StdAutoComplete } from "../../stdComponents/StdAutoComplete";
import { StdBlock } from "../../stdComponents/StdBlock";
import { useEffect } from 'react';
import { StdCancelSubmitBtns } from '../../stdComponents/StdCancelSubmitBtns';

// Herramienta desarrollo / test
// import { DevTool } from "@hookform/devtools"


//TODO: casi que podria ir al context junto con productos
const clientesERP = [{idClienteERP: "PROPIA", empresa: "DigitalTech"},
                    {idClienteERP: "GARBA", empresa: "Garba SA"},
                    {idClienteERP: "MUSI", empresa: "Musimundo"}];
const derechos = [  {id: "1000", tipo: "Admin"},
                    {id: "0100", tipo: "Interno"},
                    {id: "0010", tipo: "Cliente Retail"}]

// Formulario de usuarios recibe el row de la grilla desde donde se lo llama con Create o Edit
export const UsuariosForm = ({onSave, onClose, updatedInfo}) => {
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
        setValue("organizacion", row?.organizacion);
        setValue("derechos", row?.derechos || {id: "0010", tipo: "Cliente Retail"});
        setValue("nombre", row?.nombre || "");
        setValue("mail", row?.mail || "");
        setValue("password", row?.password || ""); 
    }, [row?.derechos, row?.mail, row?.nombre, row?.organizacion, row?.password, setValue])

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
                            <StdTextInput label="Password" name="password" control={control} errors={errors} type="password" 
                                            validationRules={{required: requiredMsg}} />
                            <StdAutoComplete label="Organizacion" name="organizacion" control={control} optionsArray={clientesERP} optionLabel="empresa" valueProp="idClienteERP" validationRules={{required: requiredMsg}} errors={errors}/>
                            <StdAutoComplete label="Derechos" name="derechos" control={control} optionsArray={derechos} optionLabel="tipo" valueProp="id" validationRules={{required: requiredMsg}} errors={errors}/>
                        </StdBlock>
                        <Divider textAlign="left" variant="middle" style={{ margin: "10px 0" }}>Acciones</Divider>  
                        <StdCancelSubmitBtns submitLabel='Guardar Usuario' cancelLabel='Cancelar' onCancel={() => onClose()} size="s" />
                    </Box>
                </form>

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
};


