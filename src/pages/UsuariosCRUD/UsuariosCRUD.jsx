import { useEffect, useState} from 'react';
import { MaterialReactTable} from 'material-react-table';

// componentes del crud 
import { useColumn } from './stdColumnHook';            // define las columnas de la tabla
import { useTableConfig } from './stdTableConfig';      // define la configuracion de la tabla
import { Auth } from '../../apiAccess/authApi';         // clase para acceso a las api de acceso a la BD
import { Modal } from './stdModal';
import { useModal } from './stdModalHook';              // estados y funciones para el funcionamiento de la modal

// para UI components
import { Container, Box, Grid } from "@mui/material";
import { useFormConfig } from "../Complements/useFormConfig";
import { StdBlock } from "../../stdComponents/StdBlock";
import { StdBlockChip } from '../../stdComponents/stdBlockChip';

export const UsuariosCRUD = () => {
    const {formWidth} = useFormConfig();

    const { isModalOpen, modalClose, modalOnSave, handleRowUpdate, updatedInfo,isInfoUpdated, setIsInfoUpdated } = useModal();

    const columns = useColumn();             // columns ya viene memoizada desde el hook
    const [usuarios, setUsuarios] = useState([]);  // array de entidades

    // Carga del array de entidades. Al montar el componente y cuando se modifica una fila
    useEffect (()=> {
        const fetchData = async () => {
            try {
                if (isInfoUpdated){
                    const data = await Auth.getAll();
                    setUsuarios(() => data );
                    setIsInfoUpdated(false)
                }
            } catch (error) {
                console.error("Error al obtener los casos:", error);
            }
        };
        fetchData();
    },[isInfoUpdated, setIsInfoUpdated])  
    
    const table = useTableConfig({ columns, data: usuarios, handleRowUpdate });

    return (
        <>
            <Container maxWidth={false} component="main" disableGutters>
                <Box paddingX="8px" component="section" id="CRUDGrid" justifyContent="center" alignItems="center" paddingY="8px">          
                    <StdBlock formWidth={formWidth} title={<StdBlockChip chip="Usuarios" />} >
                        <Grid item xs={12}>
                        <MaterialReactTable table={table} />
                        </Grid>
                    </StdBlock>
                </Box>
            </Container>
            <Modal isOpen={isModalOpen} onClose={modalClose} onSave={modalOnSave} updatedInfo={updatedInfo} />
        </>
    )
};