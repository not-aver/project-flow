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
  useTheme,
  useMediaQuery,
  Slide,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Project, CreateProjectPayload, UpdateProjectPayload } from '../../services/projectService';

// Bottom sheet transition for mobile
const SlideTransition = (props: TransitionProps & { children: React.ReactElement }) => {
  return <Slide direction="up" {...props} />;
};

type SubmitPayload = CreateProjectPayload | UpdateProjectPayload;

type ProjectModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: SubmitPayload) => Promise<void>;
  project?: Project | null;
  loading?: boolean;
};

const ProjectModal = ({ open, onClose, onSubmit, project, loading = false }: ProjectModalProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
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
          margin: isMobile ? 0 : '32px',
          maxHeight: isMobile ? '90vh' : 'auto',
        } 
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ 
          pt: isMobile ? 3 : 2,
          pb: isMobile ? 2 : 2,
        }}>
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
              autoFocus={!isMobile}
            />
            <TextField
              label="Описание"
              multiline
              rows={isMobile ? 5 : 4}
              fullWidth
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Расскажите о проекте..."
            />
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
            disabled={loading || !form.name.trim()}
            fullWidth={isMobile}
          >
            {project ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProjectModal;

