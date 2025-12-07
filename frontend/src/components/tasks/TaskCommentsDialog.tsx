import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
} from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { commentService, Comment } from '../../services/commentService';

type TaskCommentsDialogProps = {
  open: boolean;
  onClose: () => void;
  taskId: string;
  taskTitle?: string;
  onCountChange?: (count: number) => void;
};

const TaskCommentsDialog = ({ open, onClose, taskId, taskTitle, onCountChange }: TaskCommentsDialogProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!open) return;
      setLoading(true);
      try {
        const data = await commentService.list(taskId);
        setComments(data);
        onCountChange?.(data.length);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [open, taskId]);

  const handleAdd = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      const c = await commentService.create(taskId, text.trim());
      setComments((prev) => {
        const next = [...prev, c];
        onCountChange?.(next.length);
        return next;
      });
      setText('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    await commentService.delete(id);
    setComments((prev) => {
      const next = prev.filter((c) => c.id !== id);
      onCountChange?.(next.length);
      return next;
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle>Комментарии к задаче{taskTitle ? `: "${taskTitle}"` : ''}</DialogTitle>
      <DialogContent>
        {loading ? (
          <Typography color="text.secondary">Загрузка комментариев...</Typography>
        ) : comments.length === 0 ? (
          <Typography color="text.secondary">Пока нет комментариев</Typography>
        ) : (
          <List>
            {comments.map((c) => (
              <ListItem
                key={c.id}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(c.id)} size="small" color="error">
                    <DeleteRoundedIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={c.text}
                  secondary={
                    <>
                      <Typography component="span" variant="caption" color="text.secondary">
                        {c.user?.name || c.user?.email || 'Пользователь'} • {new Date(c.createdAt).toLocaleString('ru-RU')}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} mt={2}>
          <TextField
            fullWidth
            placeholder="Оставьте комментарий..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            multiline
            minRows={1}
          />
          <Button onClick={handleAdd} variant="contained" disabled={submitting || !text.trim()}>
            Отправить
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskCommentsDialog;
