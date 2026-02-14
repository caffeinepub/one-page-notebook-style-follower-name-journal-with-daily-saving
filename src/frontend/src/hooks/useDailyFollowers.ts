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
    },
  });
}
