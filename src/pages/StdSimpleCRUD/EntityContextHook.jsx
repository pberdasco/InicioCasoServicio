import { useContext } from "react";
import { Context } from "./EntityContext.jsx";


export const useEntityContext = () => {
    const context = useContext(Context)
    return context;
}