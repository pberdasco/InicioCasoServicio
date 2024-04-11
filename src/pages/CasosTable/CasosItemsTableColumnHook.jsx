/* eslint-disable react/prop-types */
import { useMemo } from "react";

export const useCasosItemsColumn = () => {
    const columns = useMemo(
        () => [
          {
            accessorKey: 'producto.tipo', 
            header: 'Tipo',
            size: 100,
          },
          {
            accessorKey: 'producto.nombre', 
            header: 'Producto',
            size: 200,
          },
          {
            accessorKey: 'serie', 
            header: 'Serie',
            size: 100,
          },
          {
            accessorKey: 'nroFactura', 
            header: 'Nro Factura',
            size: 100,
          },
          {
            accessorKey: 'fechaFactura', 
            header: 'Fecha Factura',
            size: 100,
          },
          {
            accessorKey: 'fallaCliente', 
            header: 'Falla Declarada',
            size: 200,
          },
        ],
        [],
    );
    return columns;

}