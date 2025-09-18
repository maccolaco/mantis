// ==============================|| OVERRIDES - ICON BUTTON ||============================== //

export default function IconButton(theme, textSizeScale = 1) {
  return {
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          '&.MuiIconButton-loading': {
            pointerEvents: 'none !important',
            '& svg': {
              width: 'inherit !important',
              height: 'inherit !important'
            }
          }
        },
        sizeLarge: {
          width: theme.spacing(5.5 * textSizeScale),
          height: theme.spacing(5.5 * textSizeScale),
          fontSize: `${1.25 * textSizeScale}rem`
        },
        sizeMedium: {
          width: theme.spacing(4.5 * textSizeScale),
          height: theme.spacing(4.5 * textSizeScale),
          fontSize: `${1 * textSizeScale}rem`
        },
        sizeSmall: {
          width: theme.spacing(3.75 * textSizeScale),
          height: theme.spacing(3.75 * textSizeScale),
          fontSize: `${0.75 * textSizeScale}rem`
        }
      }
    }
  };
}
