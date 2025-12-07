import { Box, CircularProgress } from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';

interface PullToRefreshIndicatorProps {
  isRefreshing: boolean;
  pullDistance: number;
  threshold: number;
}

const PullToRefreshIndicator = ({
  isRefreshing,
  pullDistance,
  threshold,
}: PullToRefreshIndicatorProps) => {
  const progress = Math.min((pullDistance / threshold) * 100, 100);
  const opacity = Math.min(pullDistance / threshold, 1);
  const scale = Math.min(0.5 + (pullDistance / threshold) * 0.5, 1);

  if (pullDistance === 0 && !isRefreshing) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: `translateX(-50%) translateY(${isRefreshing ? '16px' : `${Math.min(pullDistance / 2, 40)}px`})`,
        zIndex: 9999,
        transition: isRefreshing ? 'transform 0.3s ease' : 'none',
        opacity,
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          bgcolor: 'background.paper',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          transform: `scale(${scale})`,
          transition: 'transform 0.2s ease',
        }}
      >
        {isRefreshing ? (
          <CircularProgress size={24} />
        ) : (
          <RefreshRoundedIcon
            sx={{
              color: progress >= 100 ? 'primary.main' : 'text.secondary',
              transform: `rotate(${progress * 3.6}deg)`,
              transition: 'color 0.2s ease',
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default PullToRefreshIndicator;
