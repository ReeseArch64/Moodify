'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, IconButton, TextField, Collapse, Chip } from '@mui/material';
import { 
  SmartToy, 
  Close, 
  Send, 
  Psychology, 
  SelfImprovement, 
  Opacity, 
  NightsStay 
} from '@mui/icons-material';


// Interface para definir a estrutura das faixas de áudio
interface AudioTrack {
  id: string;
  title: string;
  description: string;
  category: string;
  audioUrl: string;
  imageUrl?: string;
}

// Interface para a recomendação gerada pela IA
interface Recommendation {
  trackId: string;
  reason: string;
}

// Propriedades que o componente AiAssistant recebe
interface AiAssistantProps {
  tracks: AudioTrack[];
  onRecommendation: (recommendation: Recommendation) => void;
  playHistory: string[];
}

// Função para analisar o texto do usuário e detectar seu estado emocional
function analyzeUserMood(text: string): 'focus' | 'relax' | null {
  // Versão simples: procura por palavras-chave
  const text_lower = text.toLowerCase();
  
  // Palavras relacionadas a concentração/foco
  const focusKeywords = ['concentra', 'foco', 'produtiv', 'trabalh', 'estud'];
  
  // Palavras relacionadas a relaxamento
  const relaxKeywords = ['relax', 'descans', 'estress', 'calm', 'tranquil'];
  
  // Verifica se alguma palavra de foco está presente
  for (const keyword of focusKeywords) {
    if (text_lower.includes(keyword)) {
      return 'focus';
    }
  }
  
  // Verifica se alguma palavra de relaxamento está presente
  for (const keyword of relaxKeywords) {
    if (text_lower.includes(keyword)) {
      return 'relax';
    }
  }
  
  // Se não encontrar nenhuma palavra-chave
  return null;
}

// Função principal do componente de Assistente IA
const AiAssistant: React.FC<AiAssistantProps> = ({ tracks, onRecommendation, playHistory }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>('');
  const [conversation, setConversation] = useState<{speaker: 'user' | 'ai', text: string}[]>([]);
  
  // Abrir automaticamente o chat após 10 segundos na primeira visita
  useEffect(() => {
    const hasSeenAssistant = localStorage.getItem('has_seen_assistant');
    
    if (!hasSeenAssistant) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        
        // Mensagem inicial do assistente
        setConversation([
          { 
            speaker: 'ai', 
            text: "Olá! Sou seu assistente de bem-estar. Posso ajudar a encontrar o conteúdo perfeito para seu momento. Como está se sentindo hoje?" 
          }
        ]);
        
        localStorage.setItem('has_seen_assistant', 'true');
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Função para gerar uma recomendação baseada no texto do usuário
  const generateRecommendation = (text: string): Recommendation | null => {
    // Analisar o humor do usuário pelo texto
    const mood = analyzeUserMood(text);
    
    // Se não conseguiu determinar o humor, usa o horário do dia
    let category = mood === 'focus' ? 'Foco' : 
                 mood === 'relax' ? 'Relaxar' : 
                 getTimeBasedCategory();
    
    // Filtra as faixas pela categoria
    let filteredTracks = tracks.filter(track => track.category === category);
    
    // Se não houver faixas na categoria, usa todas as faixas
    if (filteredTracks.length === 0) {
      filteredTracks = tracks;
    }
    
    // Prioriza faixas que não foram ouvidas recentemente
    const unplayedTracks = filteredTracks.filter(track => !playHistory.includes(track.id));
    
    // Se houver faixas não ouvidas, usa-as; caso contrário, usa todas da categoria
    const recommendableTracks = unplayedTracks.length > 0 ? unplayedTracks : filteredTracks;
    
    // Escolhe uma faixa aleatória
    const selectedTrack = recommendableTracks[Math.floor(Math.random() * recommendableTracks.length)];
    
    if (!selectedTrack) return null;
    
    // Determina a razão da recomendação
    const reason = mood ? 
      `seu estado atual (${mood === 'focus' ? 'concentração' : 'relaxamento'})` : 
      `horário do dia (${getCurrentTimePeriod()})`;
    
    return {
      trackId: selectedTrack.id,
      reason
    };
  };

  // Função para obter a categoria com base na hora do dia
  function getTimeBasedCategory(): string {
    const hour = new Date().getHours();
    
    // Manhã e tarde: Foco
    if (hour >= 7 && hour < 19) {
      return 'Foco';
    } 
    // Noite: Relaxar
    else {
      return 'Relaxar';
    }
  }
  
  // Função para obter o período do dia como texto
  function getCurrentTimePeriod(): string {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return 'manhã';
    } else if (hour >= 12 && hour < 18) {
      return 'tarde';
    } else if (hour >= 18 && hour < 22) {
      return 'noite';
    } else {
      return 'madrugada';
    }
  }

  // Função chamada quando o usuário envia uma mensagem
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userInput.trim()) return;
    
    // Adiciona a mensagem do usuário à conversa
    const updatedConversation = [
      ...conversation,
      { speaker: 'user' as const, text: userInput }
    ];
    setConversation(updatedConversation);
    
    // Gera uma recomendação
    const recommendation = generateRecommendation(userInput);
    
    // Prepara a resposta do assistente
    let responseText = '';
    
    if (recommendation) {
      const track = tracks.find(t => t.id === recommendation.trackId);
      
      if (track) {
        responseText = `Baseado no que você disse, recomendo "${track.title}". Esta sugestão foi baseada em ${recommendation.reason}.`;
        
        // Envia a recomendação para o componente pai
        onRecommendation(recommendation);
      } else {
        responseText = "Entendo! Infelizmente não consegui encontrar uma recomendação específica para você neste momento. Que tal explorar algumas de nossas faixas populares?";
      }
    } else {
      responseText = "Entendo! Infelizmente não consegui encontrar uma recomendação específica para você neste momento. Que tal explorar algumas de nossas faixas populares?";
    }
    
    // Adiciona a resposta do assistente à conversa (com um pequeno delay para simular processamento)
    setTimeout(() => {
      setConversation([
        ...updatedConversation,
        { speaker: 'ai' as const, text: responseText }
      ]);
    }, 500);
    
    // Limpa o campo de entrada
    setUserInput('');
  };

  return (
    <>
      {/* Botão do assistente */}
      <IconButton 
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          position: 'fixed',
          bottom: 80,
          right: 20,
          backgroundColor: 'primary.main',
          color: 'white',
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
          zIndex: 1001
        }}
      >
        <SmartToy />
      </IconButton>
      
      {/* Janela do chat */}
      <Collapse in={isOpen} timeout="auto">
        <Paper
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 20,
            width: 300,
            maxHeight: 500, // Aumentado para acomodar os chips
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            boxShadow: 3,
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          {/* Cabeçalho do chat */}
          <Box
            sx={{
              p: 1,
              bgcolor: 'primary.main',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography variant="subtitle1">Assistente de Bem-estar</Typography>
            <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          </Box>
          
          {/* Área de conversa */}
          <Box
            sx={{
              p: 2,
              height: 300,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}
          >
            {conversation.map((message, index) => (
              <Box
                key={index}
                sx={{
                  alignSelf: message.speaker === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%'
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    bgcolor: message.speaker === 'user' ? 'primary.light' : 'grey.100',
                    color: message.speaker === 'user' ? 'white' : 'text.primary',
                    borderRadius: 2
                  }}
                >
                  <Typography variant="body2">{message.text}</Typography>
                </Paper>
              </Box>
            ))}
          </Box>
          
          {/* Área de input */}
          <Box 
            component="form" 
            onSubmit={handleSubmit}
            sx={{
              p: 1,
              bgcolor: 'background.paper',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Como está se sentindo hoje?"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              variant="outlined"
            />
            <IconButton type="submit" color="primary">
              <Send />
            </IconButton>
          </Box>

          {/* Chips de Acesso Rápido */}
          <Box
            sx={{
              p: 1,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              justifyContent: 'center',
              borderTop: '1px solid rgba(0, 0, 0, 0.12)'
            }}
          >
            <Chip 
              icon={<Psychology />} 
              label="Preciso focar" 
              size="small"
              onClick={() => {
                setUserInput('Preciso me concentrar em uma tarefa importante');
                setTimeout(() => {
                  handleSubmit(new Event('submit') as any);
                }, 100);
              }}
              color="primary"
              variant="outlined"
            />
            <Chip 
              icon={<SelfImprovement />} 
              label="Estou estressado" 
              size="small"
              onClick={() => {
                setUserInput('Estou me sentindo estressado hoje');
                setTimeout(() => {
                  handleSubmit(new Event('submit') as any);
                }, 100);
              }}
              color="primary" 
              variant="outlined"
            />
            <Chip 
              icon={<Opacity />} 
              label="Quero relaxar" 
              size="small"
              onClick={() => {
                setUserInput('Preciso relaxar um pouco');
                setTimeout(() => {
                  handleSubmit(new Event('submit') as any);
                }, 100);
              }}
              color="primary"
              variant="outlined"
            />
            <Chip 
              icon={<NightsStay />} 
              label="Preciso dormir" 
              size="small" 
              onClick={() => {
                setUserInput('Tenho dificuldade para dormir');
                setTimeout(() => {
                  handleSubmit(new Event('submit') as any);
                }, 100);
              }}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Paper>
      </Collapse>
    </>
  );
};

export default AiAssistant;