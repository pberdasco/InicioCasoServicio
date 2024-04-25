//import { apiBaseUrl_db } from './apiUrls';

let entityDBTable = [{id: 1, nombre: "Pablo", mail:"p.berdasco@gmail.com", derechos: {id:"1000", tipo: "Admin"}, clave:"clavePablo", organizacion: {idClienteERP: "PROPIA", empresa: "DigitalTech"}}, 
                        {id: 2, nombre: "Enzo", mail:"enzopuma@gmail.com", derechos: {id:"0100", tipo: "Interno"}, clave:"claveEnzo", organizacion: {idClienteERP: "PROPIA", empresa: "DigitalTech"}},
                        {id: 3, nombre: "Garba", mail:"garba@garbamail.com", derechos: {id:"0010", tipo: "Cliente Retail"}, clave:"claveGarba", organizacion: {idClienteERP: "GARBA", empresa: "Garba SA"}}
                    ]
export class SimpleEntity {
    // Llama a la api para cargar todas las entidades. Se llama desde el useEffect principal de la tabla
    // en futuras versiones se usara con Tanstak query
    static async getAll() {
        // normalmente ira un:
        // try {
        //     const entityResponse = await fetch(`${apiBaseUrl_db}entity/`);
        //     if (entityResponse.ok) {
        //         const entityData = await entityResponse.json();
        //         const entity = entityData.map(ent => new entityModel(ent));   // podria en algunos casos no pasar por crear un objeto en la capa model
        //         return entity;
        //     } else if (entityResponse.status === 404) {
        //         const status = casoResponse.status;
        //         const errorData = await casoResponse.json(); 
        //         const message = errorData?.message || "entidades no encontradas en la base de datos";
        //         return { status, message };
        //     } 
        // } catch (error) {
        //     console.log(error);
        //     return { status: 400, message: "Error al buscar entidades en la base de datos" };
        // }
        // Dado que es para el CRUD modelo:
        return entityDBTable;
    }

    static async update(entityId, entityPartialData) {
        const entityIndex = entityDBTable.findIndex(entity => entity.id === entityId);
        if (entityIndex === -1) {
            return { status: 404, message: "Entidad no encontrada en la base de datos" };
        }
    
        // Crear una copia del objeto encontrado en el array
        const updatedEntity = { ...entityDBTable[entityIndex], ...entityPartialData };
    
        // Crear un nuevo array con la entidad actualizada
        const updatedEntityDBTable = [
            ...entityDBTable.slice(0, entityIndex),
            updatedEntity,
            ...entityDBTable.slice(entityIndex + 1)
        ];
    
        // Actualizar el array original
        entityDBTable = updatedEntityDBTable; 

        //Tener en cuenta que cuando sea un PUT debe devolver algo con {status:} si hay un error
        return updatedEntity;
    }
        
    // Al cambiar una fila de la tabla se graba en la base y se setea el estado del registro.
    // Este estado (isEntityUpdated) se considera como dependencia en useEffect de la tabla para recargarla completa.
    // en alguna version se cambiara el mecanismos para usar tanstack query
    static async updateState(newPartialData, row, setIsEntityUpdated) { 
        try{
            const simpleEntityData = await SimpleEntity.update(row.id, newPartialData);
            if (!simpleEntityData.status){
                setIsEntityUpdated(true)
            }else{
                console.log("Error", simpleEntityData.status, simpleEntityData.message )
            }  
        }catch (error){
            console.log("Error en updateState", error)
        }
    }
}