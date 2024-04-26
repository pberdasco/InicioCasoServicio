import PropTypes from 'prop-types';
import Chip from "@mui/material/Chip";


export function StdBlockChip({chip}){
    return(
        <Chip label={chip} size="small" color="primary" />
    )
}

StdBlockChip.propTypes = {
    chip: PropTypes.string.isRequired
}