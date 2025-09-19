import {
  Analytics,
  AutoAwesome,
  BugReport,
  CloudSync,
  Code,
  DataObject,
  Memory,
  NetworkCheck,
  Psychology,
  Security,
  SmartToy,
  Speed,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Fade,
  Grow,
  LinearProgress,
  Typography,
} from '@mui/material';
import {
  aiAgentColors,
  aiAnimations,
  aiGradients,
  aiStyles,
} from '../theme/aiPoweredTheme';

// AI Agent Status Indicator Component
export const AIAgentStatus = ({ status, agentName, lastActive, ...props }) => {
  const getStatusColor = status => {
    switch (status) {
      case 'active':
        return aiAgentColors.active;
      case 'processing':
        return aiAgentColors.processing;
      case 'learning':
        return aiAgentColors.learning;
      case 'optimizing':
        return aiAgentColors.optimizing;
      case 'error':
        return aiAgentColors.error;
      case 'offline':
        return aiAgentColors.offline;
      default:
        return aiAgentColors.offline;
    }
  };

  const getStatusIcon = status => {
    switch (status) {
      case 'active':
        return <Psychology sx={{ color: 'inherit' }} />;
      case 'processing':
        return <Speed sx={{ color: 'inherit' }} />;
      case 'learning':
        return <Memory sx={{ color: 'inherit' }} />;
      case 'optimizing':
        return <AutoAwesome sx={{ color: 'inherit' }} />;
      case 'error':
        return <BugReport sx={{ color: 'inherit' }} />;
      default:
        return <SmartToy sx={{ color: 'inherit' }} />;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 1,
        borderRadius: 2,
        background: `linear-gradient(135deg, ${getStatusColor(
          status
        )}20, ${getStatusColor(status)}10)`,
        border: `1px solid ${getStatusColor(status)}40`,
        ...aiStyles.smartHover,
      }}
      {...props}
    >
      <Avatar
        sx={{
          width: 32,
          height: 32,
          background: aiGradients.primary,
          animation:
            status === 'processing'
              ? aiAnimations.neuralPulse.animation
              : 'none',
        }}
      >
        {getStatusIcon(status)}
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
          {agentName}
        </Typography>
        <Typography variant='caption' sx={{ color: 'text.secondary' }}>
          {lastActive}
        </Typography>
      </Box>
      <Chip
        label={status}
        size='small'
        sx={{
          backgroundColor: getStatusColor(status),
          color: 'white',
          fontWeight: 500,
          textTransform: 'capitalize',
        }}
      />
    </Box>
  );
};

// AI Agent Card Component
export const AIAgentCard = ({
  title,
  description,
  status,
  capabilities = [],
  performance = 0,
  icon,
  onClick,
  ...props
}) => {
  return (
    <Grow in timeout={600}>
      <Card
        sx={{
          ...aiStyles.aiCard,
          cursor: onClick ? 'pointer' : 'default',
          ...aiStyles.smartHover,
          ...aiStyles.poweredByAI,
        }}
        onClick={onClick}
        {...props}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                background: aiGradients.primary,
                mr: 2,
                animation:
                  status === 'active'
                    ? aiAnimations.neuralPulse.animation
                    : 'none',
              }}
            >
              {icon || <SmartToy />}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant='h6' sx={{ fontWeight: 600, mb: 0.5 }}>
                {title}
              </Typography>
              <Chip
                label={status}
                size='small'
                sx={{
                  backgroundColor:
                    aiAgentColors[status] || aiAgentColors.offline,
                  color: 'white',
                  fontWeight: 500,
                  textTransform: 'capitalize',
                }}
              />
            </Box>
          </Box>

          <Typography variant='body2' sx={{ color: 'text.secondary', mb: 2 }}>
            {description}
          </Typography>

          {capabilities.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant='caption'
                sx={{ color: 'text.secondary', mb: 1, display: 'block' }}
              >
                Capabilities:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {capabilities.map((capability, index) => (
                  <Chip
                    key={index}
                    label={capability}
                    size='small'
                    variant='outlined'
                    sx={{
                      fontSize: '0.7rem',
                      height: 24,
                      borderColor: aiAgentColors.primary,
                      color: aiAgentColors.primary,
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {performance > 0 && (
            <Box>
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
              >
                <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                  Performance
                </Typography>
                <Typography variant='caption' sx={{ fontWeight: 600 }}>
                  {performance}%
                </Typography>
              </Box>
              <LinearProgress
                variant='determinate'
                value={performance}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    background: aiGradients.primary,
                    borderRadius: 3,
                  },
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </Grow>
  );
};

// AI Agent Grid Component
export const AIAgentGrid = ({ agents = [], onAgentClick }) => {
  const agentIcons = {
    'Quantum Autopilot': <AutoAwesome />,
    'Debugger Agent': <BugReport />,
    'Data Agent': <DataObject />,
    'Learning Agent': <Memory />,
    'Security Agent': <Security />,
    'Performance Agent': <Analytics />,
    'Network Agent': <NetworkCheck />,
    'Code Agent': <Code />,
    'Sync Agent': <CloudSync />,
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
        gap: 3,
        p: 2,
      }}
    >
      {agents.map((agent, index) => (
        <AIAgentCard
          key={agent.id || index}
          title={agent.name}
          description={agent.description}
          status={agent.status}
          capabilities={agent.capabilities}
          performance={agent.performance}
          icon={agentIcons[agent.name]}
          onClick={() => onAgentClick?.(agent)}
        />
      ))}
    </Box>
  );
};

// AI Processing Indicator Component
export const AIProcessingIndicator = ({
  isProcessing,
  message = 'AI is thinking...',
}) => {
  if (!isProcessing) return null;

  return (
    <Fade in={isProcessing}>
      <Box
        sx={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          borderRadius: 3,
          background: aiStyles.glassMorphism.background,
          backdropFilter: aiStyles.glassMorphism.backdropFilter,
          border: aiStyles.glassMorphism.border,
          boxShadow: aiStyles.glassMorphism.boxShadow,
        }}
      >
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: aiGradients.primary,
            animation: aiAnimations.aiRotate.animation,
          }}
        />
        <Typography variant='body2' sx={{ fontWeight: 500 }}>
          {message}
        </Typography>
      </Box>
    </Fade>
  );
};

// AI Powered Badge Component
export const AIPoweredBadge = ({ variant = 'default', ...props }) => {
  const variants = {
    default: {
      background: aiGradients.primary,
      color: 'white',
      text: 'Powered by AI',
    },
    neural: {
      background: aiGradients.neural,
      color: 'white',
      text: 'Neural AI',
    },
    quantum: {
      background: aiGradients.quantum,
      color: 'white',
      text: 'Quantum AI',
    },
    minimal: {
      background: 'transparent',
      color: aiAgentColors.primary,
      text: 'AI',
      border: `1px solid ${aiAgentColors.primary}`,
    },
  };

  const currentVariant = variants[variant] || variants.default;

  return (
    <Chip
      label={currentVariant.text}
      size='small'
      sx={{
        background: currentVariant.background,
        color: currentVariant.color,
        border: currentVariant.border,
        fontWeight: 600,
        fontSize: '0.7rem',
        height: 24,
        ...aiStyles.smartHover,
      }}
      {...props}
    />
  );
};

// AI Agent Performance Chart Component
export const AIAgentPerformanceChart = ({
  data = [],
  title = 'Agent Performance',
}) => {
  const maxValue = Math.max(...data.map(d => d.value), 100);

  return (
    <Card sx={{ ...aiStyles.aiCard, ...aiStyles.poweredByAI }}>
      <CardContent>
        <Typography variant='h6' sx={{ mb: 3, fontWeight: 600 }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {data.map((item, index) => (
            <Box key={index}>
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
              >
                <Typography variant='body2' sx={{ fontWeight: 500 }}>
                  {item.name}
                </Typography>
                <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                  {item.value}%
                </Typography>
              </Box>
              <LinearProgress
                variant='determinate'
                value={(item.value / maxValue) * 100}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    background: aiGradients.primary,
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

const AIAgentComponents = {
  AIAgentStatus,
  AIAgentCard,
  AIAgentGrid,
  AIProcessingIndicator,
  AIPoweredBadge,
  AIAgentPerformanceChart,
};

export default AIAgentComponents;
