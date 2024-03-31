import { useContext } from "react";
import { Context } from "./GeneralContext.jsx";


export const useGeneralContext = () => {
    const context = useContext(Context)
    return context;
}