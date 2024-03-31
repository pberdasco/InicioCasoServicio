// TODO: Puntos a arreglar:
// No funcionan defaultValue ni readOnly


import PropTypes from 'prop-types';
import { Controller } from "react-hook-form";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";

import { setSize } from "./fieldSize";

export function StdTextInput({label, name, control,
                                validationRules = {}, errors, errorText = " ",   // Manejo de errores
                                defaultValue, helperText = " ", toolTip = "",    // Default y ayudas
                                size = "m", fullWidth = true,                    // Tamaño
                                autoComplete = "on", variant = "standard",       // Standars
                                disabled = false, readOnly = false, focus = false, type="text", color="primary"})               
                                                                                
{
    let inputSize = setSize(size);
    return(
        <Grid item {...inputSize}>
            <Controller 
                render={ ({field, fieldState: {error}}) => (  
                    <Tooltip title={toolTip} followCursor placement="top"> 
                        <TextField
                            {...field} //onChange, onBlur, value, name, ref
                            // {...fieldState}  //invalid, isTouched, isDirty, error
                            id={`TF-${name}`}
                            label={label}
                            error={!!error}
                            helperText={errors[name] ? errors[name]?.message || errorText : helperText}
                            fullWidth={fullWidth}
                            size="small" 
                            autoComplete={autoComplete}
                            variant={variant}   
                            // inputProps={inputProps} eliminado porque hay muy pocas props que aplican
                            color={color}
                            type={type}
                            disabled={disabled}
                            readOnly={readOnly}   //TODO: revisar porque no lo toma
                            autoFocus={focus}
                        />
                    </Tooltip>
                )}    
                name={name}
                onChange={([, obj]) => obj}   // onChange={([, obj]) => getOpObj(obj)._id}
                control={control}
                rules={validationRules}
                defaultValue={defaultValue || ""} // TODO: revisar porque no lo toma                     
            />       
        </Grid>
    )
}

StdTextInput.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    control: PropTypes.object.isRequired, 
    validationRules: PropTypes.object, 
    errors: PropTypes.object.isRequired,
    errorText: PropTypes.string, 
    defaultValue: PropTypes.any,
    helperText: PropTypes.string,
    toolTip: PropTypes.node,
    size: PropTypes.oneOf(["s", "m", "l", "x"]),
    fullWidth: PropTypes.bool,
    autoComplete: PropTypes.oneOf(["on","off"]),
    variant: PropTypes.oneOf(["standard", "filled", "outlined"]),
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    focus: PropTypes.bool,
    type: PropTypes.string,
    color: PropTypes.string
}