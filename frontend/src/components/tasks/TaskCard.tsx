import { Card, CardContent, Stack, Typography, Chip, IconButton, Tooltip, Badge, Box, useTheme, useMediaQuery } from '@mui/material';
import { useState, useRef, useEffect } from 'react';
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
  
  // Swipe functionality for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwipeAction, setIsSwipeAction] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || touchStart === null) return;
    const currentTouch = e.targetTouches[0].clientX;
    const diff = currentTouch - touchStart;
    
    // Limit swipe distance
    if (Math.abs(diff) > 100) return;
    
    setTouchEnd(currentTouch);
    setSwipeOffset(diff);
  };

  const onTouchEnd = () => {
    if (!isMobile || !touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && onDelete) {
      setIsSwipeAction(true);
      setTimeout(() => {
        onDelete(task);
      }, 200);
    } else if (isRightSwipe && onEdit) {
      setIsSwipeAction(true);
      setTimeout(() => {
        onEdit(task);
      }, 200);
    }

    // Reset
    setSwipeOffset(0);
    setTouchStart(null);
    setTouchEnd(null);
  };

  useEffect(() => {
    if (isSwipeAction) {
      const timer = setTimeout(() => setIsSwipeAction(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isSwipeAction]);

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
    <Box 
      sx={{ 
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '10px',
      }}
    >
      {/* Swipe Action Backgrounds - Mobile Only */}
      {isMobile && (
        <>
          {/* Left swipe - Delete */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: '80px',
              bgcolor: 'error.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '10px',
              zIndex: 0,
            }}
          >
            <DeleteRoundedIcon sx={{ color: 'white' }} />
          </Box>
          
          {/* Right swipe - Edit */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: '80px',
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '10px',
              zIndex: 0,
            }}
          >
            <EditRoundedIcon sx={{ color: 'white' }} />
          </Box>
        </>
      )}

      <Card
        ref={cardRef}
        variant="outlined"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        sx={{
          borderRadius: '10px',
          position: 'relative',
          zIndex: 1,
          transform: isMobile ? `translateX(${swipeOffset}px)` : 'none',
          transition: isSwipeAction ? 'transform 0.2s ease-out, opacity 0.2s ease-out' : 'transform 0.1s ease-out',
          opacity: isSwipeAction ? 0.5 : 1,
          '&:hover': {
            borderColor: 'primary.light',
            boxShadow: '0px 8px 16px rgba(15, 23, 42, 0.08)',
          },
          ...cardBackground,
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
    </Box>
  );
};

export default TaskCard;

