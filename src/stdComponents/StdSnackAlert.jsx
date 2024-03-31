import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

// eslint-disable-next-line react/prop-types
export function StdSnackAlert({open, close, text, severity}){
return(
    <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={open}
        autoHideDuration={3000}
        onClose={close}
    >
        <Alert
            severity={severity}
            sx={{ width: '100%', minHeight: `60px` }}
            onClose={close} 
        >
            {text}
        </Alert>
    </Snackbar>
)
}