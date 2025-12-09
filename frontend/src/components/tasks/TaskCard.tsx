import { Card, CardContent, Stack, Typography, Chip, IconButton, Tooltip, Badge, useTheme, useMediaQuery } from '@mui/material';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentCount, setCommentCount] = useState<number | null>(null);

  const chipProps: { color?: 'default' | 'success' | 'primary' | 'warning'; variant?: 'filled' | 'outlined' } =
    task.status === 'DONE'
      ? { color: 'success', variant: 'outlined' }
      : task.status === 'IN_PROGRESS'
      ? { color: 'primary', variant: 'outlined' }
      : { color: 'default', variant: 'outlined' };

  const cardBackground = 
    task.status === 'IN_PROGRESS'
      ? { background: 'linear-gradient(180deg, rgba(124,58,237,0.04), rgba(124,58,237,0.02))' }
      : task.status === 'DONE'
      ? { background: 'linear-gradient(180deg, rgba(16,185,129,0.06), rgba(16,185,129,0.02))' }
      : { background: 'linear-gradient(180deg, rgba(148,163,184,0.06), rgba(148,163,184,0.02))' };

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: '10px',
        overflow: 'hidden',
        '&:hover': {
          borderColor: 'primary.light',
          boxShadow: '0px 8px 16px rgba(15, 23, 42, 0.08)',
        },
        ...cardBackground,
      }}
    >
      <CardContent sx={{ 
        p: { xs: 2.5, md: 2 },
        '&:last-child': { pb: { xs: 2.5, md: 2 } } 
      }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={{ xs: 1.5, md: 1 }}>
          {!isMobile && (
            <DragIndicatorRoundedIcon fontSize="small" sx={{ color: 'text.disabled', cursor: 'grab' }} />
          )}
          <Typography 
            variant="subtitle1" 
            fontWeight={600}
            sx={{
              fontSize: { xs: '1rem', md: '0.875rem' },
              lineHeight: { xs: 1.5, md: 1.43 },
            }}
          >
            {task.title}
          </Typography>
        </Stack>

        {task.description ? (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: { xs: 2, md: 1.5 },
              fontSize: { xs: '0.875rem', md: '0.875rem' },
              lineHeight: { xs: 1.6, md: 1.43 },
            }}
          >
            {task.description}
          </Typography>
        ) : (
          <Typography 
            variant="body2" 
            color="text.disabled" 
            sx={{ 
              mb: { xs: 2, md: 1.5 }, 
              fontStyle: 'italic',
              fontSize: { xs: '0.875rem', md: '0.875rem' },
            }}
          >
            Нет описания
          </Typography>
        )}

        <Stack direction="row" spacing={{ xs: 1.5, md: 1 }} alignItems="center">
          <Chip 
            label={statusLabels[task.status]} 
            size="small" 
            {...chipProps}
            sx={{
              height: { xs: 28, md: 24 },
              fontSize: { xs: '0.813rem', md: '0.75rem' },
            }}
          />
          <Stack direction="row" spacing={{ xs: 0.5, md: 0.5 }} ml="auto">
            <Tooltip title="Комментарии">
              <IconButton 
                size={isMobile ? 'medium' : 'small'} 
                onClick={() => setCommentsOpen(true)}
                sx={{
                  minWidth: { xs: 44, md: 'auto' },
                  minHeight: { xs: 44, md: 'auto' },
                }}
              >
                <Badge color="primary" badgeContent={commentCount ?? 0} invisible={commentCount === null} max={99}>
                  <ChatBubbleOutlineRoundedIcon fontSize={isMobile ? 'medium' : 'small'} />
                </Badge>
              </IconButton>
            </Tooltip>
            {onEdit && (
              <Tooltip title="Редактировать">
                <IconButton 
                  size={isMobile ? 'medium' : 'small'} 
                  onClick={() => onEdit(task)}
                  sx={{
                    minWidth: { xs: 44, md: 'auto' },
                    minHeight: { xs: 44, md: 'auto' },
                  }}
                >
                  <EditRoundedIcon fontSize={isMobile ? 'medium' : 'small'} />
                </IconButton>
              </Tooltip>
            )}
            {onDelete && (
              <Tooltip title="Удалить">
                <IconButton 
                  size={isMobile ? 'medium' : 'small'} 
                  color="error" 
                  onClick={() => onDelete(task)}
                  sx={{
                    minWidth: { xs: 44, md: 'auto' },
                    minHeight: { xs: 44, md: 'auto' },
                  }}
                >
                  <DeleteRoundedIcon fontSize={isMobile ? 'medium' : 'small'} />
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

