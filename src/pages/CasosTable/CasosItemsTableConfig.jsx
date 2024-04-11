import { useMaterialReactTable } from 'material-react-table';
import { Box, IconButton} from "@mui/material";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

export const useCasosItemsTableConfig = ({ columns, data }) => {
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
        {/* //TODO: cambiar el console info por llamado a funcion que llame a la api de traer fotos y las muestre en una modal */}
        <IconButton onClick={() => console.info('Photos: ', row.original)}>  
          <PhotoCameraIcon />
        </IconButton>
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