const apiBaseUrl = `http://192.168.78.103:5001/`;

export class Producto {

    static async GetAll(){
        try {
            const productoResponse = await fetch(`${apiBaseUrl}productos`);
            if (productoResponse.ok) {
                const productoData = await productoResponse.json();
                const productos = productoData.map(producto => {
                    return {
                      id: producto.id,
                      idERP: producto.idERP,
                      name: producto.nombre,
                      tipoId: producto.tipoProductoId,
                      tipo: producto.tipoNombre,
                    };
                  });
                return productos;
            } else if (productoResponse.status === 404) {
                const status = productoResponse.status;
                const errorData = await productoResponse.json(); 
                const message = errorData?.message || "Prductos no encontrados"; 
                return { status, message };
            } 
        } catch (error) {
            console.log(error);
            throw new Error("Error al cargar la lista de productos");
        }
    }

}

