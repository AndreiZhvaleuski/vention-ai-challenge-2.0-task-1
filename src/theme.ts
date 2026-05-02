import { createTheme } from '@mui/material/styles';

export const colors = {
  accent: '#0ea5e9',
} as const;

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f5f5f5',
    },
  },
  components: {
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': { backgroundColor: 'transparent !important' },
          '&.Mui-selected:hover': { backgroundColor: 'rgba(0,0,0,0.04) !important' },
        },
      },
    },
  },
});

export default theme;
