import api from './apiClient';

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  position: number;
  projectId: string;
  assigneeId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateTaskPayload = {
  title: string;
  description?: string;
  status?: Task['status'];
  projectId: string;
  assigneeId?: string;
};

export type UpdateTaskPayload = Partial<
  Pick<Task, 'title' | 'description' | 'status' | 'assigneeId' | 'position'>
>;

export const taskService = {
  list: async (projectId: string): Promise<Task[]> => {
    const { data } = await api.get<Task[]>(`/tasks`, {
      params: { projectId },
    });
    return data;
  },

  create: async (payload: CreateTaskPayload): Promise<Task> => {
    const { data } = await api.post<Task>('/tasks', payload);
    return data;
  },

  update: async (taskId: string, payload: UpdateTaskPayload): Promise<Task> => {
    const { data } = await api.put<Task>(`/tasks/${taskId}`, payload);
    return data;
  },

  delete: async (taskId: string): Promise<void> => {
    await api.delete(`/tasks/${taskId}`);
  },

  reorder: async (projectId: string, updates: Array<{ id: string; status: Task['status']; position: number }>) => {
    const { data } = await api.post<Task[]>('/tasks/reorder', {
      projectId,
      updates,
    });
    return data;
  },
};

