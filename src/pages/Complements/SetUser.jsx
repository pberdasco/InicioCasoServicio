import { useGeneralContext } from '../../Context/GeneralContextHook';
import { useEffect } from 'react';

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