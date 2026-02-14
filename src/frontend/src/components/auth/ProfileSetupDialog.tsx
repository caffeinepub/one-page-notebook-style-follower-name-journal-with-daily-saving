import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface ProfileSetupDialogProps {
  open: boolean;
  onSave: (name: string) => void;
  isSaving: boolean;
}

export default function ProfileSetupDialog({
  open,
  onSave,
  isSaving,
}: ProfileSetupDialogProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Welcome!</DialogTitle>
            <DialogDescription>
              Please enter your name to get started with your followers journal.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="name" className="mb-2 block">
              Your Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSaving}
              autoFocus
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!name.trim() || isSaving}>
              {isSaving ? 'Saving...' : 'Continue'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
