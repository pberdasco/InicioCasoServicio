import PropTypes from 'prop-types';
import React from "react";

export const Context = React.createContext();

export const RetailContextProvider = ({children}) => {

    const [loggedUser, setloggedUser] = React.useState([]);

    return(
        <Context.Provider value={{loggedUser, setloggedUser}}>
            {children}
        </Context.Provider>
    )
}

RetailContextProvider.propTypes = {
    children: PropTypes.element
}