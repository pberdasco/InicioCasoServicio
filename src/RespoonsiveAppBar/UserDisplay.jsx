import { useGeneralContext } from '../Context/GeneralContextHook';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export function UserDisplay() {
    const {loggedUser} = useGeneralContext();

    return (
        <>
        {loggedUser && (
            <Box sx={{ flexGrow: 0, mr: 1 }}>
              <Typography variant="body1" sx={{ color: 'white' }}>
                {loggedUser?.user?.nombre}
              </Typography>
            </Box>
          )}
        </>
    )
}
    