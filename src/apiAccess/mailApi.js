const apiBaseUrl = `http://192.168.78.103:5002/`;

export class Mail {
    static async send(datosMail){
        console.log("Enviando mail: ", datosMail)
        const response = await fetch(`${apiBaseUrl}mail/send/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: datosMail.to,
                subject: datosMail.subject,
                text: datosMail.text,
                html: datosMail.html
            }),
        });
        
        if (response.ok) {
            console.log('Correo electrónico enviado correctamente');
        } else {
            console.log('Error al enviar el correo electrónico');
        }
    }
}
