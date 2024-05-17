import PropTypes from 'prop-types';

// De React y React-hook-form
import { useState } from "react";
import { useForm } from "react-hook-form";

// import { useGeneralContext } from "../Context/GeneralContextHook";
import { useFormConfig } from "../Complements/useFormConfig";
import { Provincia } from '../../apiAccess/provinciaApi';

// TODO: reemplazar por array llenados desde la BD
import { derechos } from './derechos';
import { clientesERP } from './clientesERP';
import { horarios } from './horarios';

// de MaterialUI puro
import { Container, Box, Divider } from "@mui/material";

// de stdComponents
import { StdTextInput } from "../../stdComponents/StdTextInput";
import { StdAutoComplete } from "../../stdComponents/StdAutoComplete";
import { StdBlock } from "../../stdComponents/StdBlock";
import { StdBlockChip } from "../../stdComponents/stdBlockChip";
import { StdSnackAlert } from "../../stdComponents/StdSnackAlert";
import { useEffect } from 'react';
import { StdCancelSubmitBtns } from '../../stdComponents/StdCancelSubmitBtns';

// Herramienta desarrollo / test
// import { DevTool } from "@hookform/devtools"

/**
 * Carga los valores de la fila de registro en los campos del formulario
 * @param {object} row 
 * @param {function} setValue 
 */
const loadDefaults = (row, setValue) => {
    let organizacionRecord = row?.idClienteERP ? {idClienteERP: row?.idClienteERP,empresa: row?.empresa} : undefined;
    let derechosRecord = row?.derechos ? {derechos: row?.derechos, rol: row?.rol} : undefined; 
    let provinciaRecord = row?.dirProvincia ? {id: row?.dirProvincia, name: row?.provincia} : undefined; 
    let horarioRecord = row?.horario ? {id: row?.horario, horario: row.rangoHorario} : undefined;  
    console.log("row ", row)
    setValue("organizacion", organizacionRecord);
    setValue("derechos", derechosRecord);
    setValue("nombre", row?.nombre || "");
    setValue("mail", row?.mail || "");
    setValue("password", row?.password || ""); 
    setValue("calle", row?.dirCalle || "");
    setValue("localidad", row?.dirLocalidad || ""); 
    setValue("provincia", provinciaRecord);
    setValue("codPostal", row?.dirCodigoPostal || "");
    setValue("rangoHorario", horarioRecord);
}

// Formulario de usuarios recibe el row de la grilla desde donde se lo llama con Create o Edit
export const UsuariosForm = ({onSave, onClose, updatedInfo, alert, alertSet}) => {
    const {row, actionType} = updatedInfo

    const {formWidth, requiredMsg} = useFormConfig();
    const [provincias, setProvincias] = useState([]);    // array picklist de provincias

    const {
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors },
    } = useForm(); 

    //* Cargar valores por defecto
    useEffect(() => {
        async function fetchData() {
            const provinciasData = await Provincia.GetAll();
            setProvincias(provinciasData);
            loadDefaults(row, setValue);
        }
        fetchData();
    }, [row, setValue])

    const onSubmit = async (formData) => {
        onSave(formData, actionType);
    }

    const derechosValue = watch("derechos") || {derechos: "0000"};

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
                        <h1>Datos del Usuario</h1>
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
                        {derechosValue?.derechos === "0010" && 
                        <StdBlock formWidth={formWidth} title={<StdBlockChip chip="Direccion de Entrega Default" />}>
                            <StdTextInput label="Calle" name="calle" control={control} errors={errors} helperText='Ingrese calle y nro de recepción/entrega' validationRules={{required: requiredMsg}} />
                            <StdTextInput label="Localidad" name="localidad" control={control} errors={errors}  validationRules={{required: requiredMsg}} />
                            <StdAutoComplete label="Provincia" name="provincia" control={control} optionsArray={provincias} optionLabel="name" validationRules={{required: requiredMsg}} errors={errors}/>
                            <StdTextInput label="Codigo Postal" name="codPostal" control={control} errors={errors}  validationRules={{required: requiredMsg}} />
                            <StdAutoComplete label="Rango Horario" name="rangoHorario" control={control} optionsArray={horarios} optionLabel="horario" validationRules={{required: requiredMsg}} errors={errors}/>
                        </StdBlock>}
                        <Divider textAlign="left" variant="middle" style={{ margin: "10px 0" }}>Acciones</Divider>  
                        <StdCancelSubmitBtns submitLabel='Guardar Usuario' cancelLabel='Cancelar' onCancel={() => onClose()} size="s" />
                    </Box>
                </form>
                {alert?.error && ( <StdSnackAlert  open={true} 
                                            close= {() => alertSet({})}
                                            text= {"Se ha producido un Error!  " + alert.message}
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


