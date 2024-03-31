import PropTypes from 'prop-types';
import { Divider, Paper, Grid } from "@mui/material"


export function StdBlock({children, title="", formWidth="99%"}){
    return(
        <>
        <Divider textAlign="left" style={{ margin: "10px 0", color: "blue" }}>{title}</Divider>
        <Paper sx={{minWidth: formWidth, marginTop: "6px", paddingX: "4px"}} elevation={3}>
            <Grid container spacing={3}> 
                {children}
            </Grid>
        </Paper>
        </>
)}

StdBlock.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.any,
    formWidth: PropTypes.string
}