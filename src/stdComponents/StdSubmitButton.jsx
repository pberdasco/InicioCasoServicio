import PropTypes from 'prop-types';
// import { Controller } from "react-hook-form";
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';

import { setSize } from "./fieldSize";

export function StdSubmitButton({label="Enviar", size="m"}){
let inputSize = setSize(size);
return(
    <Grid item {...inputSize}>
        <Button variant="contained" color="primary" type="submit" fullWidth>
            {label}
        </Button>
    </Grid>
)}

StdSubmitButton.propTypes = {
    label: PropTypes.string,
    size: PropTypes.oneOf(["s", "m", "l"]),
}
