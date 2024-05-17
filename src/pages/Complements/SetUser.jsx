import { useGeneralContext } from '../../Context/GeneralContextHook';
import { useEffect } from 'react';

/**
 * Busca en localStorage si esta logueado y setea el estado en loggedUser en el contexto General
 * @returns {void}
 */
export function SetUser() {
    const {setloggedUser} = useGeneralContext()
    
    useEffect(() => {
        const logged = JSON.parse(window.localStorage.getItem('loggedUser'));
        setloggedUser(logged);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
    )    
    
} 