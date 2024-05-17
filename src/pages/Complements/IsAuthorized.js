const neededRights = {
    Monitor: 4,
    Users: 8,
    Inicio: 4,
    Retail: 2
}

export function isAuthorized(loggedUser, module){

    if (!(module in neededRights)) {
        console.error(`isAuthorized: El módulo ${module} no esta contemplado`)
        return false;
    }

    const level = parseInt(loggedUser?.user?.derechos, 2);
    if (level >= neededRights[module]) return true;
    return false;
}