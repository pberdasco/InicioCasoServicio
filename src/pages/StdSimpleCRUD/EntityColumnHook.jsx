/* eslint-disable react/prop-types */
import { useMemo } from "react";

export const useEntityColumn = () => {
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
            accessorKey: 'organizacion', 
            header: 'Organizacion',
            size: 100,
          },
          {
            accessorKey: 'derechos', 
            header: 'Permisos',
            size: 100,
          },
          {
            accessorKey: 'password', 
            header: 'Password',
            size: 100,
          },
          
        ],
        [],
    );
    return columns;

}