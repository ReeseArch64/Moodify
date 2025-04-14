import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark', // Mantém o tema escuro, se desejar
    primary: {
      main: '#800080', // Roxo como cor primária
    },
    secondary: {
      main: '#00FF00', // Verde como cor secundária para foco
    },
    background: {
      default: '#212121', // Fundo escuro padrão
      paper: '#424242',   // Fundo para cards
    },
  },
});

export default theme;