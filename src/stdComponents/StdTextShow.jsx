import PropTypes from 'prop-types';
import Grid from "@mui/material/Grid";

import { setSize } from "./fieldSize";

export function StdTextShow({children, size="x"}){
    let inputSize = setSize(size);
    return(
        <Grid item {...inputSize}>
            <div>{children}</div>
        </Grid>
    )
}

StdTextShow.propTypes = {
    children: PropTypes.string.isRequired,
    size: PropTypes.oneOf(["s", "m", "l", "x"])
}

//TODO: agregar color y centrado.