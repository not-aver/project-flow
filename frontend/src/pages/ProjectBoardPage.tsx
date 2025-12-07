import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  IconButton,
  Link as MuiLink,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import TaskColumn from '../components/tasks/TaskColumn';
import TaskColumnMobile from '../components/tasks/TaskColumnMobile';
import TaskModal from '../components/tasks/TaskModal';
import TimeTrackerPanel from '../components/time/TimeTrackerPanel';
import PullToRefreshIndicator from '../components/common/PullToRefreshIndicator';
import { usePullToRefresh } from '../hooks/usePullToRefresh';
import { projectService, Project } from '../services/projectService';
import { taskService, Task } from '../services/taskService';

const STATUSES: Task['status'][] = ['TODO', 'IN_PROGRESS', 'DONE'];
const STATUS_LABELS: Record<Task['status'], string> = {
  TODO: 'К выполнению',
  IN_PROGRESS: 'В работе',
  DONE: 'Готово',
};

const ProjectBoardPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingProject, setLoadingProject] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskModalStatus, setTaskModalStatus] = useState<Task['status']>('TODO');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [expandedColumn, setExpandedColumn] = useState<Task['status'] | null>('TODO');

  // Pull to refresh for mobile
  const { containerRef, isRefreshing, pullDistance, threshold } = usePullToRefresh({
    onRefresh: async () => {
      if (!projectId) return;
      await Promise.all([
        loadProject(projectId),
        loadTasks(projectId)
      ]);
    },
    isEnabled: isMobile,
  });

  useEffect(() => {
    if (!projectId) return;
    loadProject(projectId);
    loadTasks(projectId);
  }, [projectId]);

  const loadProject = async (id: string) => {
    try {
      setLoadingProject(true);
      const data = await projectService.getById(id);
      setProject(data);
    } catch (err) {
      setError('Не удалось загрузить проект');
      console.error(err);
    } finally {
      setLoadingProject(false);
    }
  };

  const loadTasks = async (id: string) => {
    try {
      setLoadingTasks(true);
      const data = await taskService.list(id);
      setTasks(data);
    } catch (err) {
      setError('Не удалось загрузить задачи');
      console.error(err);
    } finally {
      setLoadingTasks(false);
    }
  };

  const groupedTasks = useMemo(() => {
    return STATUSES.reduce<Record<Task['status'], Task[]>>((acc, status) => {
      acc[status] = tasks
        .filter((task) => task.status === status)
        .sort((a, b) => a.position - b.position || a.createdAt.localeCompare(b.createdAt));
      return acc;
    }, {} as Record<Task['status'], Task[]>);
  }, [tasks]);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source } = result;
    if (!destination || !projectId) return;

    const sourceStatus = source.droppableId as Task['status'];
    const destStatus = destination.droppableId as Task['status'];

    if (sourceStatus === destStatus && source.index === destination.index) {
      return;
    }

    const currentTasks = { ...groupedTasks };
    const sourceList = Array.from(currentTasks[sourceStatus]);
    const destList = sourceStatus === destStatus ? sourceList : Array.from(currentTasks[destStatus]);

    const [movedTask] = sourceList.splice(source.index, 1);
    const updatedTask = { ...movedTask, status: destStatus };
    destList.splice(destination.index, 0, updatedTask);

    const nextGrouped = {
      ...currentTasks,
      [sourceStatus]: sourceStatus === destStatus ? destList : sourceList,
      [destStatus]: destList,
    };

    setTasks(STATUSES.flatMap((status) => nextGrouped[status]));

    const updates: Array<{ id: string; status: Task['status']; position: number }> = [];
    nextGrouped[sourceStatus].forEach((task, index) => {
      updates.push({ id: task.id, status: task.status, position: index });
    });
    if (sourceStatus !== destStatus) {
      nextGrouped[destStatus].forEach((task, index) => {
        updates.push({ id: task.id, status: task.status, position: index });
      });
    }

    try {
      // Отправляем на сервер, но остаёмся на оптимистичном состоянии,
      // чтобы избежать мерцаний при полном обновлении списка
      await taskService.reorder(projectId, updates);
    } catch (err) {
      setError('Не удалось обновить порядок задач. Попробуйте снова.');
      console.error(err);
      // В случае ошибки откатываемся к состоянию с сервера
      loadTasks(projectId);
    }
  };

  const handleCreateTask = async (payload: Partial<{ title: string; description?: string; status?: Task['status'] }>) => {
    if (!projectId || !payload.title) return;
    try {
      await taskService.create({
        title: payload.title,
        description: payload.description,
        status: payload.status,
        projectId,
      });
      await loadTasks(projectId);
    } catch (err) {
      setError('Не удалось создать задачу');
      console.error(err);
    }
  };

  const handleUpdateTask = async (payload: Partial<{ title: string; description?: string; status?: Task['status'] }>) => {
    if (!projectId || !editingTask) return;
    try {
      await taskService.update(editingTask.id, payload);
      await loadTasks(projectId);
    } catch (err) {
      setError('Не удалось обновить задачу');
      console.error(err);
    } finally {
      setEditingTask(null);
    }
  };

  const handleDeleteTask = async (task: Task) => {
    if (!projectId) return;
    try {
      await taskService.delete(task.id);
      await loadTasks(projectId);
    } catch (err) {
      setError('Не удалось удалить задачу');
      console.error(err);
    }
  };

  const statusActions = (status: Task['status']) => ({
    onAdd: () => {
      setTaskModalStatus(status);
      setEditingTask(null);
      setTaskModalOpen(true);
    },
    onEdit: (task: Task) => {
      setEditingTask(task);
      setTaskModalStatus(task.status);
      setTaskModalOpen(true);
    },
    onDelete: (task: Task) => handleDeleteTask(task),
  });

  if (!projectId) {
    return (
    <Box display="flex" height="100vh" alignItems="center" justifyContent="center">
        <Typography variant="h6">Не указан проект</Typography>
      </Box>
    );
  }

  return (
    <Box 
      ref={containerRef}
      minHeight="100vh" 
      bgcolor="background.default" 
      px={{ xs: 2, md: 4 }} 
      py={4}
    >
      {/* Pull to Refresh Indicator - Mobile Only */}
      {isMobile && (
        <PullToRefreshIndicator
          isRefreshing={isRefreshing}
          pullDistance={pullDistance}
          threshold={threshold}
        />
      )}
      <Stack 
        direction={{ xs: 'column', md: 'row' }} 
        alignItems={{ xs: 'stretch', md: 'center' }} 
        justifyContent="space-between" 
        mb={3}
        spacing={{ xs: 2, md: 0 }}
      >
        <Stack spacing={1}>
          <Breadcrumbs sx={{ display: { xs: 'none', sm: 'flex' } }}>
            <MuiLink underline="hover" color="inherit" onClick={() => navigate('/app')} sx={{ cursor: 'pointer' }}>
              Проекты
            </MuiLink>
            <Typography color="text.primary">{project?.name || 'Загрузка...'}</Typography>
          </Breadcrumbs>
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton color="primary" onClick={() => navigate('/app')}>
              <ArrowBackRoundedIcon />
            </IconButton>
            <Typography 
              variant="h4"
              fontWeight={600}
              sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }}
            >
              {project?.name || 'Загрузка проекта...'}
            </Typography>
            {loadingProject && <CircularProgress size={20} />}
          </Stack>
          {project?.description && (
            <Typography color="text.secondary" maxWidth={640} sx={{ display: { xs: 'none', sm: 'block' } }}>
              {project.description}
            </Typography>
          )}
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button 
            variant="outlined" 
            startIcon={isMobile ? undefined : <RefreshRoundedIcon />}
            onClick={() => loadTasks(projectId)}
            sx={{ minWidth: { xs: 44, sm: 'auto' } }}
          >
            {isMobile ? <RefreshRoundedIcon /> : 'Обновить'}
          </Button>
          <Button 
            variant="contained" 
            startIcon={isMobile ? undefined : <AddRoundedIcon />}
            onClick={() => setTaskModalOpen(true)}
            sx={{ 
              minWidth: { xs: 44, sm: 'auto' },
              flexShrink: 0,
            }}
          >
            {isMobile ? <AddRoundedIcon /> : 'Новая задача'}
          </Button>
        </Stack>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TimeTrackerPanel tasks={tasks} />

      {loadingTasks ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <GridBoard
            groupedTasks={groupedTasks}
            loading={false}
            statusActions={statusActions}
            isMobile={isMobile}
            expandedColumn={expandedColumn}
            onToggleColumn={(status) => {
              setExpandedColumn(expandedColumn === status ? null : status);
            }}
          />
        </DragDropContext>
      )}

      <TaskModal
        open={taskModalOpen}
        onClose={() => {
          setTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        defaultStatus={taskModalStatus}
        task={editingTask}
      />
    </Box>
  );
};

type GridBoardProps = {
  groupedTasks: Record<Task['status'], Task[]>;
  loading: boolean;
  statusActions: (status: Task['status']) => {
    onAdd: () => void;
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
  };
  isMobile: boolean;
  expandedColumn: Task['status'] | null;
  onToggleColumn: (status: Task['status']) => void;
};

const GridBoard = ({ 
  groupedTasks, 
  loading, 
  statusActions, 
  isMobile,
  expandedColumn,
  onToggleColumn,
}: GridBoardProps) => {
  if (isMobile) {
    return (
      <Stack spacing={2}>
        {STATUSES.map((status) => (
          <TaskColumnMobile
            key={status}
            id={status}
            title={STATUS_LABELS[status]}
            tasks={groupedTasks[status] || []}
            isLoading={loading}
            isExpanded={expandedColumn === status}
            onToggle={() => onToggleColumn(status)}
            onAdd={statusActions(status).onAdd}
            onEdit={statusActions(status).onEdit}
            onDelete={statusActions(status).onDelete}
          />
        ))}
      </Stack>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 2.5,
      }}
    >
      {STATUSES.map((status) => (
        <TaskColumn
          key={status}
          id={status}
          title={STATUS_LABELS[status]}
          tasks={groupedTasks[status] || []}
          isLoading={loading}
          onAdd={statusActions(status).onAdd}
          onEdit={statusActions(status).onEdit}
          onDelete={statusActions(status).onDelete}
        />
      ))}
    </Box>
  );
};

export default ProjectBoardPage;

