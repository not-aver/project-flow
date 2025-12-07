import { Box, Grid, Typography, Stack, Paper } from '@mui/material';
import { PropsWithChildren, ReactNode } from 'react';
import Logo from '../common/Logo';

type AuthLayoutProps = {
  title: string;
  footer?: ReactNode;
};

const AuthLayout = ({ title, footer, children }: PropsWithChildren<AuthLayoutProps>) => {
  return (
    <Grid container minHeight="100vh">
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          background: 'radial-gradient(circle at top, #C084FC, #7C3AED 40%, #312E81)',
          color: 'white',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          gap: 4,
          p: 8,
        }}
      >
        <Logo color="white" />
        <Box>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            АИС "Управление проектами" (ProjectFlow)
          </Typography>
          <Typography variant="h6" color="rgba(255,255,255,0.8)">
            Помогает планировать, отслеживать и доставлять результаты задач, декомпозировать сложные проекты.
          </Typography>
        </Box>
        <Stack spacing={3} mt="auto">
          <Paper
            elevation={0}
            sx={{
              p: 3,
              backdropFilter: 'blur(16px)',
              backgroundColor: 'rgba(255,255,255,0.08)',
              color: 'white',
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
            Хатунцев Владимир. ВГПГК 2025
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.7)">
              Учебная практика 17.11.25 - 07.12.25
            </Typography>
          </Paper>
        </Stack>
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, sm: 6 },
          backgroundColor: '#F8FAFF',
        }}
      >
        <Box width="100%" maxWidth={420}>
          <Stack spacing={1} mb={4}>
            <Typography variant="h4" fontWeight={600}>
              {title}
            </Typography>
          </Stack>
          <Paper elevation={1} sx={{ p: { xs: 3, sm: 4 }, borderRadius: '10px' }}>
            <Stack spacing={3}>{children}</Stack>
          </Paper>
          {footer && (
            <Box mt={4}>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                {footer}
              </Typography>
            </Box>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default AuthLayout;




