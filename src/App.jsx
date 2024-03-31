import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Formato y loocalizacion fechas (usado entre otros por stdDatePicker)
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/es'

// Pantallas de la aplicacion de demostración
import { FormGarantia } from "./pages/FormGarantia";
// import { FormTextInput } from './pages/FormTextInput';
import { FormLogin } from './pages/FormLogin';
import { ResponsiveAppBar } from './RespoonsiveAppBar/ResponsiveAppBar';
import ErrorPage from './pages/Complements/error-page';

// Router
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { FormRedirect } from './pages/Complements/FormRedirect';
import { GeneralContextProvider } from './Context/GeneralContext';
import { FormIniciaCaso } from './pages/FormIniciaCaso';
import { SetUser } from './pages/Complements/SetUser';

const theme = createTheme({});


function App() {
  return (
    <GeneralContextProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SetUser/>
          <ResponsiveAppBar/> 
            <BrowserRouter>
              <Routes>
                <Route path= "/" element={<FormGarantia />} errorElement= {<ErrorPage/>} /> 
                <Route path= "/:token" element={<FormGarantia />} errorElement= {<ErrorPage/>} />
                <Route path= "/inicio" element={<FormRedirect form={<FormIniciaCaso/>} from="/inicio"/>} errorElement= {<ErrorPage/>} />
                {/* <Route path= "/text" element={<FormRedirect form={<FormTextInput/>} from="test"/>} errorElement= {<ErrorPage/>} />            */}
                <Route path= "/login" element={<FormLogin />} errorElement= {<ErrorPage/>} />
              </Routes>
            </BrowserRouter>
        </ThemeProvider>
      </LocalizationProvider>
    </GeneralContextProvider>
  )
}

export default App


