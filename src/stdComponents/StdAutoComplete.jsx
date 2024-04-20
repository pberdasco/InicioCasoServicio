import PropTypes from 'prop-types';
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import { Controller } from "react-hook-form";

import { setSize } from "./fieldSize";

// En el campo guarda el registro completo del picklist. (ej. si el picklist es [{id,nombre,tipo}] devuelve el registro seleccionado {id,noombre,tipo})
// el valor que toma el campo por defecto es lo que este en el campo del form (el campo debe tener como contenido, también un registro -no solo un id o key-)
export function StdAutoComplete({label, name, control, 
                                optionsArray, optionLabel = null, optionLabel2 = null,
                                isOptionDisabled, validationRules, errors, errorText,
                                helperText, toolTip, size, variant})
{
    let inputSize = setSize(size);

    //TODO: en algun momento ver si se puede hacer que se muestre algo en el picklist (ej cod+nombre+xx) y en el campo se muestre otra cosa (ej solo nombre)

    function getOptionDisabled(option) {
        if (typeof isOptionDisabled === 'function') return isOptionDisabled(option);
        return false;
    }

    function getOptionLabel(option){
        if (!optionLabel && !optionLabel2) {
            return option.label ?? option;
        } else if (optionLabel && !optionLabel2 && option[optionLabel]) {
            return option[optionLabel];
        } else if (optionLabel && optionLabel2) {
            return `${option[optionLabel]} - ${option[optionLabel2]}`;
        } else {
            return option;
        }
    }

    function isOptionEqualToValue(option, value){
        if (!optionLabel) return option.includes(value);
        const valor = (typeof value === 'object') ? value[optionLabel] : value;
        return option[optionLabel].includes(valor);
    }

    return (
        <Grid item {...inputSize}>
            <Tooltip title={toolTip} placement="top">
            <>    
                <Controller 
                    render={ ({field, fieldState: {error}}) => (    
                    <Autocomplete
                        {...field}
                        id={`AC-${name}`}
                        options={optionsArray}
                        onChange={(event, values) => field.onChange(values)}
                        getOptionLabel={getOptionLabel}
                        getOptionDisabled={getOptionDisabled}
                        isOptionEqualToValue={isOptionEqualToValue}
                        autoHighlight
                        autoSelect
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                fullWidth
                                label={label}
                                variant={variant}
                                onChange={field.onChange}
                                error={!!error}
                                helperText={errors[name] ? errors[name]?.message || errorText : helperText}
                            />
                        )}
                    />
                )}
                name={name}
                // onChange={([, optionObj]) =>  optionObj.id} 
                control={control}
                rules={validationRules}
                // defaultValue={defaultValue}
                />    
            </>
            </Tooltip>
        </Grid>
)
}

StdAutoComplete.propTypes = {
    label: PropTypes.string.isRequired,                           // etiqueta del control
    name: PropTypes.string.isRequired,                            // identificador del campo para react-hook-form (tambien forma parte del id=`AC${name}`)
    control: PropTypes.object.isRequired,                         // directamente de useForm
    optionsArray: PropTypes.array.isRequired,                     // array de opciones, puede ser de strings o de objetos (en este caso pasar valueProp y optionLabel)
    optionLabel: PropTypes.string,                                // nombre de la propiedad a mostrar  (//TODO: quizas en el futuro cambiar a funcion para mostrar otras cosas)
    optionLabel2: PropTypes.string,                               // segundo nombre de campo para mostrar campo - campo, por ejemplo "FK9384 - Producto FK9384"
    isOptionDisabled: PropTypes.func,                             // funcion que devuelve false para los elementos a deshabilitar
    validationRules: PropTypes.object.isRequired,                 // reglas de validacion segun react-hook-form {required: "campo requerido", validate: {funcValidacion}}
    errors: PropTypes.object.isRequired,                          // directamente el errors del formState del useForm
    errorText: PropTypes.string,                                  // si se quiere un error generico en lugar de adecuados por las reglas de validacion
    helperText: PropTypes.string,                                 // texto de ayuda que va en la linea de abajo cuando no esta mostrando un error
    toolTip: PropTypes.node,                                      // mensaje de ayuda que se muestra cuando el mouse pasa por arriba del campo
    size: PropTypes.oneOf(["s", "m", "l"]),                       // tamaño del campo: ver: import { setSize } from "./fieldSize";
    variant: PropTypes.oneOf(["standard", "filled", "outlined"])
}

StdAutoComplete.defaultProps = {
    errorText: " ",
    defaultValue: null,
    helperText: " ",
    toolTip: "",
    size: "m",
    variant: "standard",
  };