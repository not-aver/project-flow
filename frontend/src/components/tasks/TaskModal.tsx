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
  useTheme,
  useMediaQuery,
  Slide,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { Task, CreateTaskPayload } from '../../services/taskService';

// Bottom sheet transition for mobile
const SlideTransition = (props: TransitionProps & { children: React.ReactElement }) => {
  return <Slide direction="up" {...props} />;
};

type TaskModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: Partial<CreateTaskPayload>) => Promise<void>;
  defaultStatus?: Task['status'];
  task?: Task | null;
  loading?: boolean;
};

const TaskModal = ({ open, onClose, onSubmit, defaultStatus = 'TODO', task, loading = false }: TaskModalProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
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
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      fullScreen={isMobile}
      TransitionComponent={isMobile ? SlideTransition : undefined}
      PaperProps={{ 
        sx: { 
          borderRadius: isMobile ? '16px 16px 0 0' : '10px',
          maxHeight: isMobile ? '90vh' : 'auto',
          margin: isMobile ? '0' : '32px',
          position: isMobile ? 'fixed' : 'relative',
          bottom: isMobile ? 0 : 'auto',
          top: isMobile ? 'auto' : 'auto',
        } 
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ 
          pt: isMobile ? 3 : 2,
          pb: isMobile ? 2 : 2,
        }}>
          {task ? 'Обновить задачу' : 'Новая задача'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} pt={1}>
            <TextField
              label="Заголовок"
              required
              fullWidth
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              autoFocus={!isMobile}
            />
            <TextField
              label="Описание"
              multiline
              fullWidth
              rows={isMobile ? 4 : 3}
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            />
            <TextField
              select
              label="Статус"
              fullWidth
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as Task['status'] }))}
            >
              <MenuItem value="TODO">К выполнению</MenuItem>
              <MenuItem value="IN_PROGRESS">В работе</MenuItem>
              <MenuItem value="DONE">Готово</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ 
          px: 3, 
          pb: isMobile ? 3 : 3,
          pt: 2,
          gap: 1,
          flexDirection: isMobile ? 'column-reverse' : 'row',
        }}>
          <Button 
            onClick={onClose} 
            disabled={loading}
            fullWidth={isMobile}
            variant={isMobile ? 'outlined' : 'text'}
          >
            Отмена
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading || !form.title.trim()}
            fullWidth={isMobile}
          >
            {task ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskModal;

