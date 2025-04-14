// ------------------------------------------------
// 4. HomePage.tsx (modificado com IA)
// ------------------------------------------------
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Typography, Card, CardContent, CardMedia, IconButton, BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import { LibraryMusic, Explore, AccountCircle, Favorite, FavoriteBorder, PlayArrow, Pause, SkipNext } from '@mui/icons-material';
import AiAssistant from './AiAssistant';
import RecommendationBanner from './RecommendationBanner';
import { UserPreferencesProvider, useUserPreferences } from './UserPreferences';

// Tipos e Dados
interface AudioTrack {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  imageUrl?: string;
  category: string;
}

interface Recommendation {
  trackId: string;
  reason: string;
}

const tracks: AudioTrack[] = [
  { id: "1", title: "Foco Profundo", description: "Ideal para concentração intensa.", audioUrl: "/audio/foco-profundo.mp3", imageUrl: "/images/foco.jpg", category: "Foco" },
  { id: "3", title: "Foco Profundo 2", description: "Ideal para concentração intensa.", audioUrl: "/audio/foco-profundo2.mp3", imageUrl: "/images/foco.jpg", category: "Foco" },
  { id: "2", title: "Relaxamento Leve", description: "Perfeito para pausas rápidas.", audioUrl: "/audio/relaxamento-leve.mp3", imageUrl: "/images/relaxar.jpg", category: "Relaxar" },
  { id: "4", title: "Relaxamento Leve 2", description: "Perfeito para pausas rápidas.", audioUrl: "/audio/relaxamento-leve.mp3", imageUrl: "/images/relaxar.jpg", category: "Relaxar" },
  { id: "5", title: "Relaxamento Leve 3", description: "Perfeito para pausas rápidas.", audioUrl: "/audio/relaxamento-leve.mp3", imageUrl: "/images/relaxar.jpg", category: "Relaxar" },
  { id: "6", title: "Foco Profundo 3", description: "Ideal para concentração intensa.", audioUrl: "/audio/foco-profundo3.mp3", imageUrl: "/images/foco.jpg", category: "Foco" },
  { id: "7", title: "Foco Profundo 4", description: "Ideal para concentração intensa.", audioUrl: "/audio/foco-profundo4.mp3", imageUrl: "/images/foco.jpg", category: "Foco" },
];

// Componente principal que usa o Provider de preferências
export default function HomePageWrapper() {
  return (
    <UserPreferencesProvider>
      <HomePage />
    </UserPreferencesProvider>
  );
}

function HomePage() {
  const { playHistory, addToPlayHistory, favorites, toggleFavorite } = useUserPreferences();
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeRecommendation, setActiveRecommendation] = useState<Recommendation | null>(null);

  const playTrack = (id: string) => {
    if (playingTrack === id && isPlaying) {
      setIsPlaying(false);
    } else {
      setPlayingTrack(id);
      setIsPlaying(true);
      // Adicionar ao histórico quando tocar uma faixa
      addToPlayHistory(id);
    }
  };

  const nextTrack = () => {
    const currentIndex = tracks.findIndex((track) => track.id === playingTrack);
    const nextIndex = (currentIndex + 1) % tracks.length;
    setPlayingTrack(tracks[nextIndex].id);
    setIsPlaying(true);
    // Adicionar ao histórico quando mudar de faixa
    addToPlayHistory(tracks[nextIndex].id);
  };

  // Manipular recomendações do assistente IA
  const handleRecommendation = (recommendation: Recommendation) => {
    setActiveRecommendation(recommendation);
  };

  // Aceitar recomendação (tocar a faixa)
  const acceptRecommendation = () => {
    if (activeRecommendation) {
      playTrack(activeRecommendation.trackId);
      setActiveRecommendation(null);
    }
  };

  // Dispensar recomendação
  const dismissRecommendation = () => {
    setActiveRecommendation(null);
  };

  const tracksByCategory = tracks.reduce((acc, track) => {
    if (!acc[track.category]) acc[track.category] = [];
    acc[track.category].push(track);
    return acc;
  }, {} as Record<string, AudioTrack[]>);

  const categoryStyle = {
    display: 'flex',
    overflowX: 'auto',
    padding: '10px 0',
    gap: '16px',
  };

  return (
    <div style={{ paddingBottom: '100px' }}>
      {/* Cabeçalho */}
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>MeuSaaS</Typography>
          <Link href="/perfil">
            <Typography variant="body1" sx={{ color: 'primary.main' }}>Perfil</Typography>
          </Link>
        </Toolbar>
      </AppBar>

      {/* Banner de Recomendação (só aparece quando há uma recomendação ativa) */}
      {activeRecommendation && (
        <RecommendationBanner
          trackTitle={tracks.find(t => t.id === activeRecommendation.trackId)?.title || ''}
          reason={activeRecommendation.reason}
          onAccept={acceptRecommendation}
          onDismiss={dismissRecommendation}
        />
      )}

      {/* Faixas por Categoria */}
      {Object.entries(tracksByCategory).map(([category, categoryTracks]) => (
        <div key={category}>
          <Typography variant="h5" sx={{ padding: 2 }}>{category}</Typography>
          <div style={categoryStyle}>
            {categoryTracks.map((track) => (
              <Card key={track.id} sx={{ minWidth: 200, boxShadow: playingTrack === track.id ? '0 0 10px rgba(0, 255, 0, 0.5)' : 'none' }}>
                <CardMedia component="img" height="100" image={track.imageUrl} alt={track.title} />
                <CardContent>
                  <Typography variant="subtitle1">{track.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{track.description}</Typography>
                  <IconButton onClick={() => playTrack(track.id)}>
                    {playingTrack === track.id && isPlaying ? <Pause /> : <PlayArrow />}
                  </IconButton>
                  <IconButton onClick={() => toggleFavorite(track.id)}>
                    {favorites.includes(track.id) ? <Favorite color="error" /> : <FavoriteBorder />}
                  </IconButton>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Favoritos */}
      <Typography variant="h6" sx={{ padding: 2 }}>Seus Favoritos</Typography>
      {favorites.length > 0 ? (
        <div style={categoryStyle}>
          {favorites.map((favId) => {
            const favTrack = tracks.find((track) => track.id === favId);
            return favTrack ? (
              <Card key={favId} sx={{ minWidth: 200 }}>
                <CardMedia component="img" height="100" image={favTrack.imageUrl} alt={favTrack.title} />
                <CardContent>
                  <Typography variant="subtitle1">{favTrack.title}</Typography>
                  <IconButton onClick={() => playTrack(favTrack.id)}>
                    {playingTrack === favTrack.id && isPlaying ? <Pause /> : <PlayArrow />}
                  </IconButton>
                  <IconButton onClick={() => toggleFavorite(favTrack.id)}>
                    <Favorite color="error" />
                  </IconButton>
                </CardContent>
              </Card>
            ) : null;
          })}
        </div>
      ) : (
        <Typography variant="body2" sx={{ padding: 2, color: 'text.secondary' }}>
          Você ainda não tem favoritos. Explore e adicione suas faixas preferidas!
        </Typography>
      )}

      {/* Player Global */}
      {playingTrack && (
        <Box sx={{ position: 'fixed', bottom: 60, left: 0, right: 0, backgroundColor: '#1e1e1e', padding: '10px', zIndex: 1000 }}>
          <Typography variant="body1" color="white" sx={{ mb: 1 }}>
            {tracks.find((track) => track.id === playingTrack)?.title}
          </Typography>
          <audio
            controls
            autoPlay={isPlaying}
            src={tracks.find((track) => track.id === playingTrack)?.audioUrl}
            style={{ width: '100%' }}
            onEnded={nextTrack}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1 }}>
            <IconButton onClick={() => setIsPlaying(!isPlaying)} sx={{ color: 'white' }}>
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>
            <IconButton onClick={nextTrack} sx={{ color: 'white' }}>
              <SkipNext />
            </IconButton>
          </Box>
        </Box>
      )}

      {/* Navegação Inferior */}
      <BottomNavigation showLabels sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'background.paper' }}>
        <BottomNavigationAction label="Biblioteca" icon={<LibraryMusic />} component={Link} href="/biblioteca" />
        <BottomNavigationAction label="Explorar" icon={<Explore />} component={Link} href="/explorar" />
        <BottomNavigationAction label="Perfil" icon={<AccountCircle />} component={Link} href="/signin" />
      </BottomNavigation>

      {/* Assistente de IA */}
      <AiAssistant 
        tracks={tracks} 
        onRecommendation={handleRecommendation} 
        playHistory={playHistory} 
      />
    </div>
  );
}