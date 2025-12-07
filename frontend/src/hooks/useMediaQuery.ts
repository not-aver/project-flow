import { useTheme } from '@mui/material/styles';
import { useMediaQuery as useMuiMediaQuery } from '@mui/material';

/**
 * Custom hook for responsive design
 */
export const useResponsive = () => {
  const theme = useTheme();
  
  const isMobile = useMuiMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMuiMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMuiMediaQuery(theme.breakpoints.up('md'));
  const isLargeDesktop = useMuiMediaQuery(theme.breakpoints.up('lg'));

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isMobileOrTablet: isMobile || isTablet,
  };
};
