import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { Alert, Link, Stack, TextField } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import useAuth from '../hooks/useAuth';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
      await register(form);
      navigate('/app');
    } catch {
      setError('Не удалось создать аккаунт. Попробуйте другой email.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Создайте аккаунт"
      footer={
        <>
          Уже есть аккаунт?{' '}
          <Link component={RouterLink} to="/login">
            Войти
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Имя"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
          />
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
            size="large"
            loading={submitting}
            fullWidth
          >
            Создать
          </LoadingButton>
        </Stack>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;




