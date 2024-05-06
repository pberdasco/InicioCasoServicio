import { useContext } from "react";
import { Context } from "./RetailContext.jsx";


export const useRetailContext = () => {
    const context = useContext(Context)
    return context;
}