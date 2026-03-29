import { useQuery } from '@tanstack/react-query';
import { supabase } from '../config/supabaseClient.config';
import { useAuth } from './useAuth';

export const useMyScores = () => {
    const { user } = useAuth();
    const uid = user?.id;
    
  return useQuery({
    queryKey: ['leaderboard', uid],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .eq('user_id', uid)
        .order('score', { ascending: false })
        .limit(10);

      if (error) throw new Error(error.message);
      return data;
    },
    // Keep data fresh for 1 minute
    enabled: !!uid
  });
};