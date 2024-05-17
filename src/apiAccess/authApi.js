import { apiBaseUrl_db } from './apiUrls';

export class Auth{
    static async Login(logData) {
        try {
            const response = await fetch(`${apiBaseUrl_db}auth/login`,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify(logData),
            });
            if (response.ok){
                const data = await response.json();
                return data;
            }else{
                const status = response.status;
                const errorData = await response.json(); 
                const message = errorData?.message || "Error de login"; 
                return { status, message };
            }
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    /**
     * Creación de un Usuario en la BD
     * @param {object} data - campos del formulario a grabar
     * @returns {Promise<object | {status: number, message:string}>} - object: datos del usuario actualizado
     */
    static async Register(data) {
        //TODO: encript password here
        const regData = {
            nombre: data.nombre, 
            mail: data.mail,
            derechos: data.derechos.derechos,             // Solo la FK. La descripcion (rol) no se envia
            idClienteERP: data.organizacion.idClienteERP, // Solo la FK. La descripcion (empresa) no se envia
            password: data.password, 
            dirCalle: data.calle,
            dirProvincia: data.provincia?.id || 1,              // Solo la FK. La descripcion (name) no se envia
            dirLocalidad: data.localidad, 
            dirCodigoPostal: data.codPostal,
            horario: data.rangoHorario?.id || 1,                // Solo la FK. La descripcion (horario) no se envia
        }
        try {
            const response = await fetch(`${apiBaseUrl_db}auth/register`,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify(regData),
            });
            if (response.ok){
                const data = await response.json(); 
                return data;
            }else{
                const status = response.status;
                const errorData = await response.json(); 
                const message = errorData?.message || "Error de registro"; 
                return { status, message };
            }
        } catch (error) {
            console.log(error);
            return { status: error.status || 500, message: error.message || "Error al intentar registrar un nuevo usuario" };
        }
    }

        /**
     * Update de un Usuario en la BD
     * @param {object} data - campos del formulario a grabar
     * @returns {Promise<object | {status: number, message:string}>} - object: datos del usuario actualizado
     */
    static async Update(data) {
        const updateData = {
            nombre: data.nombre,
            mail: data.mail,
            derechos: data.derechos.derechos,             // Solo la FK. La descripcion (rol) no se envia
            idClienteERP: data.organizacion.idClienteERP, // Solo la FK. La descripcion (empresa) no se envia
            //en update no viaja password porque no se modifica por aqui
            dirCalle: data.calle,
            dirProvincia: data.provincia?.id || 1,              // Solo la FK. La descripcion (name) no se envia
            dirLocalidad: data.localidad,
            dirCodigoPostal: data.codPostal,
            horario: data.rangoHorario?.id || 1,                // Solo la FK. La descripcion (horario) no se envia
        }

        try {
            const response = await fetch(`${apiBaseUrl_db}auth`,
            {
                method: 'PUT',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify(updateData),
            });
            if (response.ok){
                const data = await response.json();
                return data;
            }else{
                const status = response.status;
                const errorData = await response.json(); 
                const message = errorData?.message || "Error de actualización"; 
                return { status, message };
            }
        } catch (error) {
            console.log(error);
            return { status: error.status || 500, message: error.message || "Error al intentar modificar un usuario" };
        }
    }

    static async Delete(id) {
        try {
            const response = await fetch(`${apiBaseUrl_db}auth/${id}`,
            {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json',},
            });
            if (response.ok){
                return id;
            }else{
                const status = response.status;
                const errorData = await response.json(); 
                const message = errorData?.message || "Error de eliminación"; 
                return { status, message };
            }
        } catch (error) {
            console.log(error);
            return { status: error.status || 500, message: error.message || "Error al intentar eliminar un usuario" };
        }
    }


    static async getAll() {
        try{
            const response = await fetch(`${apiBaseUrl_db}auth`)
            if (response.ok){
                const data = await response.json();
                return data;
            }else{
                const status = response.status;
                const errorData = await response.json(); 
                const message = errorData?.message || "Error de eliminación"; 
                return { status, message };
            }
        }catch(error){
            console.log(error);
            return { status: error.status || 500, message: error.message || "Error al buscar los usuarios" };
        }
    }
    
}

