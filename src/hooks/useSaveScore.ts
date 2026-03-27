import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../config/supabaseClient.config';

export const useSaveScore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newScore: { username: string; score: number; solved: string, level: number }) => {
      const { data, error } = await supabase
        .from('leaderboard')
        .insert([newScore]);

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      // Refresh the leaderboard automatically
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
  });
};