'use client';

import { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { TextField, Button, Box, Typography } from '@mui/material';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      // Redirecione ou atualize o estado após login bem-sucedido
      console.log('Login bem-sucedido');
      window.location.href = '/'; // Redireciona para a página inicial
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 8,
        p: 4,
        border: '1px solid #424242',
        borderRadius: 2,
        backgroundColor: '#212121',
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ color: '#00FF00' }}>
        Sign In
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <TextField
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ input: { color: '#FFFFFF' }, label: { color: '#FFFFFF' } }}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ input: { color: '#FFFFFF' }, label: { color: '#FFFFFF' } }}
      />
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2, backgroundColor: '#800080', '&:hover': { backgroundColor: '#9C27B0' } }}
        onClick={handleLogin}
      >
        Entrar
      </Button>
      <Button
        variant="outlined"
        fullWidth
        sx={{ mt: 1, color: '#00FF00', borderColor: '#00FF00' }}
        href="/signup" // Adicione uma rota para signup se desejar
      >
        Criar Conta
      </Button>
    </Box>
  );
}