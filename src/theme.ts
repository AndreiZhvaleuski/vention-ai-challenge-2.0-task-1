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
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#f5f5f5',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': { backgroundColor: 'rgba(0,0,0,0.08) !important' },
          '&.Mui-selected:hover': { backgroundColor: '#ffffff !important' },
          '&:hover': { backgroundColor: '#ffffff !important' },
        },
      },
    },
  },
});

export default theme;
