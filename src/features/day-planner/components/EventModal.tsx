import { useState, useEffect } from 'react';
import { useAppStore, type DayEvent } from '../../../store';
import { format } from 'date-fns';
import { X } from 'lucide-react';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  eventToEdit: DayEvent | null;
}

export function EventModal({ isOpen, onClose, selectedDate, eventToEdit }: EventModalProps) {
  const addEvent = useAppStore((state) => state.addEvent);
  const updateEvent = useAppStore((state) => state.updateEvent);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [color, setColor] = useState('#00E5FF'); // Default Accent

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setDescription(eventToEdit.description || '');
      setStartTime(eventToEdit.startTime);
      setEndTime(eventToEdit.endTime);
      setColor(eventToEdit.color || '#00E5FF');
    } else {
      setTitle('');
      setDescription('');
      setStartTime('09:00');
      setEndTime('10:00');
      setColor('#00E5FF');
    }
  }, [eventToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    if (eventToEdit) {
      updateEvent(eventToEdit.id, {
        title,
        description,
        startTime,
        endTime,
        color
      });
    } else {
      addEvent({
        id: crypto.randomUUID(),
        title,
        description,
        startTime,
        endTime,
        date: format(selectedDate, 'yyyy-MM-dd'),
        color
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-app/80 backdrop-blur-sm p-4">
      <div className="bg-bg-card border border-border-subtle rounded-lg w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-border-subtle">
          <h2 className="text-body-lg font-medium text-text-main">
            {eventToEdit ? 'Edit Event' : 'Add Event'}
          </h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-main">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-caption text-text-muted mb-1">Title</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-bg-app border border-border-subtle rounded-sm px-3 py-2 text-body-sm text-text-main focus:outline-none focus:border-text-muted"
              placeholder="Meeting with Team"
              required
            />
          </div>
          
          <div>
            <label className="block text-caption text-text-muted mb-1">Description (Optional)</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-bg-app border border-border-subtle rounded-sm px-3 py-2 text-body-sm text-text-main focus:outline-none focus:border-text-muted h-20 resize-none"
              placeholder="Discuss Q3 goals..."
            />
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-caption text-text-muted mb-1">Start Time</label>
              <input 
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-bg-app border border-border-subtle rounded-sm px-3 py-2 text-body-sm text-text-main focus:outline-none focus:border-text-muted"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-caption text-text-muted mb-1">End Time</label>
              <input 
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-bg-app border border-border-subtle rounded-sm px-3 py-2 text-body-sm text-text-main focus:outline-none focus:border-text-muted"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-caption text-text-muted mb-1">Color</label>
            <div className="flex gap-2">
              {['#00E5FF', '#2ea043', '#d29922', '#ff4d4d', '#7928ca', '#ff0080'].map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full border-2 ${color === c ? 'border-text-main' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-pill text-sm font-medium bg-bg-app text-text-main hover:bg-bg-card transition-colors border border-border-subtle"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-pill text-sm font-medium bg-text-main text-bg-app hover:opacity-90 transition-opacity"
            >
              {eventToEdit ? 'Save Changes' : 'Add Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
