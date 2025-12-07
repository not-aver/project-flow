import api from './apiClient';

export type Comment = {
  id: string;
  text: string;
  taskId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; name: string; email: string };
};

export const commentService = {
  list: async (taskId: string): Promise<Comment[]> => {
    const { data } = await api.get<Comment[]>(`/comments/task/${taskId}`);
    return data;
  },
  create: async (taskId: string, text: string): Promise<Comment> => {
    const { data } = await api.post<Comment>(`/comments/task/${taskId}`, { text });
    return data;
  },
  update: async (commentId: string, text: string): Promise<Comment> => {
    const { data } = await api.put<Comment>(`/comments/${commentId}`, { text });
    return data;
  },
  delete: async (commentId: string): Promise<void> => {
    await api.delete(`/comments/${commentId}`);
  },
};
