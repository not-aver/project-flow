import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
  Tooltip,
} from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import StopRoundedIcon from '@mui/icons-material/StopRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import { Task } from '../../services/taskService';
import { timeEntryService, TimeEntry } from '../../services/timeEntryService';
import ManualTimeEntryDialog from './ManualTimeEntryDialog';

dayjs.extend(durationPlugin);

type TimeTrackerPanelProps = {
  tasks: Task[];
};

const formatDuration = (seconds: number) => {
  const duration = dayjs.duration(seconds, 'seconds');
  const totalHours = Math.floor(duration.asHours());
  const minutes = String(duration.minutes()).padStart(2, '0');
  const secs = String(duration.seconds()).padStart(2, '0');
  return `${String(totalHours).padStart(2, '0')}:${minutes}:${secs}`;
};

const TimeTrackerPanel = ({ tasks }: TimeTrackerPanelProps) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [manualDialogOpen, setManualDialogOpen] = useState(false);

  useEffect(() => {
    setSelectedTaskId(tasks[0]?.id || '');
  }, [tasks]);

  useEffect(() => {
    const fetchActive = async () => {
      setLoading(true);
      try {
        const entry = await timeEntryService.getActive();
        setActiveEntry(entry);
        if (entry?.taskId) {
          setSelectedTaskId(entry.taskId);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchActive();
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (activeEntry && !activeEntry.endTime) {
      interval = setInterval(() => {
        const diffSeconds = Math.round((Date.now() - new Date(activeEntry.startTime).getTime()) / 1000);
        setElapsedSeconds(diffSeconds);
      }, 1000);
      setElapsedSeconds(Math.round((Date.now() - new Date(activeEntry.startTime).getTime()) / 1000));
    } else if (activeEntry?.durationSeconds) {
      setElapsedSeconds(activeEntry.durationSeconds);
    } else {
      setElapsedSeconds(0);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [activeEntry]);

  const currentTask = useMemo(() => tasks.find((task) => task.id === (activeEntry?.taskId || selectedTaskId)), [
    tasks,
    activeEntry,
    selectedTaskId,
  ]);

  const handleTaskChange = (event: SelectChangeEvent) => {
    setSelectedTaskId(event.target.value);
  };

  const handleStart = async () => {
    if (!selectedTaskId) return;
    const entry = await timeEntryService.start(selectedTaskId);
    setActiveEntry(entry);
  };

  const handleStop = async () => {
    if (!activeEntry || activeEntry.endTime) return;
    const entry = await timeEntryService.stop(activeEntry.id);
    setActiveEntry(entry);
  };

  const handleManualSave = async (payload: { taskId: string; startTime: string; endTime?: string; durationSeconds?: number; note?: string }) => {
    await timeEntryService.createManual(payload);
    setManualDialogOpen(false);
  };

  const timerLabel = activeEntry
    ? activeEntry.endTime
      ? 'Таймер остановлен'
      : 'Таймер в работе'
    : 'Нет активных записей';

  return (
    <>
      <Card sx={{ borderRadius: 2, mb: 3 }}>
        <CardContent>
          <Stack spacing={2}>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
              <Box>
                <Typography variant="overline" color="text.secondary">
                  {timerLabel}
                </Typography>
                <Typography variant="h3" fontWeight={600}>
                  {formatDuration(elapsedSeconds)}
                </Typography>
                {currentTask && (
                  <Typography color="text.secondary">{currentTask.title}</Typography>
                )}
              </Box>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
                <FormControl fullWidth sx={{ minWidth: 240 }}>
                  <InputLabel id="task-select-label">Задача</InputLabel>
                  <Select
                    labelId="task-select-label"
                    value={selectedTaskId}
                    label="Задача"
                    onChange={handleTaskChange}
                    disabled={loading}
                  >
                    {tasks.map((task) => (
                      <MenuItem key={task.id} value={task.id}>
                        {task.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Stack direction="row" spacing={1}>
                  <Tooltip title="Добавить время вручную">
                    <Button variant="outlined" startIcon={<HistoryRoundedIcon />} onClick={() => setManualDialogOpen(true)}>
                      Добавить
                    </Button>
                  </Tooltip>
                  {activeEntry && !activeEntry.endTime ? (
                    <Button variant="contained" color="error" startIcon={<StopRoundedIcon />} onClick={handleStop}>
                      Стоп
                    </Button>
                  ) : (
                    <Button variant="contained" startIcon={<PlayArrowRoundedIcon />} onClick={handleStart} disabled={!selectedTaskId}>
                      Старт
                    </Button>
                  )}
                </Stack>
              </Stack>
            </Stack>

            {activeEntry && activeEntry.endTime && (
              <>
                <Divider />
                <Typography variant="body2" color="text.secondary">
                  Последняя запись: {dayjs(activeEntry.startTime).format('DD MMM HH:mm')} —{' '}
                  {activeEntry.endTime ? dayjs(activeEntry.endTime).format('DD MMM HH:mm') : '...'}
                </Typography>
              </>
            )}
          </Stack>
        </CardContent>
      </Card>

      <ManualTimeEntryDialog
        open={manualDialogOpen}
        onClose={() => setManualDialogOpen(false)}
        tasks={tasks}
        onSave={handleManualSave}
        defaultTaskId={selectedTaskId || tasks[0]?.id}
      />
    </>
  );
};

export default TimeTrackerPanel;

