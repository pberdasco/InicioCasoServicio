import PropTypes from 'prop-types';

//TODO: ajustar este componente para que trabajar junto con ubicacionSerieSegunProducto(values) de FormGarantia y que traiga la 
//TODO: imagen correspondiente para buscar el nro de serie
export function DondeSerie({ubicacionSerie}){
    let imagen = "/DondeSerie.png";
    if (ubicacionSerie == "A") imagen = "/DondeSerieMicrocomp.png";
    if (ubicacionSerie == "B") imagen = "/DondeSerieTosta.png";

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',
            height: "400px", width: "400px", backgroundColor: "black", padding: "5%" }}>
            <div style={{ width: '350px', height: '350px', textAlign: 'center', zIndex: 1, position: 'absolute' }}>
                <h2>Buscar el numero de serie en:</h2>
                <img src={imagen} style={{width: '100%'} } alt="Imagen de Serie" />
            </div>
        </div>
    )
}

DondeSerie.propTypes = {
    ubicacionSerie: PropTypes.string.isRequired
} 