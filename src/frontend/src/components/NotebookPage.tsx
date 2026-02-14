import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FollowerListEditor from './FollowerListEditor';
import LoadSaveStatus from './LoadSaveStatus';
import { useGetFollowersForDay, useSaveFollowersForDay } from '../hooks/useDailyFollowers';
import { getTodayISO } from '../utils/date';
import { toast } from 'sonner';

export default function NotebookPage() {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayISO());
  const [followerNames, setFollowerNames] = useState<string[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const {
    data: savedFollowers,
    isLoading,
    isError,
    error,
  } = useGetFollowersForDay(selectedDate);

  const { mutate: saveFollowers, isPending: isSaving } = useSaveFollowersForDay();

  // Load saved data when it arrives or date changes
  useEffect(() => {
    if (savedFollowers !== undefined) {
      setFollowerNames(savedFollowers);
      setHasUnsavedChanges(false);
    }
  }, [savedFollowers, selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (hasUnsavedChanges) {
      const confirm = window.confirm(
        'You have unsaved changes. Are you sure you want to switch dates?'
      );
      if (!confirm) return;
    }
    setSelectedDate(e.target.value);
  };

  const handleFollowersChange = (newFollowers: string[]) => {
    setFollowerNames(newFollowers);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    saveFollowers(
      { date: selectedDate, list: followerNames },
      {
        onSuccess: () => {
          setHasUnsavedChanges(false);
          toast.success('Followers saved successfully!');
        },
        onError: (err) => {
          toast.error(`Failed to save: ${err.message}`);
        },
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="notebook-card p-8">
        {/* Date Selector */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Calendar className="w-5 h-5 text-notebook-ink/60" />
            <Input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="max-w-xs notebook-input"
              disabled={isSaving}
            />
          </div>
          <Button
            onClick={handleSave}
            disabled={!hasUnsavedChanges || isSaving}
            className="notebook-button"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>

        {/* Status Messages */}
        <LoadSaveStatus
          isLoading={isLoading}
          isError={isError}
          error={error}
          isSaving={isSaving}
        />

        {/* Follower List Editor */}
        {!isLoading && !isError && (
          <FollowerListEditor
            followers={followerNames}
            onChange={handleFollowersChange}
            disabled={isSaving}
          />
        )}

        {/* Unsaved Changes Indicator */}
        {hasUnsavedChanges && !isSaving && (
          <div className="mt-4 text-sm text-amber-600 italic">
            You have unsaved changes
          </div>
        )}
      </div>
    </div>
  );
}
