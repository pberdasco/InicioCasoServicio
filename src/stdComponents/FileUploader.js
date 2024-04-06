const uploadFileService = "http://192.168.78.103:5002/upload/file";
const uploadBase64Service = 'http://192.168.78.103:5002/upload/base64';

export function useFileUploader() {
    const uploadFile = async (file, directory="") => {
        const formData = new FormData();
        formData.append("file", file);
        if (directory) {
            formData.append("directory", directory);
        }
        try {
            const response = await fetch(uploadFileService, {
                method: "POST",
                body: formData,
            });
    
            if (response.ok) {
                const responseData = await response.json();
                return { success: true, fileName: file.name, responseData };
            } else {
                return{ success: false, error: "Error al cargar el archivo", statusCode: response.status};
            }
        } catch (error) {
            return { success: false, error: 'Error en la solicitud', statusCode: 500 };
        }
    };

    const uploadBase64 = async (base64) => {
        const data = { imagen: base64 }; // Crea un objeto con la propiedad "imagen" que contiene la cadena base64
      
        try {
            const response = await fetch(uploadBase64Service, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json', 
                },
                body: JSON.stringify(data), 
            });
      
            if (response.ok) {
                const result = await response.json();
                return { success: true, fileName: result.filename, message: result.message };
            } else {
                return { success: false, error: 'Error al guardar la imagen', statusCode: response.status };
            }
        } catch (error) {
            return { success: false, error: 'Error en la solicitud', statusCode: 500 };
        }
    }
      
  
    return { uploadFile, uploadBase64 };
  }
  