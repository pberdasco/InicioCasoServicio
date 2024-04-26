//import { apiBaseUrl_db } from './apiUrls';

let entityDBTable = [{id: 1, nombre: "Pablo", mail:"p.berdasco@gmail.com", derechos: {id:"1000", tipo: "Admin"}, password:"clavePablo", organizacion: {idClienteERP: "PROPIA", empresa: "DigitalTech"}}, 
                        {id: 2, nombre: "Enzo", mail:"enzopuma@gmail.com", derechos: {id:"0100", tipo: "Interno"}, password:"claveEnzo", organizacion: {idClienteERP: "PROPIA", empresa: "DigitalTech"}},
                        {id: 3, nombre: "Garba", mail:"garba@garbamail.com", derechos: {id:"0010", tipo: "Cliente Retail"}, password:"claveGarba", organizacion: {idClienteERP: "GARBA", empresa: "Garba SA"}}
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
    static async create(entityData) {
        try {
            // validar no repetido o dejarlo a las claves unicas si corresponde
            // Generar un nuevo ID para la entidad
            const newEntityId = SimpleEntity.generateNewEntityId(); // Supongamos que hay una función para generar un nuevo ID
    
            // Crear la nueva entidad con el ID generado y los datos proporcionados
            const newEntity = { id: newEntityId, ...entityData };
    
            // Crear una copia del array de entidades en la base de datos y agregar la entidad
            const updatedEntityDBTable = [...entityDBTable];
            updatedEntityDBTable.push(newEntity);

            // Actualizar el array original
            entityDBTable = updatedEntityDBTable; 
    
            // Devolver la copia actualizada del array
            return updatedEntityDBTable;
        } catch (error) {
            // Manejar cualquier error que pueda ocurrir durante la creación de la entidad
            return { status: 500, message: "Error interno del servidor al crear la entidad" };
        }
    }
    
    static generateNewEntityId() {
        // Encontrar el ID más grande en el array de entidades
        const maxId = entityDBTable.reduce((max, entity) => {
            return entity.id > max ? entity.id : max;
        }, 0);
    
        // El nuevo ID será el ID más grande encontrado más uno
        return maxId + 1;
    }
    
       
}