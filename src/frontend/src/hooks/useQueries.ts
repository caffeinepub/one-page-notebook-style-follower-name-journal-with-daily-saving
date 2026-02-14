import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { UserRole } from '../backend';

interface UserProfile {
  name: string;
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const role = await actor.getCallerUserRole();
      if (role === UserRole.guest) return null;
      return { name: 'User' };
    },
    enabled: !!actor && !actorFetching && !!identity && !identity.getPrincipal().isAnonymous(),
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      const principal = identity?.getPrincipal();
      if (!principal) throw new Error('Not authenticated');
      await actor.assignCallerUserRole(principal, UserRole.user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['currentUserProfile'],
      });
    },
  });
}
