import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { Alert, Link, Stack, TextField } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import useAuth from '../hooks/useAuth';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(form.email, form.password);
      navigate('/app');
    } catch {
      setError('Не удалось войти. Проверьте email и пароль.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Войти"
      footer={
        <>
          Нет аккаунта?{' '}
          <Link component={RouterLink} to="/register">
            Создать
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
          />
          <TextField
            label="Пароль"
            name="password"
            type="password"
            required
            value={form.password}
            onChange={handleChange}
          />
          <LoadingButton
            type="submit"
            variant="contained"
            loading={submitting}
            size="large"
            fullWidth
            sx={{
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            Войти
          </LoadingButton>
        </Stack>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;




