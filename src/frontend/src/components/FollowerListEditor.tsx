import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FollowerListEditorProps {
  followers: string[];
  onChange: (followers: string[]) => void;
  disabled?: boolean;
}

export default function FollowerListEditor({
  followers,
  onChange,
  disabled = false,
}: FollowerListEditorProps) {
  const [newFollowerName, setNewFollowerName] = useState('');

  const handleAddFollower = () => {
    const trimmed = newFollowerName.trim();
    if (trimmed) {
      onChange([...followers, trimmed]);
      setNewFollowerName('');
    }
  };

  const handleRemoveFollower = (index: number) => {
    onChange(followers.filter((_, i) => i !== index));
  };

  const handleEditFollower = (index: number, newValue: string) => {
    const updated = [...followers];
    updated[index] = newValue;
    onChange(updated);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddFollower();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-semibold text-notebook-ink handwriting-subtitle">
          Today's Followers
        </h2>
        <span className="text-sm text-notebook-ink/60">({followers.length})</span>
      </div>

      {/* Add New Follower */}
      <div className="flex gap-2 mb-6">
        <Input
          type="text"
          placeholder="Enter follower name..."
          value={newFollowerName}
          onChange={(e) => setNewFollowerName(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          className="notebook-input flex-1"
        />
        <Button
          onClick={handleAddFollower}
          disabled={!newFollowerName.trim() || disabled}
          size="icon"
          className="notebook-button-icon"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Follower List */}
      <div className="space-y-2">
        {followers.length === 0 ? (
          <div className="text-center py-12 text-notebook-ink/50 italic">
            No followers added yet. Start by adding a name above!
          </div>
        ) : (
          followers.map((follower, index) => (
            <div
              key={index}
              className="flex items-center gap-2 group notebook-line py-2"
            >
              <span className="text-notebook-ink/40 text-sm w-8 flex-shrink-0">
                {index + 1}.
              </span>
              <Input
                type="text"
                value={follower}
                onChange={(e) => handleEditFollower(index, e.target.value)}
                disabled={disabled}
                className="notebook-input-inline flex-1"
              />
              <Button
                onClick={() => handleRemoveFollower(index)}
                disabled={disabled}
                size="icon"
                variant="ghost"
                className="opacity-0 group-hover:opacity-100 transition-opacity notebook-button-remove"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
