import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  MenuItem,
} from '@mui/material';
import { Task, CreateTaskPayload } from '../../services/taskService';

type TaskModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: Partial<CreateTaskPayload>) => Promise<void>;
  defaultStatus?: Task['status'];
  task?: Task | null;
  loading?: boolean;
};

const TaskModal = ({ open, onClose, onSubmit, defaultStatus = 'TODO', task, loading = false }: TaskModalProps) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: defaultStatus,
  });

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description || '',
        status: task.status,
      });
    } else {
      setForm({
        title: '',
        description: '',
        status: defaultStatus,
      });
    }
  }, [task, defaultStatus, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      title: form.title,
      description: form.description || undefined,
      status: form.status as Task['status'],
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '10px' } }}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{task ? 'Обновить задачу' : 'Новая задача'}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} pt={1}>
            <TextField
              label="Заголовок"
              required
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            />
            <TextField
              label="Описание"
              multiline
              rows={3}
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            />
            <TextField
              select
              label="Статус"
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as Task['status'] }))}
            >
              <MenuItem value="TODO">К выполнению</MenuItem>
              <MenuItem value="IN_PROGRESS">В работе</MenuItem>
              <MenuItem value="DONE">Готово</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} disabled={loading}>
            Отмена
          </Button>
          <Button type="submit" variant="contained" disabled={loading || !form.title.trim()}>
            {task ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskModal;

