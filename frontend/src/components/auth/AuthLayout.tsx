import { Box, Grid, Typography, Stack, Paper, keyframes } from '@mui/material';
import { PropsWithChildren, ReactNode } from 'react';
import Logo from '../common/Logo';

type AuthLayoutProps = {
  title: string;
  footer?: ReactNode;
};

// Анимация градиента
const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// Анимация появления формы
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Волновой декоративный элемент
const WaveDecoration = () => (
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: { xs: '180px', sm: '220px' },
      overflow: 'hidden',
      zIndex: 0,
    }}
  >
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <defs>
        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#C084FC', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#7C3AED', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#5B21B6', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path
        d="M0,60 C300,100 600,20 900,60 C1050,80 1150,50 1200,40 L1200,0 L0,0 Z"
        fill="url(#waveGradient)"
      />
    </svg>
  </Box>
);

const AuthLayout = ({ title, footer, children }: PropsWithChildren<AuthLayoutProps>) => {
  return (
    <Grid container minHeight="100vh">
      {/* Desktop Left Panel */}
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

      {/* Right Panel / Mobile Full Screen */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          // Mobile gradient background
          background: {
            xs: 'linear-gradient(135deg, #C084FC 0%, #7C3AED 50%, #5B21B6 100%)',
            md: '#F8FAFF',
          },
          backgroundSize: {
            xs: '400% 400%',
            md: 'auto',
          },
          animation: {
            xs: `${gradientAnimation} 15s ease infinite`,
            md: 'none',
          },
          '&::before': {
            content: { xs: '""', md: 'none' },
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: {
              xs: 'radial-gradient(circle at 20% 80%, rgba(192, 132, 252, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)',
              md: 'none',
            },
            pointerEvents: 'none',
          },
        }}
      >
        {/* Wave decoration - only on mobile */}
        <Box sx={{ display: { xs: 'none', md: 'none' } }}>
          <WaveDecoration />
        </Box>

        <Box
          width="100%"
          maxWidth={420}
          px={{ xs: 3, sm: 4 }}
          py={{ xs: 6, sm: 8 }}
          sx={{
            position: 'relative',
            zIndex: 1,
            animation: `${fadeInUp} 0.6s ease-out`,
          }}
        >
          <Stack spacing={1} mb={4}>
            <Typography
              variant="h4"
              fontWeight={600}
              sx={{
                color: { xs: 'white', md: 'text.primary' },
                textAlign: { xs: 'center', md: 'left' },
              }}
            >
              {title}
            </Typography>
          </Stack>

          <Paper
            elevation={1}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: '16px',
              backdropFilter: { xs: 'blur(20px)', md: 'none' },
              backgroundColor: { xs: 'rgba(255, 255, 255, 0.95)', md: 'white' },
              boxShadow: {
                xs: '0 8px 32px rgba(0, 0, 0, 0.1)',
                md: '0 2px 8px rgba(0, 0, 0, 0.08)',
              },
              border: {
                xs: '1px solid rgba(255, 255, 255, 0.3)',
                md: 'none',
              },
            }}
          >
            <Stack spacing={3}>{children}</Stack>
          </Paper>

          {footer && (
            <Box mt={4}>
              <Typography
                variant="body2"
                textAlign="center"
                sx={{
                  color: { xs: 'rgba(255, 255, 255, 0.95)', md: 'text.secondary' },
                  fontWeight: { xs: 500, md: 400 },
                }}
              >
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




