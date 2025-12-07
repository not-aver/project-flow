import { Droppable } from '@hello-pangea/dnd';
import { Box, Stack, Typography, IconButton, Tooltip, Skeleton } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import TaskCard from './TaskCard';
import { Task } from '../../services/taskService';
import TaskDraggable from './TaskDraggable';

type TaskColumnProps = {
  id: string;
  title: string;
  tasks: Task[];
  isLoading?: boolean;
  onAdd?: () => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
};

const TaskColumn = ({ id, title, tasks, isLoading = false, onAdd, onEdit, onDelete }: TaskColumnProps) => {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: '10px',
        p: 2,
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="subtitle1" fontWeight={600}>
          {title} <Typography component="span">({tasks.length})</Typography>
        </Typography>
        {onAdd && (
          <Tooltip title="Добавить задачу">
            <IconButton size="small" onClick={onAdd}>
              <AddRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <Stack
            ref={provided.innerRef}
            {...provided.droppableProps}
            spacing={2}
            flex={1}
            minHeight={0}
            sx={{
              transition: 'background-color 0.2s ease',
              bgcolor: snapshot.isDraggingOver ? 'action.hover' : 'transparent',
              borderRadius: '8px',
              p: 0.5,
            }}
          >
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} variant="rounded" height={96} sx={{ borderRadius: 1 }} />
                ))
              : tasks.map((task, index) => (
                  <TaskDraggable key={task.id} task={task} index={index}>
                    <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} />
                  </TaskDraggable>
                ))}
            {provided.placeholder}
          </Stack>
        )}
      </Droppable>
    </Box>
  );
};

export default TaskColumn;

