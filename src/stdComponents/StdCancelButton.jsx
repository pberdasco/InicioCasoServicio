import PropTypes from 'prop-types';
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';

import { setSize } from "./fieldSize";

export function StdCancelButton({label="Cancelar", size="m", onClick}){
let inputSize = setSize(size);
return(
    <Grid item {...inputSize}>
        <Button variant="outlined" color="primary" type="button" fullWidth onClick={onClick}>
            {label}
        </Button>
    </Grid>
)}

StdCancelButton.propTypes = {
    label: PropTypes.string,
    size: PropTypes.oneOf(["s", "m", "l"]),
    onClick: PropTypes.func.isRequired,
}
