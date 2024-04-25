import { useMaterialReactTable } from 'material-react-table';
import { Box, IconButton, Tooltip} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

export const useEntityTableConfig = ({ columns, data, handleRowUpdate }) => {
    const table = useMaterialReactTable({
    columns,
    data,

    //Botones de accion
    enableRowActions: true,
    renderRowActions: ({ row }) => (
      <Box>
        <Tooltip title="Edit Row">
            <IconButton onClick={() => {
                console.info('Edit: ', row.original);
                handleRowUpdate(row.original, "update");
            }}>  
                <EditIcon />
            </IconButton>
        </Tooltip>
      </Box>
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