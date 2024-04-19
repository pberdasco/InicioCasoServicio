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

export function StdLoadFile({ label = "Seleccionar Archivo o tomar una foto", name, control, size = "l", 
                              errors, helperText=" ",  photo = true, defaultFile = "", readOnly = false, 
                              toolTip="Con los botones, seleccione un archivo con la imagen o tome una foto", storage, 
                              subDirectory = "", validateAfterFn = null, setError, allowedTypes=["all"] }) {
    const inputSize = setSize(size);

    const [selectedFileName, setSelectedFileName] = useState("");
    const [showSuccessAlert, setShowSuccessAlert] = useState(false); 
    const [uploadError, setUploadError] = useState(null);
    const [imgSrc, setImgSrc] = useState("");
    const [newPhoto, setNewPhoto] = useState(false);
    const [takingPhoto, setTakingPhoto] = useState(false);

    const { uploadFile, uploadBase64 } = useFileUploader(); 

    useEffect(() => {
        setSelectedFileName(defaultFile);
    }, [defaultFile]);

    const handleFileChange = async (e) => {
        if (readOnly) return;
        const file = e.target.files[0];
        setSelectedFileName(file ? file.name : "");

        if (file) {
            try {
                const fileData = await uploadFile(file, subDirectory);
                if (fileData.success) {
                    // si hay funcion de validacion afterLoad la ejecuta
                    let validateAfterStatus = {ok: true, msg: ""};
                    if (validateAfterFn) validateAfterStatus = await validateAfterFn(fileData.fileName);
                    if (validateAfterStatus.ok) { // Validacion aprobada
                        setSelectedFileName(fileData.fileName);
                        setShowSuccessAlert(true);
                        // guarda en el campo asociado oculto (setValue(campoOculto,nombreArchivoGuardado))
                        storage.setFunc(storage.field, fileData.responseData.filename);
                        // y eventualmente en el estado
                        if (storage.setState) storage.setState(fileData.responseData.filename)
                    } else { // Error de Validacion post upload
                        setSelectedFileName("");
                        setUploadError(validateAfterStatus.msg);
                        // limpia el campo asociado oculto (setValue(campoOculto,nombreArchivoGuardado))
                        storage.setFunc(storage.field, "");
                        // y eventualmente limpia tambien el estado asociado
                        console.log("Name:",name, "  Campo asociado:",storage.field)
                        if (storage.setState) storage.setState("")
                        setError(name, {
                            type: 'custom',
                            message: validateAfterStatus.msg,
                        })
                        console.log("Errors: ", errors, errors[name], errors[storage.field])
                    }                    
                } else {  // Error de Upload
                    setSelectedFileName("");
                    setUploadError(`(${fileData.statusCode}) - ${fileData.error}`);
                    storage.setFunc(storage.field, "");
                    if (storage.setState) storage.setState("")
                }
            } catch (error) {
                setSelectedFileName("");
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
                    const fileName = fileData.fileName;
                    storage.setFunc(storage.field, fileName);
                    if (storage.setState) storage.setState(fileName)
                    setSelectedFileName(fileName);
                    setShowSuccessAlert(true);
                } else {
                    setSelectedFileName("");
                    setUploadError(`(${fileData.statusCode}) - ${fileData.error}`);
                    storage.setFunc(storage.field, "");
                    if (storage.setState) storage.setState("")
                }
            }catch (error){
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
                render={({ field }) => {
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
                                    helperText={errors[name] ? errors[name]?.message : helperText}
                                    readOnly
                                    fullWidth
                                />
                            </Tooltip>
                            <label htmlFor={name}>
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
                        {selectedFileName && (
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
    setError: PropTypes.func,                 // funcion de react-hook-form para setear error en el campo cuando falla validateAfterFn  
    allowedTypes: PropTypes.array             // array con tipos de archivos permitidos por defecto es all
};
