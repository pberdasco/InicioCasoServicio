/* eslint-disable react/prop-types */
import { useEffect, useState} from 'react';
import { MaterialReactTable} from 'material-react-table';

import { useCasosColumn } from './CasosTableColumnHook';
import { useCasoTableConfig } from './CasosTableConfig';
import { Caso } from '../../apiAccess/casoApi';

import { Container, Box, Grid } from "@mui/material";
import { useFormConfig } from "../Complements/useFormConfig";
import { StdBlock } from "../../stdComponents/StdBlock";
import { ModalEstadoDatos } from './ModalEstadoDatos';
import { useDatosStatusModal } from './DatosStatusHook';


export const CasosTable = () => {
  const {formWidth} = useFormConfig();


  const { isDatosModalOpen, datosModalOpen, datosModalClose, onSave, setStatusUpdateInfo } = useDatosStatusModal();

  const columns = useCasosColumn();        // columns ya viene memoizada desde el hook
  const [casos, setCasos] = useState([]);  // array de casos.
  //const [casoActual, setCasoActual] = useState({});     // ante acciones en la grilla, carga el caso Actual
  const [casosUpdated, setCasosUpdated] = useState({}); // caso de la fila modificada

  useEffect (()=> {
    const fetchData = async () => {
      try {
        const casosData = await Caso.GetAll();
        setCasos(casosData);
      } catch (error) {
        console.error("Error al obtener los casos:", error);
      }
    };
    fetchData();
  },[casosUpdated])

  const table = useCasoTableConfig({ columns, data: casos, setCasosUpdated, datosModalOpen, setStatusUpdateInfo });

  return (
    <>
      <Container maxWidth={false} component="main" disableGutters>
        <Box paddingX="8px" component="section" id="CasosGrid" justifyContent="center" alignItems="center" paddingY="8px">
        
          <StdBlock formWidth={formWidth} title="Grilla de casos">
            <Grid item xs={12}>
              <MaterialReactTable table={table} />
            </Grid>
          </StdBlock>
        
        </Box>
      </Container>
      {/* PRUEBA MODAL */}
      <ModalEstadoDatos isOpen={isDatosModalOpen} onClose={datosModalClose} onSave={onSave} setCasosUpdated={setCasosUpdated}/>
    </>
  )
};


