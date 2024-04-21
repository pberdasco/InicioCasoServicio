const apiBaseUrl = 'http://192.168.78.103:5002/';

export class AI {

  // Llama a la api que valida si el archivo almacenado en el server con nombre @param: archivo es una factura
  // devuelve
  // {
  //    "status": "Ok" si es factura electrom en garantia // "Warn" si es fact pero no ok // "Error" todas las demas 
  //    "msg": string  // un mensaje para el alert y en caso de ok false para el helperText tambien  
  //    "ai": {
  //      "esFactura": bool,
  //      "fecha": aaaa-mm-dd,
  //      "tieneItemElectrodomestico": bool,
  //      "textoItemElectrodomestico": string
  //    }
  // }

  static async checkFactura(archivo, archivoOriginal) {  
    try {
        const aiResponse = await fetch(apiBaseUrl + 'ai/' + archivo);
        if (aiResponse.ok) {
            const ai = await aiResponse.json();
            if (ai.esFactura)
                if (ai.tieneItemElectrodomestico){
                    const fechaFactura = new Date(ai.fecha);
                    const fechaHoy = new Date()
                    const difTiempo = fechaHoy.getTime() - fechaFactura.getTime;
                    const dias = difTiempo / (1000 * 3600 * 24)
                    if (dias <= 365)
                        return {status: "Warn", msg: `${archivoOriginal} Es una factura de electrodomésticos "Fuera de garantía"`, ai}
                    else
                      return {status: "Ok", msg: `${archivoOriginal} Es una factura de electrodomésticos "En garantía"`, ai}    
                } else {
                  return {status: "Warn", msg: `${archivoOriginal} Es una factura pero no parece corresponder a un electrodoméstico`, ai}
                }           
            else
                return {status: "Error", msg: `${archivoOriginal} no parece ser una factura`, ai}
        } else{
            console.error('Fallo -ok=false- en la revision por IA:', archivo, " - ", aiResponse.status, aiResponse.statusText);
            return {status: "Error", msg: 'Fallo en la revisión por IA'}
        }
    } catch (error) {
      console.error('Fallo -catch- en la revision por IA:', archivo, " - ", error);
      return {status: "Error", msg: 'Fallo en la revisión por IA'}
    }
  }
}
