/* eslint-disable react/prop-types */
import { useState } from 'react';
import { MaterialReactTable} from 'material-react-table';

import { useCasosItemsColumn } from './CasosItemsTableColumnHook';
import { useCasosItemsTableConfig } from './CasosItemsTableConfig';

import { Box, Grid } from "@mui/material";
import { ModalFotos } from './ModalFotos';

export const CasosItemsTable = ({row}) => {

    //* Para la modal de fotos
    const [modalFotosOpen, setModalFotosOpen] = useState(false); // true muestra la modal
    const [selectedRow, setSelectedRow] = useState(null);
    const handleOpenModalFotos = (row) => {
        setSelectedRow(row);
        setModalFotosOpen(true)
    }
    const handleCloseModalFotos = () => {
        setModalFotosOpen(false);
        setSelectedRow(null);
    }

    const columns = useCasosItemsColumn();        // columns ya viene memoizada desde el hook
    const table = useCasosItemsTableConfig({ columns, data: row.original.items, handleOpenModalFotos});

    return (
        <>
        {!row.original.fechaCarga ? 
            ( <div>No se registraron productos aún</div>
            ) : (
            <Box paddingX="8px" component="section" id="CasosGrid" justifyContent="center" alignItems="center" paddingY="8px">
                <Grid item xs={12}>
                    <MaterialReactTable table={table} />
                </Grid>
                {selectedRow && (
                    <ModalFotos isOpen={modalFotosOpen} onClose={handleCloseModalFotos} row={selectedRow}/>
                )}
            </Box>
            )
        }
        </>
    )
};