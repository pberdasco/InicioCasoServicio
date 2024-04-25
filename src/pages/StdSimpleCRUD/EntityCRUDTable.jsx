import { useEffect, useState} from 'react';
import { MaterialReactTable} from 'material-react-table';

// para 
import { useEntityColumn } from './EntityColumnHook';           // define las columnas de la tabla
import { useEntityTableConfig } from './EntityTableConfig';      // define la configuracion de la tabla
import { SimpleEntity } from '../../apiAccess/simpleEntityApi';  // clase para acceso a las api de acceso a la BD

// para el manejo de la modal de creacion y update
import { EntityModal } from './EntityModal';
import { useEntityModal } from './EntityModalHook';


// para UI components
import { Container, Box, Grid } from "@mui/material";
import { useFormConfig } from "../Complements/useFormConfig";
import { StdBlock } from "../../stdComponents/StdBlock";


export const EntityCRUDTable = () => {
    const {formWidth} = useFormConfig();

    // Las entidades simples las modificamos y creamos en una modal
    const { isModalOpen, modalOpen, modalClose, onSave, handleRowUpdate, updatedInfo, setUpdatedInfo } = useEntityModal();

    const columns = useEntityColumn();        // columns ya viene memoizada desde el hook
    const [entities, setEntities] = useState([]);  // array de entidades
    
    
    //const [currentEntity, setCurrentEntity] = useState({});       // ante acciones en la grilla, carga el caso Actual si no alcanza con el row
    const [entityUpdated, setEntityUpdated] = useState(false);    // si se modifico la fila para que el useEffect ejecute

    // Carga del array de entidades. Al montar el componente y cuando se modifica una fila
    useEffect (()=> {
        const fetchData = async () => {
            try {
                const entitiesData = await SimpleEntity.GetAll();
                setEntities(entitiesData);
            } catch (error) {
                console.error("Error al obtener los casos:", error);
            }
        };
        fetchData();
    },[entityUpdated])

    // configuración de la tabla usa:
    //     la definicion de columnas, el estado de entidades, la funcion para setear que cambio una entidad,
    //     el estado de la modal y ???? 
    const table = useEntityTableConfig({ columns, data: entities, handleRowUpdate });
    // const table = useEntityTableConfig({ columns, data: entities, handleRowUpdate, setEntityUpdated, modalOpen, setUpdatedInfo });

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
        <EntityModal isOpen={isModalOpen} onClose={modalClose} onSave={onSave} setEntityUpdated={setEntityUpdated} updatedInfo={updatedInfo} />
        
        </>
    )
};