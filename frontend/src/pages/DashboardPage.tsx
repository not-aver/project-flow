import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Grid,
  Stack,
  Typography,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded';
import useAuth from '../hooks/useAuth';
import {
  projectService,
  Project,
  CreateProjectPayload,
  UpdateProjectPayload,
} from '../services/projectService';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectModal from '../components/projects/ProjectModal';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Project | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectService.list();
      setProjects(data);
    } catch (err: any) {
      setError('Не удалось загрузить проекты. Попробуйте обновить страницу.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (payload: CreateProjectPayload) => {
    try {
      setSubmitting(true);
      await projectService.create(payload);
      await loadProjects();
      setModalOpen(false);
    } catch (err: any) {
      setError('Не удалось создать проект');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (payload: UpdateProjectPayload) => {
    if (!editingProject) return;
    try {
      setSubmitting(true);
      await projectService.update(editingProject.id, payload);
      await loadProjects();
      setModalOpen(false);
      setEditingProject(null);
    } catch (err: any) {
      setError('Не удалось обновить проект');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await projectService.delete(deleteConfirm.id);
      await loadProjects();
      setDeleteConfirm(null);
    } catch (err: any) {
      setError('Не удалось удалить проект');
      console.error(err);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingProject(null);
  };

  const handleProjectModalSubmit = async (payload: CreateProjectPayload | UpdateProjectPayload) => {
    if (editingProject) {
      await handleUpdate(payload);
    } else {
      await handleCreate(payload as CreateProjectPayload);
    }
  };

  return (
    <Box minHeight="100vh" bgcolor="background.default" px={{ xs: 2, md: 6 }} py={4}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        gap={2}
        mb={4}
      >
        <Box>
          <Typography 
            variant="h4"
            fontWeight={600}
            sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }}
          >
            Мои проекты
          </Typography>
          <Typography color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
            Управляйте проектами и задачами в одном месте
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} width={{ xs: '100%', md: 'auto' }}>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={isMobile ? undefined : <LogoutRoundedIcon />}
            onClick={logout}
            sx={{ 
              minWidth: { xs: 44, sm: 'auto' },
              flex: { xs: 1, sm: 'initial' },
            }}
          >
            {isMobile ? <LogoutRoundedIcon /> : 'Выйти'}
          </Button>
          <Button
            variant="contained"
            startIcon={isMobile ? undefined : <AddRoundedIcon />}
            onClick={() => {
              setEditingProject(null);
              setModalOpen(true);
            }}
            sx={{ 
              minWidth: { xs: 44, sm: 'auto' },
              flex: { xs: 1, sm: 'initial' },
            }}
          >
            {isMobile ? <AddRoundedIcon /> : 'Новый проект'}
          </Button>
        </Stack>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : projects.length === 0 ? (
        <Card
          sx={{
            borderRadius: '10px',
            p: 6,
            textAlign: 'center',
            bgcolor: 'background.paper',
          }}
        >
          <FolderOpenRoundedIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Пока нет проектов
          </Typography>
          <Typography color="text.secondary" mb={3}>
            Создайте первый проект, чтобы начать работу
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => {
              setEditingProject(null);
              setModalOpen(true);
            }}
          >
            Создать проект
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={project.id}>
              <ProjectCard
                project={project}
                onEdit={handleEdit}
                onDelete={(p) => setDeleteConfirm(p)}
                onClick={() => navigate(`/app/projects/${project.id}`)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <ProjectModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleProjectModalSubmit}
        project={editingProject}
        loading={submitting}
      />

      <Dialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        fullScreen={isMobile}
        PaperProps={{ 
          sx: { 
            borderRadius: isMobile ? '16px 16px 0 0' : 3,
            margin: isMobile ? 0 : '32px',
            maxHeight: isMobile ? '50vh' : 'auto',
          } 
        }}
      >
        <DialogTitle>Удалить проект?</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить проект &quot;{deleteConfirm?.name}&quot;? Это действие
            нельзя отменить.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ 
          px: 3,
          pb: isMobile ? 3 : 2,
          gap: 1,
          flexDirection: isMobile ? 'column-reverse' : 'row',
        }}>
          <Button 
            onClick={() => setDeleteConfirm(null)}
            fullWidth={isMobile}
            variant={isMobile ? 'outlined' : 'text'}
          >
            Отмена
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            fullWidth={isMobile}
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardPage;
