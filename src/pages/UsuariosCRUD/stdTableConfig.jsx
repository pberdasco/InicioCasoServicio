import { useMaterialReactTable } from 'material-react-table';
import { Box, IconButton, Button, Tooltip} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import ControlPointIcon from '@mui/icons-material/ControlPoint';

export const useTableConfig = ({ columns, data, handleRowUpdate }) => {
    const table = useMaterialReactTable({
    columns,
    data,

    //Botones de accion
    enableRowActions: true,
    renderRowActions: ({ row }) => (
      <Box>
        <Tooltip title="Edit Row">
            <IconButton onClick={() => {
                handleRowUpdate(row.original, "update"); //en ModalHook
            }}>  
                <EditIcon />
            </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: () => (  //podria pasar table como parametro si se necesitara
        <Button
          variant="contained"
          onClick={() => {
            handleRowUpdate(null, "create");     //en ModalHook
          }}
        >
          <ControlPointIcon/> Nuevo
        </Button>
      ),

    // Mostrar detalles a la izquierda y Acciones a la derecha
    enableColumnActions: true,
    displayColumnDefOptions: {
        'mrt-row-actions': {
        header: 'Acciones',
        size: 100, 
        },
    },
    initialState: {
        density: 'compact',
        columnPinning: {
        right: ['mrt-row-actions'],
        },
        columnVisibility: { fechaCarga: false },
    },

    // Color de cabecera de grilla
    muiTableHeadCellProps: {
        sx: {
        background: theme => theme.palette.primary.light,
        },
    },
    });

    return table;
};