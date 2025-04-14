// src/app/layout.tsx
'use client'; // Adicione esta linha no topo

import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../themes/theme';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
       <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}