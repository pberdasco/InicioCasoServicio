import PropTypes from 'prop-types';

import { Controller } from "react-hook-form";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

import { StdSnackAlert } from "./StdSnackAlert";
import { setSize } from "./fieldSize";

import { useState, useEffect, useCallback } from "react";
import { useFileUploader } from "./FileUploader"; 
import { StdTakePhoto } from './StdTakePhoto';

function getFileExtension(file){
    const fileParts = file.split('.');
    return "." + fileParts[fileParts.length - 1];
}

//TODO: ver por que despues de arreglar un error de validacion no pasa automaticamente a color normal. Pasa recien con un submit.

export function StdLoadFile({ name, control, label = "Seleccionar Archivo o tomar una foto",
                                errors, validateAfterFn = null, required, clearErrors,     // errores
                                photo = true, allowedTypes=["all"],                        // permite fotos? y que extensiones de archivo?
                                helperText=" ", toolTip="Con los botones, seleccione un archivo o tome una foto",   
                                storage, subDirectory = "",                         //en que campo auxiliar/estado del form guarda el nombre y en que subdirectorio del server guarda el archivo
                                defaultFile = "", readOnly = false, size = "l" }) {
    const inputSize = setSize(size);
    const [selectedFileName, setSelectedFileName] = useState("");
    const [alert, setAlert] = useState({ status: "None", msg: "" });
    const [errorState, setErrorState] = useState(required || "")   // estado para el manejo de errores de react-hook-form
    // estados para <StdTakePhoto />
    const [imgSrc, setImgSrc] = useState("");
    const [newPhoto, setNewPhoto] = useState(false);
    const [takingPhoto, setTakingPhoto] = useState(false);
     

    // Funciones de llamada a las apis de upload
    const { uploadFile, uploadBase64 } = useFileUploader(); 

    // Valor por defecto en update
    useEffect(() => {
        setSelectedFileName(defaultFile);
    }, [defaultFile]);

    const handleUpload = useCallback(async (fileOrBase64, isBase64) => {
        if (readOnly) return;
    
        try {
            let fileData;
            if (isBase64) {
                fileData = await uploadBase64(fileOrBase64);
            } else {
                fileData = await uploadFile(fileOrBase64, subDirectory);
            }
    
            if (fileData.success) {
                let validateAfterStatus = { status: "Ok", msg: "" };
                if (validateAfterFn) {
                    validateAfterStatus = await validateAfterFn(fileData.fileName, fileData.originalFileName);
                }
    console.log(isBase64, validateAfterStatus)
                if (validateAfterStatus.status != "Error") { // Validación aprobada
                    clearErrors(name);  // no deberia hacer falta pero igual no soluciona el tema
                    setErrorState("");
                    storage.setFunc(storage.field, fileData.filename);
                    if (storage.setState) storage.setState(fileData.filename);
                    setSelectedFileName(fileData.originalFileName);
                    setAlert({ status: validateAfterStatus.status, msg: validateAfterStatus.msg })
                } else { // Error de Validación post upload
                    setSelectedFileName(fileData.originalFileName);
                    setAlert({ status: "Error", msg: validateAfterStatus.msg })
                    storage.setFunc(storage.field, "");
                    if (storage.setState) storage.setState("");
                    setErrorState(validateAfterStatus.msg);
                }
            } else { // Error de Upload
                setErrorState(fileData.error);
                setSelectedFileName("");
                setAlert({ status: "Error", msg: `(${fileData.statusCode}) - ${fileData.error}` })
                storage.setFunc(storage.field, "");
                if (storage.setState) storage.setState("");
            }
        } catch (error) {
            setErrorState(isBase64 ? "Error al cargar la foto" : "Error al cargar el archivo");
            setSelectedFileName("");
            setAlert({ status: "Error", msg: "Error al cargar el archivo" })
            storage.setFunc(storage.field, "");
            if (storage.setState) storage.setState("");
        }
    }, [readOnly, uploadBase64, uploadFile, subDirectory, validateAfterFn, clearErrors, name, storage]);
    
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        setSelectedFileName(file ? file.name : "");
    
        if (!allowedTypes.includes(getFileExtension(file.name))) {
            setAlert({ status: "Error", msg: `Tipo de archivo inválido. Solo se permiten ${allowedTypes.join(', ')}.` })
            setErrorState(`Tipo de archivo inválido. Solo se permiten ${allowedTypes.join(', ')}.`);
            return;
        }
        //TODO: Agregar const MAX_FILE_SIZE = 10485760; // 10 MB .....
    
        if (file) {
            await handleUpload(file);
        }
    };
    
    useEffect(() => {
        if (newPhoto) {
            handleUpload(imgSrc, true);
            setNewPhoto(false);
        }
    }, [handleUpload, imgSrc, newPhoto, storage, uploadBase64]);
    

    const handleTakePhoto = () => {
        if (readOnly) return;
        setTakingPhoto(true);
    }

    const inputProps = {};
    if (!allowedTypes.includes("all")) {
        inputProps.accept = allowedTypes.join(",");
    }

    return (
        <Grid item {...inputSize}>          
            <Controller 
                render={({ field, fieldState: {error}}) => {
                    return (
                    <>
                        <input
                            {...field}
                            type="file"
                            id={name}
                            style={{ display: 'none' }}
                            disabled={readOnly}
                            onChange={async (e) => {
                                await handleFileChange(e);
                                field.onChange(e);
                            }}
                            {...inputProps}
                        />
                                
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip title={toolTip}  followCursor placement="top"> 
                                <TextField
                                    label={label}
                                    value={selectedFileName}
                                    variant = "standard"
                                    error={!!error}             
                                    helperText={errors[name] ? errors[name]?.message : helperText}
                                    readOnly
                                    fullWidth
                                />
                            </Tooltip>
                            <label htmlFor={name}>         {/* Hace que el click en el boton Importar -que no tiene onclick- en realidad sea un click en el input file "name" */}
                                <Tooltip title="Importar archivo" placement="top">
                                <Button
                                    sx={{ marginLeft: '5px'}}
                                    variant="contained"
                                    color="primary"
                                    component="span"
                                    disabled={readOnly}
                                    startIcon={<CloudUploadIcon sx={{width: "28px", paddingLeft: "8px"}}/>}
                                />
                                </Tooltip>
                            </label>
                            {photo && (
                            <Tooltip title="Tomar una foto" placement="top">
                                <Button
                                    style={{ marginLeft: '5px'}}
                                    variant="contained"
                                    color="primary"
                                    component="span"
                                    disabled={readOnly}
                                    startIcon={<AddAPhotoIcon sx={{width: "28px", paddingLeft: "8px"}}/>}
                                    onClick={handleTakePhoto}
                                />
                            </Tooltip> 
                            )}                         
                        </div>

                        {takingPhoto && (<StdTakePhoto setImgSrc={setImgSrc} setNewPhoto={setNewPhoto} takingPhoto={takingPhoto} setTakingPhoto={setTakingPhoto}/>)}        
               
                        <StdSnackAlert
                            open={alert.status !== "None"}
                            close={() => setAlert({ status: "None", msg: "" })}
                            text={alert.status === "Error" ? `${alert.msg}` : alert.msg ? `${alert.msg} - ha sido cargado` : `${selectedFileName} - ha sido cargado`} 
                            severity={alert.status === "Ok" ? "success" : alert.status === "Warn"? "warning" : "error"}
                        />           
                    </>
                    );
                }}
                name={name}
                control={control}
                defaultValue=""
                rules={{validate: {noError: () => {return errorState == "" || errorState }}}}
            />
        </Grid>
    );
}

StdLoadFile.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    control: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired, 
    photo: PropTypes.bool,                   // true si habilita boton de sacar foto o falso si solo levanta archivos del disco
    helperText: PropTypes.string,
    toolTip: PropTypes.node,
    readOnly: PropTypes.bool,
    size: PropTypes.oneOf(["s", "m", "l"]),
    defaultFile: PropTypes.string,            // como un input file no admite recibir un texto, para mostrar si esta en update debe resivir deaultFile
    storage: PropTypes.shape({
        setFunc: PropTypes.func.isRequired,   // usualemente el setvalue del useForm
        field: PropTypes.string,              // nombre del campo donde se va a guardar el nombre de archivo capturado
        setState: PropTypes.func              // funcion opcional para cargar un estado con el nombre del archivo cargado
    }).isRequired,
                                    // Ejemplos de storage:
                                    // 1) storage en un campo adicional del form
                                    // const storageProd = {
                                    //     setFunc: setValue,
                                    //     field: "hiddenFoto"}
                                    // 2) storage en un campo adicional del form más en un estado del form
                                    //     setFunc: setValue,
                                    //     field: "hiddenFoto"
                                    //     setState: setHiddenFoto}
    subDirectory: PropTypes.string,           // subdirectorio que se aplicara al directorio de grabación por defecto
    validateAfterFn: PropTypes.func,          // funcion async de validacion post carga (usa paramentro filename y originalFileName) permite llamada al server para trabajar sobre el archivo levantado
                                              // la funcin debe devolver {status: "Ok"/"Warn"/"Error", msg: string }  Ok y Warn no marcan error en react-hook-form
                                              // ejemplos: validar con IA o validar que una planilla excel tenga cierta info
    allowedTypes: PropTypes.array,            // array con tipos de archivos permitidos por defecto es all
    required: PropTypes.string,
    clearErrors: PropTypes.func
};



// const handleFileChange = async (e) => {
//     if (readOnly) return;
//     const file = e.target.files[0];
//     setSelectedFileName(file ? file.name : "");

//     if (!allowedTypes.includes(getFileExtension(file.name))) {
//         setErrorState(`Tipo de archivo inválido. Solo se permiten ${allowedTypes.join(', ')}.`);
//         return;
//     }
//     //TODO: Agregar const MAX_FILE_SIZE = 10485760; // 10 MB .....

//     if (file) {
//         try {
//             const fileData = await uploadFile(file, subDirectory);
//             if (fileData.success) {
//                 // si hay funcion de validacion afterLoad la ejecuta
//                 let validateAfterStatus = {ok: true, msg: ""};
//                 if (validateAfterFn) validateAfterStatus = await validateAfterFn(fileData.originalFileName);
//                 if (validateAfterStatus.ok) { // Validacion aprobada
//                     setErrorState("");
        
//                     setSelectedFileName(fileData.originalFileName);
//                     setShowSuccessAlert(true);
//                     // guarda en el campo asociado oculto (setValue(campoOculto,nombreArchivoGuardado))
//                     storage.setFunc(storage.field, fileData.filename);
//                     // y eventualmente en el estado
//                     if (storage.setState) storage.setState(fileData.filename)
//                 } else { // Error de Validacion post upload
//                     setUploadError(validateAfterStatus.msg);
//                     // limpia el campo asociado oculto (setValue(campoOculto,nombreArchivoGuardado)) y eventualmente limpia tambien el estado asociado
//                     storage.setFunc(storage.field, "");
//                     if (storage.setState) storage.setState("");
//                     setErrorState(validateAfterStatus.msg);  
//                 }                    
//             } else {  // Error de Upload
//                 setErrorState(fileData.error)
//                 setUploadError(`(${fileData.statusCode}) - ${fileData.error}`);
//                 storage.setFunc(storage.field, "");
//                 if (storage.setState) storage.setState("")
//             }
//         } catch (error) {
//             setErrorState("Error al cargar el archivo")
//             setUploadError("Error al cargar el archivo"); 
//             storage.setFunc(storage.field, "");
//             if (storage.setState) storage.setState("")
//         } 
//     }
// };

// useEffect(() => {
//     async function savePhoto(){
//         try {
//             const fileData = await uploadBase64(imgSrc);
//             if (fileData.success) {
//                 let validateAfterStatus = {ok: true, msg: ""};
//                 if (validateAfterFn) validateAfterStatus = await validateAfterFn(fileData.originalFileName);
//                 if (validateAfterStatus.ok) { // Validacion aprobada
//                     setErrorState("");
//                     storage.setFunc(storage.field, fileData.filename);
//                     if (storage.setState) storage.setState(fileData.filename)
//                     setSelectedFileName(fileData.originalFileName);
//                     setShowSuccessAlert(true);
//                 } else { // Error de Validacion post upload
//                     setUploadError(validateAfterStatus.msg);
//                     // limpia el campo asociado oculto (setValue(campoOculto,nombreArchivoGuardado)) y eventualmente limpia tambien el estado asociado
//                     storage.setFunc(storage.field, "");
//                     if (storage.setState) storage.setState("");
//                     setErrorState(validateAfterStatus.msg);  
//                 }
//             } else {
//                 setErrorState(fileData.error)
//                 setSelectedFileName("");
//                 setUploadError(`(${fileData.statusCode}) - ${fileData.error}`);
//                 storage.setFunc(storage.field, "");
//                 if (storage.setState) storage.setState("")
//             }
//         }catch (error){
//             setErrorState("Error al cargar la foto")
//             setSelectedFileName("");
//             setUploadError("Error al cargar la foto"); 
//             storage.setFunc(storage.field, "");
//             if (storage.setState) storage.setState("")
//         }
//     }

//     if (newPhoto) {
//         savePhoto();
//         setNewPhoto(false)
//     }
// // eslint-disable-next-line react-hooks/exhaustive-deps
// }, [newPhoto, storage, uploadBase64])