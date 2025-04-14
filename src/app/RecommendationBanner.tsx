// ------------------------------------------------
// 2. RecommendationBanner.tsx
// ------------------------------------------------
'use client';

import React from 'react';
import { Paper, Typography, Button, Box } from '@mui/material';
import { ThumbUp, ThumbDown } from '@mui/icons-material';

interface RecommendationBannerProps {
  trackTitle: string;
  reason: string;
  onAccept: () => void;
  onDismiss: () => void;
}

const RecommendationBanner: React.FC<RecommendationBannerProps> = ({
  trackTitle,
  reason,
  onAccept,
  onDismiss
}) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mb: 2,
        mx: 2,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        bgcolor: 'primary.light',
        color: 'white',
        borderRadius: 2
      }}
    >
      <Box sx={{ mb: { xs: 2, sm: 0 } }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          Recomendado para você: {trackTitle}
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
          Sugestão baseada em: {reason}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="contained"
          color="success"
          size="small"
          startIcon={<ThumbUp />}
          onClick={onAccept}
          sx={{ color: 'white' }}
        >
          Ouvir
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<ThumbDown />}
          onClick={onDismiss}
          sx={{ color: 'white', borderColor: 'white' }}
        >
          Ignorar
        </Button>
      </Box>
    </Paper>
  );
};

export default RecommendationBanner;
