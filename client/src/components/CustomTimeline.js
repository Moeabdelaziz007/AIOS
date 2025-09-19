/**
 * Custom Timeline Components
 * Alternative to @mui/lab Timeline components
 */

import { Avatar, Box } from '@mui/material';

// Timeline Container
export const Timeline = ({ children, sx = {} }) => <Box sx={{ position: 'relative', ...sx }}>{children}</Box>;

// Timeline Item
export const TimelineItem = ({ children, sx = {} }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'flex-start',
      marginBottom: 2,
      position: 'relative',
      ...sx
    }}
  >
    {children}
  </Box>
);

// Timeline Separator (connector line)
export const TimelineSeparator = ({ children, sx = {} }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginRight: 2,
      ...sx
    }}
  >
    {children}
  </Box>
);

// Timeline Dot
export const TimelineDot = ({ children, color = 'primary', sx = {} }) => (
  <Avatar
    sx={{
      width: 24,
      height: 24,
      backgroundColor: color === 'primary' ? 'primary.main' : 'grey.400',
      marginBottom: 1,
      ...sx
    }}
  >
    {children}
  </Avatar>
);

// Timeline Connector (line between dots)
export const TimelineConnector = ({ sx = {} }) => (
  <Box
    sx={{
      width: 2,
      height: 40,
      backgroundColor: 'grey.300',
      ...sx
    }}
  />
);

// Timeline Content
export const TimelineContent = ({ children, sx = {} }) => (
  <Box
    sx={{
      flex: 1,
      paddingBottom: 2,
      ...sx
    }}
  >
    {children}
  </Box>
);

// Timeline Opposite Content
export const TimelineOppositeContent = ({ children, sx = {} }) => (
  <Box
    sx={{
      flex: '0 0 auto',
      paddingRight: 2,
      textAlign: 'right',
      minWidth: 100,
      ...sx
    }}
  >
    {children}
  </Box>
);
