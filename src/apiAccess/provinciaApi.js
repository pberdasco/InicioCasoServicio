import { apiBaseUrl_db } from './apiUrls';

export class Provincia {

    /**
     * Método que carga el array de provincias don datos de la BD
     * @static 
     * @async
     * @returns {Promise<Array<{id: number, name: string}> | {status: number, message: string}>}
     */
    static async GetAll(){
        try {
            const provinciaResponse = await fetch(`${apiBaseUrl_db}provincias`);
            if (provinciaResponse.ok) {
                const provinciaData = await provinciaResponse.json();
                const provincias = provinciaData.map(provincia => {
                    return {
                      id: provincia.id,
                      name: provincia.nombre,
                    };
                });
                return provincias;
            } else if (provinciaResponse.status === 404) {
                const status = provinciaResponse.status;
                const errorData = await provinciaResponse.json(); 
                const message = errorData?.message || "Provincias no encontradas"; 
                return { status, message };
            } 
        } catch (error) {
            console.log(error);
            throw new Error("Error al cargar la lista de provincias");
        }
    }

}

