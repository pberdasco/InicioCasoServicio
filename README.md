
<img src="./public/tool-box.png" width="100" height="100">

# ReactForm - UI Kit 


<h3 style="color: blue;">UI Kit para formularios react</h3>

**Conjunto de componentes con funcionalidad y estilos predefinidos para acelerar la generación de formularios en proyectos React**

Basado en:
- **React-hook-form**
- **Material UI** (incluyendo X para la fecha y la grilla)

Utiliza también:
- **dayjs** (manejo de fechas, ademas lo requiere MUIx datepicker)
- **react-webcam** (fotos)

Para demostración de los controles la aplicacion tiene menues administrados con:
- **React-router-dom** 

Creado con Vite. Ejecutar con: `npm run dev`

Instalación de componentes: 
- **npm install react-hook-form**  // *[react-hook-form](https://react-hook-form.com/)*
- **npm install @mui/material @emotion/react @emotion/styled**  // *[material UI](//https://mui.com/material-ui/getting-started/installation/)*
- **npm install @fontsource/roboto**  // utilizado por materialUI
- **npm install @mui/icons-material**
- **npm install @mui/x-data-grid** // Ver versiones de pago con mas funcionalidad (aqui usamos la version free)
- **npm install @mui/x-date-pickers**  // Ver versiones de pago con mas funcionalidad (aqui usamos la version free)
- **npm install dayjs** // formato de fechas (en conjunto con x-date-pickers)
- **npm install react-webcam** // *[react-webcam](https://www.npmjs.com/package/react-webcam)*

Para la demostración de los componentes:
- **npm i react-router-dom**  // [react-router-dom](https://www.npmjs.com/package/react-router-dom)

Para testing:
- **npm install -D @hookform/devtools** // [hookform/devtools](https://react-hook-form.com/dev-tools)

# Controles definidos
| Control         | Descripcion                   | Observaciones                         |
|:---             | :----:                        | ---:                                  |
| *StdBlock*      | Bloque con recuadro y tiitulo | el titulo es opcional                 |
| *StdSnackAlert* | Cartel aviso de alertas       | severity le asigna el color y formato |
| *StdTextImput*  | Ingreso de texto              |                                       |

>En general los controles aceptan reglas de validación, helpertexts, tooltips, 3 tamaños distintos "S", "m" y "l"

---
**Sitios recomendados:**

***<https://react-hook-form.com/>***
***<https://mui.com/material-ui/>***
<https://www.npmjs.com/package/dayjs/>
<https://www.npmjs.com/package/react-webcam/>

*<https://www.markdownguide.org/basic-syntax/>*

---


---
# Pruebas markdown:

Borrar esto: 
- el codigo en una explicacion se puede indicar como `useEffect(() => {}, []);`
- <p style="color: red;">Borrar esto es para mostrar texto en color. Markdown soporta un subset de html</p>

Configurar la pantalla que recibe los controles de forma similar a:

    <html>
        <head>
            <title>Test</title>
        </head>

