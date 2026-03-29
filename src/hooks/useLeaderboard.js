import { useQuery } from '@tanstack/react-query';
import { supabase } from '../config/supabaseClient.config';

export const useLeaderboard = () => {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('level', { ascending: false})
        .order('score', { ascending: false })
        .limit(10);

      if (error) throw new Error(error.message);
      return data;
    },
    // Keep data fresh for 1 minute
    staleTime: 60000, 
  });
};