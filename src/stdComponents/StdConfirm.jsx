import PropTypes from 'prop-types';
import { confirmAlert } from "react-confirm-alert";
import "./StdConfirm.css";


export function StdConfirm({title="Confirmación", message="Proceder con la operación?", yesFunction=()=>{}, yesArgs=[], noFunction=()=>{}, noArgs=[]}){

    confirmAlert({
        title: title, 
        message: message,  
        closeOnEscape: false,
        closeOnClickOutside: false,            
        buttons: [
        {
            label: "Si",
            onClick: () => yesFunction(...yesArgs),
        },
        {
            label: "No",
            onClick: () => noFunction(...noArgs),
        }
        ]
    });
    
    return null;
}

StdConfirm.propTypes = {
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    yesFunction: PropTypes.func,         
    yesArgs: PropTypes.array,
    noFunction: PropTypes.func,
    noArgs: PropTypes.array,
}
