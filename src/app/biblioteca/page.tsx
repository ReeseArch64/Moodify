// src/app/biblioteca/page.tsx
import React from 'react';
import { Typography } from '@mui/material';

export default function BibliotecaPage() {
  return (
    <div style={{ padding: 16 }}>
      <Typography variant="h6">Biblioteca</Typography>
      <Typography variant="body1">Aqui estão suas faixas salvas e playlists.</Typography>
    </div>
  );
}