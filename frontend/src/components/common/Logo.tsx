import { Typography } from '@mui/material';

type LogoProps = {
  color?: string;
};

const Logo = ({ color = '#0F172A' }: LogoProps) => (
  <Typography
    variant="h5"
    fontWeight={700}
    letterSpacing={0.5}
    sx={{ color, display: 'inline-flex', alignItems: 'center', gap: 1 }}
  >
    <span
      style={{
        display: 'inline-flex',
        width: 26,
        height: 26,
        borderRadius: '8px',
        background: 'linear-gradient(135deg, #7C3AED, #0EA5E9)',
      }}
    />
    ProjectFlow
  </Typography>
);

export default Logo;




