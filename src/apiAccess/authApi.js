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

    static async Register(data) {
        const regData = {nombre: data.nombre,
            mail: data.mail,
            derechos: data.derechos.derechos,  //derechos.rol sobra
            idClienteERP: data.organizacion.idClienteERP, // organizacion.empresa sobra
            password: data.password
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

    static async Update(data) {
        const updateData = {nombre: data.nombre,
                            mail: data.mail,
                            derechos: data.derechos.derechos,  //derechos.rol sobra
                            idClienteERP: data.organizacion.idClienteERP, // organizacion.empresa sobra
                            //en update no viaja password porque no se modifica por aqui
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

    static async Delete(deleteData) {
        try {
            const response = await fetch(`${apiBaseUrl_db}auth/delete`,
            {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify(deleteData),
            });
            if (response.ok){
                const data = await response.json();
                return data;
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

