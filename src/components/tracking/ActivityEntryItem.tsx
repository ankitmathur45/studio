
"use client";
import React, { useState } from 'react';
import type { ActivityEntry } from '@/types';
import { useHabits } from '@/contexts/HabitContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Edit3, Save, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActivityEntryItemProps {
  habitId: string;
  date: string;
  entry: ActivityEntry;
}

const ActivityEntryItem: React.FC<ActivityEntryItemProps> = ({ habitId, date, entry }) => {
  const { deleteActivityEntry, updateActivityEntryComment } = useHabits();
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(entry.comment || '');

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this activity entry?')) {
      deleteActivityEntry(habitId, date, entry.id);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    updateActivityEntryComment(habitId, date, entry.id, editedComment);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedComment(entry.comment || '');
    setIsEditing(false);
  };

  return (
    <div className="p-3 border rounded-md bg-card shadow-sm mb-3">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs text-muted-foreground">
          Logged {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
        </span>
        <div className="flex items-center space-x-1">
          {!isEditing && (
            <Button variant="ghost" size="icon" onClick={handleEdit} className="h-7 w-7" aria-label="Edit comment">
              <Edit3 className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={handleDelete} className="h-7 w-7" aria-label="Delete entry">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            value={editedComment}
            onChange={(e) => setEditedComment(e.target.value)}
            placeholder="Add a comment..."
            rows={2}
            className="text-sm"
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={handleCancelEdit}>
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
            <Button size="sm" onClick={handleSaveEdit}>
              <Save className="h-4 w-4 mr-1" /> Save
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-foreground whitespace-pre-wrap break-words">
          {entry.comment || <span className="italic text-muted-foreground">No comment</span>}
        </p>
      )}
    </div>
  );
};

export default ActivityEntryItem;
