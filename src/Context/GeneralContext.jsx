import PropTypes from 'prop-types';
import React from "react";

export const Context = React.createContext();

export const GeneralContextProvider = ({children}) => {

    const [loggedUser, setloggedUser] = React.useState([]);

    return(
        <Context.Provider value={{loggedUser, setloggedUser}}>
            {children}
        </Context.Provider>
    )

}

GeneralContextProvider.propTypes = {
    children: PropTypes.element
}