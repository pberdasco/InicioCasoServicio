/* eslint-disable react/prop-types */
import { useMemo } from "react";

export const useColumn = () => {
    const columns = useMemo(
        () => [
          {
            accessorKey: 'nombre', 
            header: 'Nombre',
            size: 100,
          },
          {
            accessorKey: 'mail', 
            header: 'Mail',
            size: 100,
          },
          {
            accessorKey: 'empresa', 
            header: 'Organizacion',
            size: 100,
          },
          {
            accessorKey: 'rol', 
            header: 'Permisos',
            size: 100,
          },      
        ],
        [],
    );
    return columns;
}