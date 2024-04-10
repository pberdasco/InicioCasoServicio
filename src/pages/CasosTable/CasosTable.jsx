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

//MODAL
import { setStatusDatos } from "./updateRow.js"
const useDatosStatusModal = () => {
  const [isDatosModalOpen, setIsDatosModalOpen] = useState(false);
  const [statusUpdateInfo, setStatusUpdateInfo] = useState({ newStatus: 0, row: {} });

  const datosModalOpen = () => setIsDatosModalOpen(true);
  const datosModalClose = () => setIsDatosModalOpen(false);

  const onSave = (data, setCasosUpdated) => {
    console.group("CasosTable-On Save")
    console.log("data:", data)
    console.log("statusUdateInfo: ", statusUpdateInfo)
    console.groupEnd()
    setStatusDatos(statusUpdateInfo.newStatus, data.msg, statusUpdateInfo.row, setCasosUpdated);
    datosModalClose(); // Cerrar el modal después de guardar
  };

  return { isDatosModalOpen, datosModalOpen, datosModalClose, onSave, setStatusUpdateInfo };
};




export const CasosTable = () => {
  const {formWidth} = useFormConfig();

  //PRUEBA MODAL
  // const [isDatosModalOpen, setIsDatosModalOpen] = useState(false);
  // const [statusUpdateInfo, setStatusUpdateInfo] = useState({newStatus:0, row:{}})

  // const datosModalOpen = () => {
  //   setIsDatosModalOpen(true)
  // }
  // const datosModalClose = () => {
  //   setIsDatosModalOpen(false)
  // }

  // const onSave= (data) => { 
  //   console.group("CasosTable-On Save")
  //   console.log("data:", data)
  //   console.log("statusUdateInfo: ", statusUpdateInfo)
  //   console.groupEnd()
  //   setStatusDatos(statusUpdateInfo.newStatus, data.msg, statusUpdateInfo.row, setCasosUpdated)
  // }

  const { isDatosModalOpen, datosModalOpen, datosModalClose, onSave, setStatusUpdateInfo } = useDatosStatusModal();

  const columns = useCasosColumn();        // podria ser una funcion normal en lugar de un customHook
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


