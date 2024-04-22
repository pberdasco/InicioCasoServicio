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
}

