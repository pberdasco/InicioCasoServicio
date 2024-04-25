import PropTypes from 'prop-types';
import { useState, createContext } from "react";

export const Context = createContext();

export const EntityContextProvider = ({children}) => {

    const [isEntityUpdated, setIsEntityUpdated] = useState(false);    // si se modifico la fila para que el useEffect de EntityCRUDTable ejecute

    return(
        <Context.Provider value={{isEntityUpdated, setIsEntityUpdated}}>
            {children}
        </Context.Provider>
    )
}

EntityContextProvider.propTypes = {
    children: PropTypes.element
}