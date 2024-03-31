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

export function StdLoadFile({ label = "Seleccionar Archivo o tomar una foto", name, control, size = "l", photo = true,   
                              toolTip="Con los botones, seleccione un archivo con la imagen o tome una foto", storage, subDirectory = "" }) {
    const inputSize = setSize(size);

    const [selectedFileName, setSelectedFileName] = useState("");
    const [showSuccessAlert, setShowSuccessAlert] = useState(false); 
    const [uploadError, setUploadError] = useState(null);
    const [imgSrc, setImgSrc] = useState("");
    const [newPhoto, setNewPhoto] = useState(false);
    const [takingPhoto, setTakingPhoto] = useState(false);

    const { uploadFile, uploadBase64 } = useFileUploader(); 

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        setSelectedFileName(file ? file.name : "");

        if (file) {
            try {
                console.log("1: ", subDirectory)
                const fileData = await uploadFile(file, subDirectory);
                if (fileData.success) {
                    setSelectedFileName(fileData.fileName);
                    setShowSuccessAlert(true);
                    storage.setFunc(storage.field, fileData.responseData.filename);
                    if (storage.setState) storage.setState(fileData.responseData.filename)
                } else {
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
        setTakingPhoto(true);
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
                            onChange={async (e) => {
                                await handleFileChange(e);
                                field.onChange(e);
                            }}
                        />
                                
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip title={toolTip}  followCursor placement="top"> 
                                <TextField
                                    label={label}
                                    value={selectedFileName}
                                    variant = "standard"
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
                                    startIcon={<AddAPhotoIcon sx={{width: "28px", paddingLeft: "8px"}}/>}
                                    onClick={handleTakePhoto}
                                />
                            </Tooltip> 
                            )}                         
                        </div>

                        {takingPhoto && (
                            // <StdPrueba takingPhoto={takingPhoto} setTakingPhoto={setTakingPhoto}/>
                            <StdTakePhoto setImgSrc={setImgSrc} setNewPhoto={setNewPhoto} takingPhoto={takingPhoto} setTakingPhoto={setTakingPhoto}/>
                        )}        

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
    photo: PropTypes.bool,
    toolTip: PropTypes.node,
    size: PropTypes.oneOf(["s", "m", "l"]),
    storage: PropTypes.shape({
        setFunc: PropTypes.func.isRequired,   // usualemente el setvalue del useForm
        field: PropTypes.string,              // nombre del campo donde se va a guardar el nombre de archivo capturado
        setState: PropTypes.func              // funcion opcional para cargar un estado con el nombre del archivo cargado
    }).isRequired,
    subDirectory: PropTypes.string            // subdirectorio que se aplicara al directorio de grabación por defecto
};
