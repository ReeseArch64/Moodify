import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://stqdofgvtxfrfuepedct.supabase.co'; // Substitua pelo seu URL
const supabaseAnonKey = 'SUA_ANONeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0cWRvZmd2dHhmcmZ1ZXBlZGN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1NDE1NTUsImV4cCI6MjA1OTExNzU1NX0.-m7QIeWpaNnV_JQe_Uy9kWFXI3AgV8v1_1Y9nfCxxVw_KEY'; // Substitua pela sua chave

export const supabase = createClient(supabaseUrl, supabaseAnonKey);