/* eslint-disable react/prop-types */
import { Box, Grid } from "@mui/material";

export const CasoDetailTable = ({row}) => {
    return (
      <Box paddingX="8px" component="section" id="CasosDetailGrid" justifyContent="center" alignItems="center" >        
        <Grid item xs={12}>
          {!row.original.fechaCarga ? 
            ( <div>No se registraron productos aún</div>
            ) : (
              row.original.items.map((x) => (
                <div key={x.id}>{x.producto.tipo} {x.producto.nombre}</div>
              ))
            )}
        </Grid>
      </Box>
    )
  }