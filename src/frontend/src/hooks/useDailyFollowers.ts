import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { DailyList } from '../backend';

export function useGetFollowersForDay(date: string) {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  return useQuery<DailyList>({
    queryKey: ['followers', date, identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getFollowersForDay(date);
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
  });
}

export function useSaveFollowersForDay() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ date, list }: { date: string; list: DailyList }) => {
      if (!actor) throw new Error('Actor not available');
      if (!identity || identity.getPrincipal().isAnonymous()) {
        throw new Error('Not authenticated');
      }
      await actor.saveFollowersForDay(date, list);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['followers', variables.date, identity?.getPrincipal().toString()],
      });
      // Also invalidate all followers query
      queryClient.invalidateQueries({
        queryKey: ['allFollowers'],
      });
    },
  });
}

// Hook to get all unique followers across all saved dates
export function useGetAllFollowers() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  return useQuery<string[]>({
    queryKey: ['allFollowers', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      // Get followers for the last 30 days to build the wall
      const today = new Date();
      const allFollowers: string[] = [];
      const uniqueNames = new Set<string>();
      
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        try {
          const dayFollowers = await actor.getFollowersForDay(dateStr);
          dayFollowers.forEach(name => {
            if (name.trim() && !uniqueNames.has(name.toLowerCase())) {
              uniqueNames.add(name.toLowerCase());
              allFollowers.push(name);
            }
          });
        } catch (error) {
          // Skip dates with no data
          continue;
        }
      }
      
      return allFollowers;
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}
