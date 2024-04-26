import PropTypes from 'prop-types';
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';

import { setSize } from "./fieldSize";

export function StdCancelSubmitBtns({submitLabel="Enviar", cancelLabel="Cancelar", onCancel, size="m"}){
let inputSize = setSize(size);
return(
    <Grid container spacing={1} justifyContent="flex-end">
        <Grid item {...inputSize}>
            <Button variant="outlined" color="primary" type="button"  onClick={onCancel} sx={{ width: '100%' }}>
                {cancelLabel}
            </Button>
        </Grid>
        <Grid item {...inputSize}>
            <Button variant="contained" color="primary" type="submit" sx={{ width: '100%' }}>
                {submitLabel}
            </Button>
        </Grid>
    </Grid>
)}

StdCancelSubmitBtns.propTypes = {
    submitLabel: PropTypes.string,
    cancelLabel: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    size: PropTypes.oneOf(["s", "m", "l"]),
}
