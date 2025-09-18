// material-ui
import { createTheme } from '@mui/material/styles';

// third-party
import { presetPalettes } from '@ant-design/colors';

// project imports
import ThemeOption from './theme';

// ==============================|| DEFAULT THEME - PALETTE ||============================== //

export default function Palette(mode, presetColor) {
  const colors = presetPalettes;

  let greyPrimary = [
    '#ffffff',
    '#fafafa',
    '#f5f5f5',
    '#f0f0f0',
    '#d9d9d9',
    '#bfbfbf',
    '#8c8c8c',
    '#595959',
    '#262626',
    '#141414',
    '#000000'
  ];
  let greyAscent = ['#fafafa', '#bfbfbf', '#434343', '#1f1f1f'];
  let greyConstant = ['#fafafb', '#e6ebf1'];

  if (mode === 'dark') {
    greyPrimary = [
      '#000000',
      '#141414',
      '#1f1f1f',
      '#262626',
      '#434343',
      '#595959',
      '#8c8c8c',
      '#bfbfbf',
      '#d9d9d9',
      '#f0f0f0',
      '#ffffff'
    ];
    greyAscent = ['#1f1f1f', '#434343', '#bfbfbf', '#fafafa'];
    greyConstant = ['#121212', '#1e1e1e'];
  }

  colors.grey = [...greyPrimary, ...greyAscent, ...greyConstant];

  const paletteColor = ThemeOption(colors, presetColor, mode);

  return createTheme({
    palette: {
      mode,
      common: {
        black: '#000',
        white: '#fff'
      },
      ...paletteColor,
      text: {
        primary: mode === 'dark' ? paletteColor.grey[300] : paletteColor.grey[700],
        secondary: mode === 'dark' ? paletteColor.grey[500] : paletteColor.grey[500],
        disabled: mode === 'dark' ? paletteColor.grey[600] : paletteColor.grey[400]
      },
      action: {
        disabled: mode === 'dark' ? paletteColor.grey[600] : paletteColor.grey[300]
      },
      divider: mode === 'dark' ? paletteColor.grey[800] : paletteColor.grey[200],
      background: {
        paper: mode === 'dark' ? paletteColor.grey[900] : paletteColor.grey[0],
        default: mode === 'dark' ? paletteColor.grey[800] : paletteColor.grey.A50
      }
    }
  });
}
