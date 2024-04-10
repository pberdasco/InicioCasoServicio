/* eslint-disable react/prop-types */
import { useMemo } from "react";
import { Box } from "@mui/material";

export const useCasosColumn = () => {
    const columns = useMemo(
        () => [
          {
            accessorKey: 'idCRM', 
            header: 'Caso',
            size: 100,
          },
          {
            accessorFn: (row) => new Date(row.fechaAlta),
            id: 'fechaAlta',
            header: 'Alta',
            filterVariant: 'date',
            filterFn: 'lessThan',
            sortingFn: 'datetime',
            Cell: ({ cell }) => cell.getValue()?.toLocaleDateString(),   //TODO: hay que pasarla a formato arg
            Header: ({ column }) => <em>{column.columnDef.header}</em>,
            muiFilterTextFieldProps: {
            sx: {
                minWidth: '250px',
            },
            },
          },
          {
            accessorKey: 'statusDatosID', 
            header: 'Datos',
            size: 100,
            Cell: ({ cell }) => (
                <Box component="span" sx={() => ({  // se podria tomar theme como parametro y usarlo dentro si fuera util
                    backgroundColor:
                      cell.getValue() == 0 ? 'black'
                        : cell.getValue() == 1 ? 'green' 
                          : cell.getValue() == 2 ? 'blue' 
                            : cell.getValue() == 3 ? 'orange' : 'green',
                    borderRadius: '0.25rem',
                    color: '#fff',
                    maxWidth: '9ch',
                    p: '0.25rem',
                })}>
                    {cell.getValue() == 0 ? "Creado" :
                        cell.getValue() == 2 ? "Revision" :
                            cell.getValue() == 1 ? "DatosOk" :
                              cell.getValue() == 3 ? "Faltantes" : "En ERP"
                    }
                    
                </Box>
              ),
          },
          {
            accessorKey: 'cliente.mail',
            header: 'Mail',
            enableClickToCopy: true,
            filterVariant: 'autocomplete',
            size: 200,
          },
        //   {
        //     accessorKey: 'items[0].producto.nombre',
        //     header: 'Producto',
        //     size: 150,
        //   },
        ],
        [],
    );
    return columns;

}