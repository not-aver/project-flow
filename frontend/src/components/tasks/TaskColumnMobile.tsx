import { Droppable } from '@hello-pangea/dnd';
import { 
  Box, 
  Stack, 
  Typography, 
  IconButton, 
  Tooltip, 
  Collapse,
  Chip,
  Paper,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import TaskCard from './TaskCard';
import { Task } from '../../services/taskService';
import TaskDraggable from './TaskDraggable';

type TaskColumnMobileProps = {
  id: string;
  title: string;
  tasks: Task[];
  isLoading?: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onAdd?: () => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  color?: string;
};

const statusColors: Record<string, { bg: string; border: string; text: string }> = {
  TODO: {
    bg: 'rgba(148, 163, 184, 0.1)',
    border: '#94A3B8',
    text: '#475569',
  },
  IN_PROGRESS: {
    bg: 'rgba(124, 58, 237, 0.1)',
    border: '#7C3AED',
    text: '#7C3AED',
  },
  DONE: {
    bg: 'rgba(16, 185, 129, 0.1)',
    border: '#10B981',
    text: '#059669',
  },
};

const TaskColumnMobile = ({ 
  id, 
  title, 
  tasks, 
  isExpanded,
  onToggle,
  onAdd, 
  onEdit, 
  onDelete 
}: TaskColumnMobileProps) => {
  const colors = statusColors[id] || statusColors.TODO;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '16px',
        overflow: 'hidden',
        border: '2px solid',
        borderColor: isExpanded ? colors.border : 'divider',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        bgcolor: isExpanded ? colors.bg : 'background.paper',
      }}
    >
      {/* Header - Always Visible */}
      <Box
        onClick={onToggle}
        sx={{
          p: 2,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: isExpanded ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
          transition: 'background-color 0.3s ease',
          '&:active': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5} flex={1}>
          <Typography 
            variant="subtitle1" 
            fontWeight={700}
            sx={{ 
              color: isExpanded ? colors.text : 'text.primary',
              transition: 'color 0.3s ease',
            }}
          >
            {title}
          </Typography>
          <Chip 
            label={tasks.length} 
            size="small"
            sx={{
              bgcolor: colors.bg,
              color: colors.text,
              fontWeight: 600,
              minWidth: 28,
              height: 24,
            }}
          />
        </Stack>

        <Stack direction="row" spacing={0.5} alignItems="center">
          {isExpanded && onAdd && (
            <Tooltip title="Добавить задачу">
              <IconButton 
                size="small" 
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd();
                }}
                sx={{
                  color: colors.text,
                }}
              >
                <AddRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <IconButton 
            size="small"
            sx={{
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              color: isExpanded ? colors.text : 'action.active',
            }}
          >
            <ExpandMoreRoundedIcon />
          </IconButton>
        </Stack>
      </Box>

      {/* Expandable Content */}
      <Collapse 
        in={isExpanded} 
        timeout={{
          enter: 400,
          exit: 300,
        }}
        easing={{
          enter: 'cubic-bezier(0.4, 0, 0.2, 1)',
          exit: 'cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Box sx={{ px: 2, pb: 2 }}>
          <Droppable droppableId={id}>
            {(provided, snapshot) => (
              <Stack
                ref={provided.innerRef}
                {...provided.droppableProps}
                spacing={2}
                sx={{
                  minHeight: tasks.length === 0 ? 80 : 0,
                  transition: 'background-color 0.2s ease',
                  bgcolor: snapshot.isDraggingOver ? 'rgba(124, 58, 237, 0.08)' : 'transparent',
                  borderRadius: '12px',
                  p: 1,
                  border: snapshot.isDraggingOver ? '2px dashed' : '2px dashed transparent',
                  borderColor: snapshot.isDraggingOver ? colors.border : 'transparent',
                }}
              >
                {tasks.length === 0 && !snapshot.isDraggingOver ? (
                  <Box 
                    sx={{ 
                      textAlign: 'center', 
                      py: 3,
                      color: 'text.disabled',
                    }}
                  >
                    <Typography variant="body2">
                      Нет задач
                    </Typography>
                  </Box>
                ) : (
                  tasks.map((task, index) => (
                    <TaskDraggable key={task.id} task={task} index={index}>
                      <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} />
                    </TaskDraggable>
                  ))
                )}
                {provided.placeholder}
              </Stack>
            )}
          </Droppable>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default TaskColumnMobile;
