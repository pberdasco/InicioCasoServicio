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

    static async Register(regData) {
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
            return [];
        }
    }

    static async Update(updateData) {
        try {
            const response = await fetch(`${apiBaseUrl_db}auth/update`,
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
            return [];
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
            return [];
        }
    }

}

