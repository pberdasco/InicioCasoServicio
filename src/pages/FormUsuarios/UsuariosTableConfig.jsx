import { useMaterialReactTable } from 'material-react-table';
import { Box, IconButton, Tooltip} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

export const useUsuariosTableConfig = ({ columns, data, setCasosUpdated, datosModalOpen, setStatusUpdateInfo }) => {
    const table = useMaterialReactTable({
    columns,
    data,

    enableRowActions: true,
    renderRowActions: ({ row }) => (
      <Box>
        <Tooltip title="Ver fotos">
            <IconButton onClick={() => {
                console.info('Photos: ', row.original);
                handleOpenModalFotos(row.original, "edit");
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