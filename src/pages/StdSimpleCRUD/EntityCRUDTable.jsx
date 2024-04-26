// ? CRUD modelo de pocos campos con solicitud de Alta y Modificación en una modal sobre la grilla.
// ? Grilla Principal

import { useEffect, useState} from 'react';
import { MaterialReactTable} from 'material-react-table';

// componentes del crud 
import { useEntityColumn } from './EntityColumnHook';            // define las columnas de la tabla
import { useEntityTableConfig } from './EntityTableConfig';      // define la configuracion de la tabla
import { SimpleEntity } from '../../apiAccess/simpleEntityApi';  // clase para acceso a las api de acceso a la BD
import { EntityModal } from './EntityModal';
import { useEntityModal } from './EntityModalHook';              // estados y funciones para el funcionamiento de la modal

// para UI components
import { Container, Box, Grid } from "@mui/material";
import { useFormConfig } from "../Complements/useFormConfig";
import { StdBlock } from "../../stdComponents/StdBlock";

export const EntityCRUDTable = () => {
    const {formWidth} = useFormConfig();

    const { isModalOpen, modalClose, entityModalOnSave, handleRowUpdate, updatedInfo,isEntityUpdated, setIsEntityUpdated } = useEntityModal();

    const columns = useEntityColumn();             // columns ya viene memoizada desde el hook
    const [entities, setEntities] = useState([]);  // array de entidades

    // Carga del array de entidades. Al montar el componente y cuando se modifica una fila
    useEffect (()=> {
        const fetchData = async () => {
            try {
                if (isEntityUpdated){
                    const entitiesData = await SimpleEntity.getAll();
                    setEntities(() => entitiesData );
                    setIsEntityUpdated(false)
                }
            } catch (error) {
                console.error("Error al obtener los casos:", error);
            }
        };
        fetchData();
    },[isEntityUpdated, setIsEntityUpdated])   // isEntityUpdated definida en useEntityContext (true), fuerza a recargar el array cuando cambia
    
    const table = useEntityTableConfig({ columns, data: entities, handleRowUpdate });

    return (
        <>
            <Container maxWidth={false} component="main" disableGutters>
                <Box paddingX="8px" component="section" id="EntityGrid" justifyContent="center" alignItems="center" paddingY="8px">          
                    <StdBlock formWidth={formWidth} title="Entity">
                        <Grid item xs={12}>
                        <MaterialReactTable table={table} />
                        </Grid>
                    </StdBlock>
                </Box>
            </Container>
            <EntityModal isOpen={isModalOpen} onClose={modalClose} onSave={entityModalOnSave} updatedInfo={updatedInfo} />
        </>
    )
};