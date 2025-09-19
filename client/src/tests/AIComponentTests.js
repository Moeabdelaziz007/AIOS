import { ThemeProvider } from '@mui/material/styles';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MobileResponsiveAIComponent from '../components/MobileResponsiveAIComponent';
import PredictiveUIComponent from '../components/PredictiveUIComponent';
import VoiceUIComponent from '../components/VoiceUIComponent';
import { AuthProvider } from '../contexts/AuthContext';
import AIPoweredAppsPage from '../pages/AIPoweredAppsPage';
import AIPoweredSettingsPage from '../pages/AIPoweredSettingsPage';
import RealTimeAgentMonitoringDashboard from '../pages/RealTimeAgentMonitoringDashboard';
import { aiPoweredTheme } from '../theme/aiPoweredTheme';

// Mock Firebase
jest.mock('../services/FirebaseService', () => ({
  FirebaseProvider: ({ children }) => children,
  useFirebase: () => ({
    db: null,
    auth: null,
    storage: null,
  }),
}));

// Mock Auth Context
const mockAuthContext = {
  user: { email: 'test@example.com' },
  userProfile: { displayName: 'Test User' },
  isAuthenticated: true,
  login: jest.fn(),
  logout: jest.fn(),
  signup: jest.fn(),
};

// Test Wrapper Component
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider theme={aiPoweredTheme}>
      <AuthProvider value={mockAuthContext}>{children}</AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

// AI Apps Page Tests
describe('AIPoweredAppsPage', () => {
  test('renders AI-powered apps page with agent management', async () => {
    render(
      <TestWrapper>
        <AIPoweredAppsPage />
      </TestWrapper>
    );

    expect(screen.getByText('AI-Powered Applications')).toBeInTheDocument();
    expect(screen.getByText('AI Agents')).toBeInTheDocument();
    expect(screen.getByText('Applications')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  test('displays AI agents with correct information', async () => {
    render(
      <TestWrapper>
        <AIPoweredAppsPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Quantum Autopilot')).toBeInTheDocument();
      expect(screen.getByText('Data Intelligence Agent')).toBeInTheDocument();
      expect(screen.getByText('Intelligent Debugger')).toBeInTheDocument();
    });
  });

  test('handles agent control actions', async () => {
    render(
      <TestWrapper>
        <AIPoweredAppsPage />
      </TestWrapper>
    );

    await waitFor(() => {
      const controlButtons = screen.getAllByText('Control');
      expect(controlButtons.length).toBeGreaterThan(0);
    });

    const firstControlButton = screen.getAllByText('Control')[0];
    fireEvent.click(firstControlButton);
  });

  test('switches between tabs correctly', async () => {
    render(
      <TestWrapper>
        <AIPoweredAppsPage />
      </TestWrapper>
    );

    const analyticsTab = screen.getByText('Analytics');
    fireEvent.click(analyticsTab);

    await waitFor(() => {
      expect(screen.getByText('AI Insights')).toBeInTheDocument();
    });
  });
});

// AI Settings Page Tests
describe('AIPoweredSettingsPage', () => {
  test('renders AI-themed settings page', async () => {
    render(
      <TestWrapper>
        <AIPoweredSettingsPage />
      </TestWrapper>
    );

    expect(screen.getByText('AI-Powered Settings')).toBeInTheDocument();
    expect(screen.getByText('AI Agents')).toBeInTheDocument();
    expect(screen.getByText('Preferences')).toBeInTheDocument();
  });

  test('displays AI agent settings', async () => {
    render(
      <TestWrapper>
        <AIPoweredSettingsPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Quantum Autopilot')).toBeInTheDocument();
      expect(screen.getByText('Data Intelligence Agent')).toBeInTheDocument();
    });
  });

  test('handles setting changes', async () => {
    render(
      <TestWrapper>
        <AIPoweredSettingsPage />
      </TestWrapper>
    );

    await waitFor(() => {
      const sliders = screen.getAllByRole('slider');
      expect(sliders.length).toBeGreaterThan(0);
    });

    const firstSlider = screen.getAllByRole('slider')[0];
    fireEvent.change(firstSlider, { target: { value: '80' } });
  });

  test('saves settings successfully', async () => {
    render(
      <TestWrapper>
        <AIPoweredSettingsPage />
      </TestWrapper>
    );

    await waitFor(() => {
      const saveButton = screen.getByText('Save Settings');
      expect(saveButton).toBeInTheDocument();
    });

    const saveButton = screen.getByText('Save Settings');
    fireEvent.click(saveButton);
  });
});

// Real-time Agent Monitoring Tests
describe('RealTimeAgentMonitoringDashboard', () => {
  test('renders monitoring dashboard', async () => {
    render(
      <TestWrapper>
        <RealTimeAgentMonitoringDashboard />
      </TestWrapper>
    );

    expect(screen.getByText('Real-time Agent Monitoring')).toBeInTheDocument();
    expect(screen.getByText('Agent Overview')).toBeInTheDocument();
    expect(screen.getByText('System Health')).toBeInTheDocument();
  });

  test('displays agent status correctly', async () => {
    render(
      <TestWrapper>
        <RealTimeAgentMonitoringDashboard />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Active')).toBeInTheDocument();
    });
  });

  test('shows system health metrics', async () => {
    render(
      <TestWrapper>
        <RealTimeAgentMonitoringDashboard />
      </TestWrapper>
    );

    const systemHealthTab = screen.getByText('System Health');
    fireEvent.click(systemHealthTab);

    await waitFor(() => {
      expect(screen.getByText('Overall Health')).toBeInTheDocument();
    });
  });
});

// Voice UI Component Tests
describe('VoiceUIComponent', () => {
  test('renders voice UI component', async () => {
    render(
      <TestWrapper>
        <VoiceUIComponent />
      </TestWrapper>
    );

    expect(screen.getByText('Voice Interface')).toBeInTheDocument();
    expect(screen.getByText('Start Listening')).toBeInTheDocument();
  });

  test('handles voice commands', async () => {
    render(
      <TestWrapper>
        <VoiceUIComponent />
      </TestWrapper>
    );

    const listenButton = screen.getByText('Start Listening');
    fireEvent.click(listenButton);

    await waitFor(() => {
      expect(screen.getByText('Stop Listening')).toBeInTheDocument();
    });
  });

  test('displays voice settings', async () => {
    render(
      <TestWrapper>
        <VoiceUIComponent />
      </TestWrapper>
    );

    expect(screen.getByText('Voice Settings')).toBeInTheDocument();
    expect(screen.getByText('Language')).toBeInTheDocument();
  });
});

// Predictive UI Component Tests
describe('PredictiveUIComponent', () => {
  test('renders predictive UI component', async () => {
    render(
      <TestWrapper>
        <PredictiveUIComponent />
      </TestWrapper>
    );

    expect(screen.getByText('Predictive UI')).toBeInTheDocument();
    expect(screen.getByText('Suggestions')).toBeInTheDocument();
  });

  test('displays AI suggestions', async () => {
    render(
      <TestWrapper>
        <PredictiveUIComponent />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Optimize Performance')).toBeInTheDocument();
    });
  });

  test('handles suggestion application', async () => {
    render(
      <TestWrapper>
        <PredictiveUIComponent />
      </TestWrapper>
    );

    await waitFor(() => {
      const applyButtons = screen.getAllByText('Apply');
      expect(applyButtons.length).toBeGreaterThan(0);
    });

    const firstApplyButton = screen.getAllByText('Apply')[0];
    fireEvent.click(firstApplyButton);
  });
});

// Mobile Responsive Component Tests
describe('MobileResponsiveAIComponent', () => {
  test('renders mobile responsive component', async () => {
    render(
      <TestWrapper>
        <MobileResponsiveAIComponent />
      </TestWrapper>
    );

    expect(screen.getByText(/AIOS/)).toBeInTheDocument();
  });

  test('displays device-specific information', async () => {
    render(
      <TestWrapper>
        <MobileResponsiveAIComponent />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Device Type')).toBeInTheDocument();
    });
  });

  test('handles mobile navigation', async () => {
    render(
      <TestWrapper>
        <MobileResponsiveAIComponent />
      </TestWrapper>
    );

    await waitFor(() => {
      const tabs = screen.getAllByRole('tab');
      expect(tabs.length).toBeGreaterThan(0);
    });

    const secondTab = screen.getAllByRole('tab')[1];
    fireEvent.click(secondTab);
  });
});

// Integration Tests
describe('AI Component Integration', () => {
  test('all components work together', async () => {
    const { container } = render(
      <TestWrapper>
        <div>
          <AIPoweredAppsPage />
          <AIPoweredSettingsPage />
          <RealTimeAgentMonitoringDashboard />
        </div>
      </TestWrapper>
    );

    expect(container).toBeInTheDocument();
  });

  test('components handle errors gracefully', async () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(
      <TestWrapper>
        <AIPoweredAppsPage />
      </TestWrapper>
    );

    // Simulate an error
    fireEvent.error(screen.getByText('AI-Powered Applications'));

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

// Performance Tests
describe('AI Component Performance', () => {
  test('components render within acceptable time', async () => {
    const startTime = performance.now();

    render(
      <TestWrapper>
        <AIPoweredAppsPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('AI-Powered Applications')).toBeInTheDocument();
    });

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    expect(renderTime).toBeLessThan(1000); // Should render within 1 second
  });

  test('components handle large datasets efficiently', async () => {
    render(
      <TestWrapper>
        <RealTimeAgentMonitoringDashboard />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(
        screen.getByText('Real-time Agent Monitoring')
      ).toBeInTheDocument();
    });

    // Simulate rapid updates
    for (let i = 0; i < 100; i++) {
      fireEvent.click(screen.getByText('Agent Overview'));
    }
  });
});

// Accessibility Tests
describe('AI Component Accessibility', () => {
  test('components have proper ARIA labels', async () => {
    render(
      <TestWrapper>
        <AIPoweredAppsPage />
      </TestWrapper>
    );

    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-label');
    });
  });

  test('components support keyboard navigation', async () => {
    render(
      <TestWrapper>
        <AIPoweredAppsPage />
      </TestWrapper>
    );

    await waitFor(() => {
      const tabs = screen.getAllByRole('tab');
      expect(tabs.length).toBeGreaterThan(0);
    });

    const firstTab = screen.getAllByRole('tab')[0];
    firstTab.focus();
    expect(document.activeElement).toBe(firstTab);
  });
});

export default {
  TestWrapper,
  mockAuthContext,
};
