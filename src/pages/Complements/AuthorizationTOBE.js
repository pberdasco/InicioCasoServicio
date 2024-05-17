/**
 * Compara los derechos de un loggedUser(mirando en el token) con los minimos requeridos por el proceso llamador
 * @param {object} loggedUser 
 * @param {string} option - "0000" que tipo de derechos minimos requiere el proceso 
 * @returns {boolean}
 */
export function isAuthorized(loggedUser, option) {
    // TODO: probablemente sea mejor armar el core de esta funcion en el server
    // mandarle el usuario y la opcion a la que se quiere entrar y recibir si la validacion esta Ok. 
    // de esta forma no viajan los derechos.
    // El token no requiere la clave secreta para ver el contenido
    const base64Url = loggedUser.token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const usuario = JSON.parse(jsonPayload);

    //"1000" Admin, "0100" interno, "0010" Retail
    const nivelUsuario = parseInt(usuario.derechos, 2);
    const nivelOption = parseInt(option, 2);
    if (nivelUsuario >= nivelOption) return true;
    return false;
}