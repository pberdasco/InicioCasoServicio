import { useMaterialReactTable } from 'material-react-table';

import { CasosItemsTable } from './CasosItemsTable';
// import { CasoDetailTable } from './CasoDetailTable';
// import { setStatusDatos } from "./updateRow.js"

import { RemoveCircleOutline, AddCircleOutline } from "@mui/icons-material";
import { MenuItem } from "@mui/material";

const renderRowActinMenuItems = ({row, datosModalOpen, setStatusUpdateInfo}) => {
    const status  = row.original.statusDatosID;

    const handleStatusChange = (newStatus) => {
        //setea statusUpdateInfo para que luego desde CasosTable (cuando se cierra la modal) se llame a actualizar
        setStatusUpdateInfo({newStatus: newStatus, row: row});
        datosModalOpen();
    };

    return [
        <MenuItem key="aRevision" onClick={() => handleStatusChange(2)} disabled={status === 0 || status === 2}>
            Pasar a: En Revision (2)
        </MenuItem>,
        <MenuItem key="aFaltantes" onClick={() => handleStatusChange(3)} disabled={status === 3}>
            Pasar a: Datos Faltantes (3)
        </MenuItem>,
        <MenuItem key="aOk" onClick={() => handleStatusChange(1)} disabled={status === 1}>
            Pasar a: Datos OK (1)
        </MenuItem>,
        <MenuItem key="aImportado" onClick={() => handleStatusChange(4)} disabled={status === 4}>
            Pasar a: Importado ERP (4)
        </MenuItem>,
        <MenuItem key="aCreado" onClick={() => handleStatusChange(0)} disabled={status === 0}>
            Pasar a: Creado (0)
        </MenuItem>,
    ];
}

export const useCasoTableConfig = ({ columns, data, setCasosUpdated, datosModalOpen, setStatusUpdateInfo }) => {
    const table = useMaterialReactTable({
    columns,
    data,

    // Detalles
    renderDetailPanel: ({ row }) => <CasosItemsTable row={row} />,
    muiExpandButtonProps: ({ row }) => ({
        children: row.getIsExpanded() ? <RemoveCircleOutline /> : <AddCircleOutline />,
    }),

    enableRowActions: true,
    // eslint-disable-next-line no-unused-vars
    renderRowActionMenuItems: ({ row }) => renderRowActinMenuItems({ row, setCasosUpdated, datosModalOpen, setStatusUpdateInfo}),

    // Mostrar detalles a la izquierda y Acciones a la derecha
    enableColumnActions: true,
    displayColumnDefOptions: {
        'mrt-row-actions': {
        header: 'Acciones',
        size: 100, //make actions column wider
        },
    },
    initialState: {
        density: 'compact',
        columnPinning: {
        left: ['mrt-row-expand'],
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