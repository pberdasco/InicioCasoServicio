import PropTypes from 'prop-types';
// import styles from './StdTakePhoto.modules.css';                                  
import { useRef, useCallback, useState } from "react";
import Modal from "@mui/material/Modal";
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Webcam from "react-webcam";

const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
const screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;


export function StdTakePhoto({setNewPhoto, setImgSrc, takingPhoto, setTakingPhoto}) {
    const webcamRef = useRef(null);
    const [photo, setPhoto] = useState("");
    const [cameraReady, setCameraReady] = useState(false);

    const videoConstraints = {
        width:  screenWidth < 600 ? screenWidth - 8 : 560,
        height: screenHeight < 600 ? screenHeight - 62 : 560,
        facingMode: "environment"   //user
      };

    const retake = () => {
        setCameraReady(false);
        setPhoto("");
    };

    const finishTakingPhoto = () => {
        if (photo !== "") setImgSrc(photo);
        setNewPhoto(true);
        setTakingPhoto(false);
    }

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();  // devuelve un base64
        setPhoto(imageSrc);
      }, [webcamRef, setPhoto]);


    return (
        <Modal open={takingPhoto} onClose={() => finishTakingPhoto()} >
        <div style={{backgroundColor: "transparent", width: "100%", height: "100%", textAlign: 'center', display:'flex', justifyContent: 'center'}}>
        {/* <div className={styles.photoContainer}> */}
            <div style={{width: videoConstraints.width + 8, height: videoConstraints.height + 48, backgroundColor: 'white'}}>
                {cameraReady || ( 
                    <div style={{position: 'relative'}}>
                        <div style={{position: 'absolute', top: '200px', width: '100%', height: '100%', backgroundColor: 'lightgray'}}>
                            <CircularProgress />
                            <h3>Esperando a que la cámara se inicialice...</h3>
                        </div>
                    </div>
                )} 
                <div style={{backgroundColor:'white', width: '100%', height: '100%', border: '4px darkgrey solid'}}>
                    {photo ?   (<img src={photo} alt="webcam" />) 
                                : 
                                (<Webcam 
                                videoConstraints={videoConstraints} ref={webcamRef} 
                                screenshotFormat="image/jpeg" screenshotQuality={0.8}
                                onUserMedia={() => {setCameraReady(true)}}
                                onUserMediaError={(err) => {console.log("Error al obtener acceso a la camara:", err)}}/>)
                    }
                                        
                    <div className="btn-container">
                        {cameraReady && (
                            <div style={{ display: 'flex', justifyContent: 'space-around' , backgroundColor: 'white', paddingBottom: '4px'}}>
                            {photo ? (
                                <>
                                <Button variant="contained" color="primary" type="button" size="large" onClick={retake}>Nueva</Button>
                                <Button variant="contained" color="primary" type="button" size="large" onClick={finishTakingPhoto}>Salir</Button>
                                </>
                            ) : (<>
                                <Button variant="contained" color="primary" type="button" size="large" onClick={capture}>Sacar Foto</Button> 
                                </>
                            )}
                            </div>
                        )}
                    </div>
                </div>
            </div> 
        </div>
        </Modal>
    );
}

StdTakePhoto.propTypes = {
    setNewPhoto: PropTypes.func.isRequired,        // para setear cuando efectivamente se tomo una foto 
    setImgSrc: PropTypes.func.isRequired,          // para enviar la foto en el estaado imgSrc 
    takingPhoto: PropTypes.bool.isRequired,        // estado del llamador que indica si esta en modo tomar foto (modal abierta)
    setTakingPhoto: PropTypes.func.isRequired 
} 