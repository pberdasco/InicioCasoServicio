import { useMaterialReactTable } from 'material-react-table';
import { Box, IconButton, Tooltip} from "@mui/material";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

export const useCasosItemsTableConfig = ({ columns, data, handleOpenModalFotos }) => {
    const table = useMaterialReactTable({
    columns,
    data,

    enableColumnActions: false,
    enablePagination: false,
    enableTopToolbar: false,
    enableBottomToolbar: false,

    enableRowActions: true,
    renderRowActions: ({ row }) => (
      <Box>
        <Tooltip title="Ver fotos">
            <IconButton onClick={() => {
                handleOpenModalFotos(row.original);
            }}>  
            <PhotoCameraIcon />
            </IconButton>
        </Tooltip>
      </Box>
    ),
    displayColumnDefOptions: {
        'mrt-row-actions': {
        header: 'Acciones', 
        },
    },

    initialState: {
        columnPinning: {
            right: ['mrt-row-actions'],
            },
        density: 'compact',
    },

    // Color de cabecera de grilla
    muiTableHeadCellProps: {
        sx: {
        background: theme => theme.palette.secondary.light,
        },
    },
    muiBottomToolbarProps: {
        sx: {
            height: '5px',
        }
    }
    });

    return table;
};