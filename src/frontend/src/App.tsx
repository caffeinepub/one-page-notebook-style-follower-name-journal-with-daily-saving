import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from './hooks/useQueries';
import LoginButton from './components/auth/LoginButton';
import ProfileSetupDialog from './components/auth/ProfileSetupDialog';
import NotebookPage from './components/NotebookPage';
import FollowerWall from './components/FollowerWall';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();

  const { mutate: saveProfile, isPending: savingProfile } = useSaveCallerUserProfile();

  const [showProfileSetup, setShowProfileSetup] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !profileLoading && isFetched && userProfile === null) {
      setShowProfileSetup(true);
    } else {
      setShowProfileSetup(false);
    }
  }, [isAuthenticated, profileLoading, isFetched, userProfile]);

  const handleProfileSave = (name: string) => {
    saveProfile(
      { name },
      {
        onSuccess: () => {
          setShowProfileSetup(false);
        },
      }
    );
  };

  // Clear all cached data when logging out
  useEffect(() => {
    if (!isAuthenticated) {
      queryClient.clear();
    }
  }, [isAuthenticated, queryClient]);

  return (
    <div className="min-h-screen notebook-background relative">
      {/* Great Follower Wall - Background Layer */}
      {isAuthenticated && !profileLoading && userProfile && (
        <FollowerWall />
      )}

      {/* Spiral binding on the left */}
      <div className="spiral-binding" />

      {/* Header */}
      <header className="relative z-10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-notebook-ink handwriting-title">
            My Followers Journal
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated && userProfile && (
            <span className="text-sm text-notebook-ink/70">
              Welcome, {userProfile.name}
            </span>
          )}
          <LoginButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 pb-12">
        {!isAuthenticated ? (
          <div className="max-w-2xl mx-auto mt-20 text-center">
            <div className="notebook-card p-12">
              <h2 className="text-3xl font-bold text-notebook-ink mb-4 handwriting-title">
                Welcome to Your Followers Journal
              </h2>
              <p className="text-notebook-ink/70 mb-8 text-lg">
                Keep track of your followers day by day. Login to start writing!
              </p>
              <LoginButton />
            </div>
          </div>
        ) : profileLoading ? (
          <div className="max-w-4xl mx-auto mt-12">
            <div className="notebook-card p-8">
              <div className="space-y-4">
                <div className="h-8 bg-notebook-ink/10 rounded animate-pulse" />
                <div className="h-32 bg-notebook-ink/10 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ) : (
          <NotebookPage />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 mt-12 text-center text-sm text-notebook-ink/60">
        <p>
          © {new Date().getFullYear()} · Built with ❤️ using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              window.location.hostname
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-notebook-ink/80 transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      {/* Profile Setup Dialog */}
      <ProfileSetupDialog
        open={showProfileSetup}
        onSave={handleProfileSave}
        isSaving={savingProfile}
      />

      <Toaster />
    </div>
  );
}
