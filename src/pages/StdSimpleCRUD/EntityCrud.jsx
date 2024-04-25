import { EntityContextProvider } from "./EntityContext";
import { EntityCRUDTable } from "./EntityCRUDTable";

export const EntityCRUD = () => {
    return(
        <EntityContextProvider>
            <EntityCRUDTable/>
        </EntityContextProvider>
    )
}