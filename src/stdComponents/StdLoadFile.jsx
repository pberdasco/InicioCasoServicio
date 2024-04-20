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

import { useState, useEffect } from "react";
import { useFileUploader } from "./FileUploader"; 
import { StdTakePhoto } from './StdTakePhoto';

function getFileExtension(file){
    const fileParts = file.split('.');
    return "." + fileParts[fileParts.length - 1];
}

//TODO: ver por que despues de arreglar un error de validacion no pasa automaticamente a color normal. Pasa recien con un submit.

export function StdLoadFile({ name, control, label = "Seleccionar Archivo o tomar una foto",
                                errors, validateAfterFn = null, required,           // errores
                                photo = true, allowedTypes=["all"],                 // permite fotos? y que extensiones de archivo?
                                helperText=" ", toolTip="Con los botones, seleccione un archivo o tome una foto",   
                                storage, subDirectory = "",                         //en que campo auxiliar/estado del form guarda el nombre y en que subdirectorio del server guarda el archivo
                                defaultFile = "", readOnly = false, size = "l" }) {
    const inputSize = setSize(size);
    const [selectedFileName, setSelectedFileName] = useState("");
    const [showSuccessAlert, setShowSuccessAlert] = useState(false); 
    const [uploadError, setUploadError] = useState(null);
    const [imgSrc, setImgSrc] = useState("");
    const [newPhoto, setNewPhoto] = useState(false);
    const [takingPhoto, setTakingPhoto] = useState(false);
    const [errorState, setErrorState] = useState(required || "")

    // Funciones de llamada a las apis de upload
    const { uploadFile, uploadBase64 } = useFileUploader(); 

    // Valor por defecto en update
    useEffect(() => {
        setSelectedFileName(defaultFile);
    }, [defaultFile]);

    const handleFileChange = async (e) => {
        if (readOnly) return;
        const file = e.target.files[0];
        setSelectedFileName(file ? file.name : "");

        if (!allowedTypes.includes(getFileExtension(file.name))) {
            setErrorState(`Tipo de archivo inválido. Solo se permiten ${allowedTypes.join(', ')}.`);
            return;
        }

        if (file) {
            try {
                const fileData = await uploadFile(file, subDirectory);
                if (fileData.success) {
                    // si hay funcion de validacion afterLoad la ejecuta
                    let validateAfterStatus = {ok: true, msg: ""};
                    if (validateAfterFn) validateAfterStatus = await validateAfterFn(fileData.fileName);
                    if (validateAfterStatus.ok) { // Validacion aprobada
                        setErrorState("");
                        setSelectedFileName(fileData.fileName);
                        setShowSuccessAlert(true);
                        // guarda en el campo asociado oculto (setValue(campoOculto,nombreArchivoGuardado))
                        storage.setFunc(storage.field, fileData.responseData.filename);
                        // y eventualmente en el estado
                        if (storage.setState) storage.setState(fileData.responseData.filename)
                    } else { // Error de Validacion post upload
                        setUploadError(validateAfterStatus.msg);
                        // limpia el campo asociado oculto (setValue(campoOculto,nombreArchivoGuardado)) y eventualmente limpia tambien el estado asociado
                        storage.setFunc(storage.field, "");
                        if (storage.setState) storage.setState("");
                        setErrorState(validateAfterStatus.msg);  
                    }                    
                } else {  // Error de Upload
                    setErrorState(fileData.error)
                    setUploadError(`(${fileData.statusCode}) - ${fileData.error}`);
                    storage.setFunc(storage.field, "");
                    if (storage.setState) storage.setState("")
                }
            } catch (error) {
                setErrorState("Error al cargar el archivo")
                setUploadError("Error al cargar el archivo"); 
                storage.setFunc(storage.field, "");
                if (storage.setState) storage.setState("")
            } 
        }
    };

    useEffect(() => {
        async function savePhoto(){
            try {
                const fileData = await uploadBase64(imgSrc);
                if (fileData.success) {
                    //TODO: Implementar validateAfterFn:
                    //     let validateAfterStatus = {ok: true, msg: ""};
                    //     if (validateAfterFn) validateAfterStatus = await validateAfterFn(fileData.fileName);
                    //     if (validateAfterStatus.ok) { // Validacion aprobada
                    setErrorState("");
                    const fileName = fileData.fileName;
                    storage.setFunc(storage.field, fileName);
                    if (storage.setState) storage.setState(fileName)
                    setSelectedFileName(fileName);
                    setShowSuccessAlert(true);
                } else {
                    setErrorState(fileData.error)
                    setSelectedFileName("");
                    setUploadError(`(${fileData.statusCode}) - ${fileData.error}`);
                    storage.setFunc(storage.field, "");
                    if (storage.setState) storage.setState("")
                }
            }catch (error){
                setErrorState("Error al cargar la foto")
                setSelectedFileName("");
                setUploadError("Error al cargar la foto"); 
                storage.setFunc(storage.field, "");
                if (storage.setState) storage.setState("")
            }
        }

        if (newPhoto) {
            savePhoto();
            setNewPhoto(false)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newPhoto, storage, uploadBase64])

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

                        {uploadError && (
                            <StdSnackAlert
                                open={Boolean(uploadError)}
                                close={() => setUploadError(null)}
                                text={`${label} - ${uploadError}`}
                                severity="error"
                            />
                        )}
                        {(!uploadError && selectedFileName) && (
                            <StdSnackAlert  open={showSuccessAlert} 
                                close= {() => setShowSuccessAlert(false)}
                                text= {`Archivo cargado: ${selectedFileName}`}
                                severity="success"/>
                        )}
                        </>
                    );
                }}
                name={name}
                control={control}
                defaultValue=""
                rules={{validate: {noError: () => {
                    console.log("Name: ", name, "   errorState: ", errorState); 
                    return errorState == "" || errorState
                }}}}
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
    validateAfterFn: PropTypes.func,          // funcion async de validacion post carga (usa paramentro filename) permite llamada al server para trabajar sobre el archivo levantado
                                              // la funcin debe devolver {ok: bool, msg: string }
                                              // ejemplos: validar con IA o validar que una planilla excel tenga cierta info
    allowedTypes: PropTypes.array,            // array con tipos de archivos permitidos por defecto es all
    required: PropTypes.string
};
