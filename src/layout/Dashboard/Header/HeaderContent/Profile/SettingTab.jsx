// material-ui
import FormControlLabel from '@mui/material/FormControlLabel';
import List from '@mui/material/List';
import Link from '@mui/material/Link';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import { useTheme } from 'contexts/ThemeContext';
import { useTextSize } from 'contexts/TextSizeContext';

// assets
import { CommentOutlined, LockOutlined, QuestionCircleOutlined, UserOutlined, UnorderedListOutlined, BulbFilled } from '@ant-design/icons';

// ==============================|| HEADER PROFILE - SETTING TAB ||============================== //

export default function SettingTab() {
  const { mode, toggleMode } = useTheme();
  const { textSizeLabel } = useTextSize();

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      <ListItemButton>
        <ListItemIcon>
          <BulbFilled />
        </ListItemIcon>
        <ListItemText primary="Dark Mode" />
        <Box sx={{ ml: 'auto' }}>
          <FormControlLabel
            control={
              <Switch
                checked={mode === 'dark'}
                onChange={toggleMode}
                size="small"
              />
            }
            label=""
            sx={{ m: 0 }}
          />
        </Box>
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <BulbFilled />
        </ListItemIcon>
        <ListItemText 
          primary="Text Size" 
          secondary={textSizeLabel}
        />
      </ListItemButton>
      <Link underline="none" sx={{ color: 'inherit' }} target="_blank" href="https://codedthemes.support-hub.io/">
        <ListItemButton>
          <ListItemIcon>
            <QuestionCircleOutlined />
          </ListItemIcon>
          <ListItemText primary="Support" />
        </ListItemButton>
      </Link>
      <ListItemButton>
        <ListItemIcon>
          <UserOutlined />
        </ListItemIcon>
        <ListItemText primary="Account Settings" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <LockOutlined />
        </ListItemIcon>
        <ListItemText primary="Privacy Center" />
      </ListItemButton>
      <Link underline="none" style={{ color: 'inherit' }} target="_blank" href="https://codedthemes.support-hub.io/">
        <ListItemButton>
          <ListItemIcon>
            <CommentOutlined />
          </ListItemIcon>
          <ListItemText primary="Feedback" />
        </ListItemButton>
      </Link>
      <ListItemButton>
        <ListItemIcon>
          <UnorderedListOutlined />
        </ListItemIcon>
        <ListItemText primary="History" />
      </ListItemButton>
    </List>
  );
}
