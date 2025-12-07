import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  PropsWithChildren,
} from 'react';
import api, { setAuthToken } from '../services/apiClient';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'projectflow-token';

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY));
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      api
        .get('/auth/me')
        .then((res) => setUser(res.data.user))
        .catch(() => {
          setToken(null);
          setAuthToken(null);
          localStorage.removeItem(STORAGE_KEY);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const persistToken = useCallback((value: string) => {
    setToken(value);
    localStorage.setItem(STORAGE_KEY, value);
    setAuthToken(value);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    persistToken(data.token);
    setUser(data.user);
  }, [persistToken]);

  const register = useCallback(
    async ({ name, email, password }: { name: string; email: string; password: string }) => {
      const { data } = await api.post('/auth/register', { name, email, password });
      persistToken(data.token);
      setUser(data.user);
    },
    [persistToken],
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      logout,
    }),
    [user, token, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };



