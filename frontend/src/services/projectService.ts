import api from './apiClient';

export type Project = {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateProjectPayload = {
  name: string;
  description?: string;
};

export type UpdateProjectPayload = {
  name?: string;
  description?: string;
};

export const projectService = {
  list: async (): Promise<Project[]> => {
    const { data } = await api.get<Project[]>('/projects');
    return data;
  },

  create: async (payload: CreateProjectPayload): Promise<Project> => {
    const { data } = await api.post<Project>('/projects', payload);
    return data;
  },

  update: async (id: string, payload: UpdateProjectPayload): Promise<Project> => {
    const { data } = await api.put<Project>(`/projects/${id}`, payload);
    return data;
  },

  getById: async (id: string): Promise<Project> => {
    const { data } = await api.get<Project>(`/projects/${id}`);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },
};

