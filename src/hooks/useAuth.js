import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../config/supabaseClient.config";
import { adjectives, animals, uniqueNamesGenerator } from "unique-names-generator";
import { useEffect } from "react";

export const useAuth = () => {
  const queryClient = useQueryClient();

  // Get Session
  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  // Get Profile (Handle the "Not Found" state gracefully)
  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ['profile', session?.user?.id],
    enabled: !!session?.user?.id,
    retry: false, // Don't retry if the profile isn't there yet
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('user_id', session?.user.id)
        .maybeSingle(); // maybeSingle returns null instead of an error if not found
      
      if (error) throw error;
      return data;
    },
  });

  // Mutation to Register/Create Profile
  const { mutate: registerAnonymously, isPending: isRegistering } = useMutation({
    mutationFn: async () => {
      const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
      if (authError) throw authError;

      const user = authData.user;
      const username = uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
        separator: '-',
        length: 2,
      }) + `-${Math.floor(Math.random() * 100)}`;

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ user_id: user.id, username }]);
      
      if (profileError) throw profileError;
      return { user, username };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  // auto-trigger registration if session exists but profile is missing
  useEffect(() => {
    if (!sessionLoading && !profileLoading && session && !profile) {
      registerAnonymously();
    }
  }, [session, profile, sessionLoading, profileLoading, registerAnonymously]);

  return {
    user: session?.user,
    username: profile?.username,
    // Add profileLoading to your global loading state
    isLoading: sessionLoading || profileLoading || isRegistering,
    registerAnonymously
  };
};