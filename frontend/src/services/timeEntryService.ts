import api from './apiClient';
import { Task } from './taskService';

export type TimeEntry = {
  id: string;
  taskId: string;
  userId: string;
  startTime: string;
  endTime: string | null;
  durationSeconds: number | null;
  note?: string | null;
  task?: Pick<Task, 'id' | 'title' | 'projectId'>;
};

export type ManualEntryPayload = {
  taskId: string;
  startTime: string;
  endTime?: string;
  durationSeconds?: number;
  note?: string;
};

export const timeEntryService = {
  list: async (params: { taskId?: string; projectId?: string }): Promise<TimeEntry[]> => {
    const { data } = await api.get<TimeEntry[]>('/time-entries', { params });
    return data;
  },
  getActive: async (): Promise<TimeEntry | null> => {
    const { data } = await api.get<TimeEntry | null>('/time-entries/active');
    return data;
  },
  start: async (taskId: string): Promise<TimeEntry> => {
    const { data } = await api.post<TimeEntry>('/time-entries/start', { taskId });
    return data;
  },
  stop: async (entryId: string): Promise<TimeEntry> => {
    const { data } = await api.post<TimeEntry>(`/time-entries/${entryId}/stop`);
    return data;
  },
  createManual: async (payload: ManualEntryPayload): Promise<TimeEntry> => {
    const { data } = await api.post<TimeEntry>('/time-entries/manual', payload);
    return data;
  },
};

