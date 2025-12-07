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

// Анимированный волновой паттерн для фона
const WavePattern = () => {
  const wave1Animation = keyframes`
    0% { transform: translateX(0) translateY(0); }
    50% { transform: translateX(-25%) translateY(10px); }
    100% { transform: translateX(0) translateY(0); }
  `;

  const wave2Animation = keyframes`
    0% { transform: translateX(0) translateY(0); }
    50% { transform: translateX(-15%) translateY(-10px); }
    100% { transform: translateX(0) translateY(0); }
  `;

  const wave3Animation = keyframes`
    0% { transform: translateX(0) translateY(0); }
    50% { transform: translateX(-35%) translateY(5px); }
    100% { transform: translateX(0) translateY(0); }
  `;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      {/* Wave 1 */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.3,
          animation: `${wave1Animation} 20s ease-in-out infinite`,
        }}
      >
        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{
            position: 'absolute',
            width: '200%',
            height: '100%',
          }}
        >
          <path
            fill="rgba(255, 255, 255, 0.1)"
            d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,197.3C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </Box>

      {/* Wave 2 */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.2,
          animation: `${wave2Animation} 15s ease-in-out infinite`,
        }}
      >
        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{
            position: 'absolute',
            width: '200%',
            height: '100%',
          }}
        >
          <path
            fill="rgba(255, 255, 255, 0.15)"
            d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </Box>

      {/* Wave 3 */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.25,
          animation: `${wave3Animation} 25s ease-in-out infinite`,
        }}
      >
        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{
            position: 'absolute',
            width: '200%',
            height: '100%',
          }}
        >
          <path
            fill="rgba(255, 255, 255, 0.08)"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,208C672,213,768,203,864,181.3C960,160,1056,128,1152,133.3C1248,139,1344,181,1392,202.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </Box>

      {/* Flow particles */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.12) 0%, transparent 40%)
          `,
        }}
      />
    </Box>
  );
};

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
        }}
      >
        {/* Wave pattern - only on mobile */}
        {/* Conditional rendering with display would show in DOM, so we check with JS */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <WavePattern />
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
            <Box 
              mt={4}
              sx={{
                backgroundColor: { xs: 'rgba(255, 255, 255, 0.15)', md: 'transparent' },
                backdropFilter: { xs: 'blur(10px)', md: 'none' },
                padding: { xs: 2, md: 0 },
                borderRadius: { xs: '12px', md: 0 },
                border: { xs: '1px solid rgba(255, 255, 255, 0.2)', md: 'none' },
              }}
            >
              <Typography
                variant="body2"
                textAlign="center"
                sx={{
                  color: { xs: 'white', md: 'text.secondary' },
                  fontWeight: { xs: 600, md: 400 },
                  '& a': {
                    color: { xs: 'white', md: 'primary.main' },
                    textDecoration: 'underline',
                    fontWeight: 700,
                  },
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




