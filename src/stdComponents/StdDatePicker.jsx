import PropTypes from 'prop-types';
import Grid from "@mui/material/Grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Tooltip from "@mui/material/Tooltip";
import { Controller } from "react-hook-form";

import { setSize } from "./fieldSize";

function addValidationRules(pickerMinDate, pickerMaxDate, validationRules){
    const rules = {...validationRules}
    if (pickerMinDate) {
        rules.min = {value: pickerMinDate,
                    message: `La fecha debe ser mayor a ${pickerMinDate}`}
    } 
    if (pickerMaxDate) {
        rules.max = {value: pickerMaxDate,
                    message: `La fecha debe ser menor a ${pickerMaxDate}`}
    }
    return rules;
}

export function StdDatePicker({label, name, control,
                                validationRules = {}, errors, pickerMinDate, pickerMaxDate,
                                defaultValue, helperText = " ", toolTip = "", 
                                size = "m", variant = "standard", fullWidth = true,
                              })
{
    let inputSize = setSize(size);
    const rules = addValidationRules(pickerMinDate, pickerMaxDate, validationRules);

    return(
        <Grid item {...inputSize}>
            <Tooltip title={toolTip} placement="top"> 
            <> 
                <Controller 
                    render={ ({field, fieldState: {error}}) => (    
                        <DatePicker
                            {...field}  //onChange, onBlur, value, name, ref
                            id={`DP-${name}`}
                            label={label}
                            error={error}
                            slotProps={{ textField: {
                                variant: variant,  
                                helperText: (errors[name]) ? errors[name]?.message : helperText ,
                                error: !!error,   
                                fullWidth: fullWidth,
                                size: "small" 
                            }}}
                            size="small"    
                            // inputProps={inputProps}
                            minDate={pickerMinDate}  
                            maxDate={pickerMaxDate}
                        />         
                    )}
                    name={name}
                    onChange={([, obj]) => obj}   // onChange={([, obj]) => getOpObj(obj)._id}
                    control={control}
                    rules={rules}
                    defaultValue={defaultValue || null}
                />
            </> 
            </Tooltip>
        </Grid>
    )
}

StdDatePicker.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    control: PropTypes.object.isRequired, 
    validationRules: PropTypes.object, 
    errors: PropTypes.object.isRequired, 
    pickerMinDate: PropTypes.object, 
    pickerMaxDate: PropTypes.object,
    defaultValue: PropTypes.any,
    helperText: PropTypes.string,
    toolTip: PropTypes.node,
    size: PropTypes.oneOf(["s", "m", "l"]),
    fullWidth: PropTypes.bool,
    variant: PropTypes.oneOf(["standard", "filled", "outlined"]),
}