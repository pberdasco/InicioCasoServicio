import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Formato y loocalizacion fechas (usado entre otros por stdDatePicker)
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/es'

// Pantallas de la aplicacion de demostración
import { FormGarantia } from "./pages/FormGarantia";
import { FormIniciaCaso } from './pages/FormIniciaCaso';
import { FormLogin } from './pages/FormLogin';
import { ResponsiveAppBar } from './ResponsiveAppBar/ResponsiveAppBar';
import { InvalidLinkPage } from './pages/FormInvalidLink';

// Router
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FormRedirect } from './pages/Complements/FormRedirect';
import { GeneralContextProvider } from './Context/GeneralContext';
import { SetUser } from './pages/Complements/SetUser';
import { CasosMonitor } from './pages/CasosMonitor/CasosMonitor';
import { UsuariosCRUD } from './pages/UsuariosCRUD/UsuariosCRUD';
import { EntityCRUDTable } from './pages/StdSimpleCRUD/EntityCRUDTable'


const theme = createTheme({});


function App() {
  return (
    <GeneralContextProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
        <ThemeProvider theme={theme}>
          <CssBaseline />
            <BrowserRouter>
              <SetUser/>
              <ResponsiveAppBar/> {/* dentro del BrowserRouter porque en el componente usa <Link> que necesita un estado del contexto que crea BrowserRouter*/}
              <Routes>
                <Route path= "/service/:token" element={<FormGarantia />}/>
                <Route path= "/inicio" element={<FormRedirect form={<FormIniciaCaso/>} from="/inicio"/>}/>
                <Route path= "/login" element={<FormLogin />}/>
                <Route path= "/" element={<FormRedirect form={<CasosMonitor/>} from="/monitor"/>}/>
                <Route path= "/monitor" element={<FormRedirect form={<CasosMonitor/>} from="/monitor"/>}/>
                <Route path= "/usuarios" element={<UsuariosCRUD />}/>
                <Route path= "/test" element={<EntityCRUDTable />}/>
                <Route path= "*" element={<InvalidLinkPage/>}/> 
              </Routes>
            </BrowserRouter>
        </ThemeProvider>
      </LocalizationProvider>
    </GeneralContextProvider>
  )
}

export default App


