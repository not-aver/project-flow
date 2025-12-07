import { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  MenuItem,
} from '@mui/material';
import { Task } from '../../services/taskService';
import { ManualEntryPayload } from '../../services/timeEntryService';

type ManualTimeEntryDialogProps = {
  open: boolean;
  onClose: () => void;
  tasks: Task[];
  onSave: (payload: ManualEntryPayload) => Promise<void>;
  defaultTaskId?: string;
};

const ManualTimeEntryDialog = ({ open, onClose, tasks, onSave, defaultTaskId }: ManualTimeEntryDialogProps) => {
  const [form, setForm] = useState({
    taskId: defaultTaskId || '',
    startTime: '',
    endTime: '',
    durationMinutes: '',
    note: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        taskId: defaultTaskId || '',
        startTime: '',
        endTime: '',
        durationMinutes: '',
        note: '',
      });
    }
  }, [open, defaultTaskId]);

  const durationSeconds = useMemo(() => {
    if (form.durationMinutes) {
      return Number(form.durationMinutes) * 60;
    }
    if (form.startTime && form.endTime) {
      const start = new Date(form.startTime);
      const end = new Date(form.endTime);
      const diff = (end.getTime() - start.getTime()) / 1000;
      return diff > 0 ? Math.round(diff) : undefined;
    }
    return undefined;
  }, [form.durationMinutes, form.startTime, form.endTime]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.taskId || !form.startTime) {
      return;
    }

    setSaving(true);
    try {
      await onSave({
        taskId: form.taskId,
        startTime: new Date(form.startTime).toISOString(),
        endTime: form.endTime ? new Date(form.endTime).toISOString() : undefined,
        durationSeconds,
        note: form.note || undefined,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '10px' } }}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Добавить время вручную</DialogTitle>
        <DialogContent>
          <Stack spacing={3} pt={1}>
            <TextField
              select
              required
              label="Задача"
              value={form.taskId}
              onChange={(e) => setForm((prev) => ({ ...prev, taskId: e.target.value }))}
            >
              {tasks.map((task) => (
                <MenuItem key={task.id} value={task.id}>
                  {task.title}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Начало"
              type="datetime-local"
              required
              value={form.startTime}
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setForm((prev) => ({ ...prev, startTime: e.target.value }))}
            />

            <TextField
              label="Окончание"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={form.endTime}
              onChange={(e) => setForm((prev) => ({ ...prev, endTime: e.target.value }))}
              helperText="Опционально, заполните вместе со временем начала"
            />

            <TextField
              label="Или продолжительность (мин)"
              type="number"
              value={form.durationMinutes}
              onChange={(e) => setForm((prev) => ({ ...prev, durationMinutes: e.target.value }))}
            />

            <TextField
              label="Комментарий"
              multiline
              rows={2}
              value={form.note}
              onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose}>Отмена</Button>
          <Button type="submit" variant="contained" disabled={saving || !form.taskId || !form.startTime}>
            Сохранить
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ManualTimeEntryDialog;

