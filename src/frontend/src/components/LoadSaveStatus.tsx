import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Loader2 } from 'lucide-react';

interface LoadSaveStatusProps {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isSaving: boolean;
}

export default function LoadSaveStatus({
  isLoading,
  isError,
  error,
  isSaving,
}: LoadSaveStatusProps) {
  if (isLoading) {
    return (
      <div className="space-y-3 mb-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load followers: {error?.message || 'Unknown error'}
        </AlertDescription>
      </Alert>
    );
  }

  if (isSaving) {
    return (
      <div className="flex items-center gap-2 text-sm text-notebook-ink/60 mb-6">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Saving your followers...</span>
      </div>
    );
  }

  return null;
}
