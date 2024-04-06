const apiBaseUrl = `http://192.168.78.103:5001/`;

export class Provincia {

    static async GetAll(){
        try {
            const provinciaResponse = await fetch(`${apiBaseUrl}provincias`);
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

