export class Auth{
    static async Login(logData) {
        try {
            const response = await fetch("http://192.168.78.103:5001/auth/login",
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

