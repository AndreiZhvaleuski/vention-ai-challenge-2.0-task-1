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
});

export default theme;
