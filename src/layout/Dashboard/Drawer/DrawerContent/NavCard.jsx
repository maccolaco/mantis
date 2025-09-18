// material-ui
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';

// assets
import AnimateButton from 'components/@extended/AnimateButton';
import { TrophyFilled } from '@ant-design/icons';

// ==============================|| DRAWER CONTENT - NAVIGATION CARD ||============================== //

export default function NavCard() {
  return (
    <MainCard sx={{ bgcolor: 'grey.50', m: 3 }}>
      <Stack alignItems="center" spacing={2.5}>
        <TrophyFilled style={{ fontSize: '4rem', color: '#1677ff' }} />
        <Stack alignItems="center">
          <Typography variant="h5">Portfolio Pro</Typography>
          <Typography variant="h6" color="secondary">
            Advanced Analytics
          </Typography>
        </Stack>
        <AnimateButton>
          <Button variant="contained" color="success" size="small">
            Upgrade
          </Button>
        </AnimateButton>
      </Stack>
    </MainCard>
  );
}
