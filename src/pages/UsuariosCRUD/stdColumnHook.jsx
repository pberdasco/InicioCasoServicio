/* eslint-disable react/prop-types */
import { useMemo } from "react";

export const useColumn = () => {
    const columns = useMemo(
        () => [
          {
            accessorKey: 'id', 
            header: 'Id',
            size: 100,
          },
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
            accessorKey: 'organizacion.empresa', 
            header: 'Organizacion',
            size: 100,
          },
          {
            accessorKey: 'derechos.tipo', 
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