// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';

// project imports
import Profile from './Profile';
import MobileSection from './MobileSection';

// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
      </Box>

      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </>
  );
}
