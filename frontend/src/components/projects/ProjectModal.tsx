import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  IconButton,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Project, CreateProjectPayload, UpdateProjectPayload } from '../../services/projectService';

type SubmitPayload = CreateProjectPayload | UpdateProjectPayload;

type ProjectModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: SubmitPayload) => Promise<void>;
  project?: Project | null;
  loading?: boolean;
};

const ProjectModal = ({ open, onClose, onSubmit, project, loading = false }: ProjectModalProps) => {
  const [form, setForm] = useState({ name: '', description: '' });

  useEffect(() => {
    if (project) {
      setForm({
        name: project.name,
        description: project.description || '',
      });
    } else {
      setForm({ name: '', description: '' });
    }
  }, [project, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: SubmitPayload = project
      ? {
          name: form.name,
          description: form.description || undefined,
        }
      : {
          name: form.name,
          description: form.description || undefined,
        };
    await onSubmit(payload);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '10px' } }}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <span>{project ? 'Редактировать проект' : 'Создать проект'}</span>
            <IconButton onClick={onClose} size="small">
              <CloseRoundedIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} pt={1}>
            <TextField
              label="Название проекта"
              required
              fullWidth
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              autoFocus
            />
            <TextField
              label="Описание"
              multiline
              rows={4}
              fullWidth
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Расскажите о проекте..."
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} disabled={loading}>
            Отмена
          </Button>
          <Button type="submit" variant="contained" disabled={loading || !form.name.trim()}>
            {project ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProjectModal;

