// ==============================|| OVERRIDES - TABLE CELL ||============================== //

export default function TableCell(theme, textSizeScale = 1) {
  const commonCell = {
    '&:not(:last-of-type)': {
      position: 'relative',
      '&.MuiTableCell-stickyHeader': {
        position: 'sticky'
      },
      '&:after': {
        position: 'absolute',
        content: '""',
        backgroundColor: theme.palette.divider,
        width: 1,
        height: 'calc(100% - 30px)',
        right: 0,
        top: 16
      }
    }
  };

  return {
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: `${0.875 * textSizeScale}rem`,
          padding: 12 * textSizeScale,
          borderColor: theme.palette.divider,
          '&.cell-right': {
            justifyContent: 'flex-end',
            textAlign: 'right',
            '& > *': {
              justifyContent: 'flex-end',
              margin: '0 0 0 auto'
            },
            '& .MuiOutlinedInput-input': {
              textAlign: 'right'
            }
          },
          '&.cell-center': {
            justifyContent: 'center',
            textAlign: 'center',
            '& > *': {
              justifyContent: 'center',
              margin: '0 auto'
            }
          }
        },
        sizeSmall: {
          padding: 8 * textSizeScale
        },
        head: {
          fontSize: `${0.75 * textSizeScale}rem`,
          fontWeight: 700,
          textTransform: 'uppercase',
          ...commonCell
        },
        footer: {
          fontSize: `${0.75 * textSizeScale}rem`,
          textTransform: 'uppercase',
          ...commonCell
        }
      }
    }
  };
}
