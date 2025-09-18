import PropTypes from 'prop-types';

// material-ui
import IconButton from '@mui/material/IconButton';

// project imports
import DrawerHeaderStyled from './DrawerHeaderStyled';
import { handlerDrawerOpen } from 'api/menu';

// assets
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

// ==============================|| DRAWER HEADER ||============================== //

export default function DrawerHeader({ open }) {
  return (
    <DrawerHeaderStyled
      open={open}
      sx={{
        minHeight: '60px',
        width: 'initial',
        paddingTop: '8px',
        paddingBottom: '8px',
        paddingLeft: open ? '24px' : 0
      }}
    >
      <IconButton
        aria-label="toggle drawer"
        onClick={() => handlerDrawerOpen(!open)}
        color="secondary"
        variant="light"
        sx={(theme) => ({
          color: 'text.primary',
          bgcolor: 'grey.100',
          ...theme.applyStyles('dark', { bgcolor: 'background.default' })
        })}
      >
        {!open ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </IconButton>
    </DrawerHeaderStyled>
  );
}

DrawerHeader.propTypes = { open: PropTypes.bool };
