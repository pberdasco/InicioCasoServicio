//import { apiBaseUrl_db } from './apiUrls';

const entityDBTable = [{id: 1, nombre: "Pablo", mail:"p.berdasco@gmail.com", derechos: {id:"1000", name: "Admin"}, clave:"clavePablo", empresa: "DigitalTech"}, 
                        {id: 2, nombre: "Enzo", mail:"enzopuma@gmail.com", derechos: {id:"0100", name: "Interno"}, clave:"claveEnzo", empresa: "DigitalTech"},
                        {id: 3, nombre: "Garba", mail:"garba@garbamail.com", derechos: {id:"0010", name: "ClienteRetail"}, clave:"claveGarba", empresa: "Garba SA"}
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
        //hace el fetch PUT
        //retorna el objeto actualizado
        //aqui se simula el retorno tomando y modificando el registro del array

        
        const entity = entityDBTable.find(entity => entity.id === entityId);
        if (!entity) {
            return { status: 404, message: "entidad no encontrada en la base de datos" };
        }
        const newEntity = {...entity, ...entityPartialData }
        const index = entityDBTable.indexOf(entity);
        entityDBTable[index] = newEntity;
        return newEntity;
    }
        
    // Al cambiar una fila de la tabla se graba en la base y se setea el estado del registro.
    // Este estado (entityUpdated) se considera como dependencia en useEffect de la tabla para recargarla completa.
    // en alguna version se cambiara el mecanismos para usar tanstack query
    static async updateState(newPartialData, row, setEntityUpdated) {    
        try{
            const simpleEntityData = await SimpleEntity.partialUpdate(row.original.id, newPartialData);
            if (!simpleEntityData.status){
                setEntityUpdated({row})
            }else{
                console.log("Error", simpleEntityData.status, simpleEntityData.message )
            }  
        }catch (error){
            console.log("Error en updateState", error)
        }
    }
}