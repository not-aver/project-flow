import { Card, CardContent, Stack, Typography, Chip, IconButton, Tooltip, Badge } from '@mui/material';
import { useState } from 'react';
import DragIndicatorRoundedIcon from '@mui/icons-material/DragIndicatorRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import TaskCommentsDialog from './TaskCommentsDialog';
import { Task } from '../../services/taskService';

type TaskCardProps = {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
};

const statusLabels: Record<Task['status'], string> = {
  TODO: 'К выполнению',
  IN_PROGRESS: 'В работе',
  DONE: 'Готово',
};

const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentCount, setCommentCount] = useState<number | null>(null);
  const chipProps: { color?: 'default' | 'success' | 'primary' | 'warning'; variant?: 'filled' | 'outlined' } =
    task.status === 'DONE'
      ? { color: 'success', variant: 'outlined' }
      : task.status === 'IN_PROGRESS'
      ? { color: 'primary', variant: 'outlined' }
      : { color: 'default', variant: 'outlined' };
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: '10px',
        '&:hover': {
          borderColor: 'primary.light',
          boxShadow: '0px 8px 16px rgba(15, 23, 42, 0.08)',
        },
        ...(task.status === 'IN_PROGRESS'
          ? { background: 'linear-gradient(180deg, rgba(124,58,237,0.04), rgba(124,58,237,0.02))' }
          : task.status === 'DONE'
          ? { background: 'linear-gradient(180deg, rgba(16,185,129,0.06), rgba(16,185,129,0.02))' }
          : { background: 'linear-gradient(180deg, rgba(148,163,184,0.06), rgba(148,163,184,0.02))' }),
      }}
    >
      <CardContent sx={{ '&:last-child': { pb: 2 } }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
          <DragIndicatorRoundedIcon fontSize="small" sx={{ color: 'text.disabled' }} />
          <Typography variant="subtitle1" fontWeight={600}>
            {task.title}
          </Typography>
        </Stack>

        {task.description ? (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            {task.description}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.disabled" sx={{ mb: 1.5, fontStyle: 'italic' }}>
            Нет описания
          </Typography>
        )}

        <Stack direction="row" spacing={1} alignItems="center">
          <Chip label={statusLabels[task.status]} size="small" {...chipProps} />
          <Stack direction="row" spacing={0.5} ml="auto">
            <Tooltip title="Комментарии">
              <IconButton size="small" onClick={() => setCommentsOpen(true)}>
                <Badge color="primary" badgeContent={commentCount ?? 0} invisible={commentCount === null} max={99}>
                  <ChatBubbleOutlineRoundedIcon fontSize="small" />
                </Badge>
              </IconButton>
            </Tooltip>
            {onEdit && (
              <Tooltip title="Редактировать">
                <IconButton size="small" onClick={() => onEdit(task)}>
                  <EditRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {onDelete && (
              <Tooltip title="Удалить">
                <IconButton size="small" color="error" onClick={() => onDelete(task)}>
                  <DeleteRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Stack>
      </CardContent>
      <TaskCommentsDialog open={commentsOpen} onClose={() => setCommentsOpen(false)} taskId={task.id} taskTitle={task.title} onCountChange={setCommentCount} />
    </Card>
  );
};

export default TaskCard;

