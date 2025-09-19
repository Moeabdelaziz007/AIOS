import {
  AccountBalance,
  Add,
  Analytics,
  CreditCard,
  Receipt,
  Savings,
  SmartToy,
  TrendingUp,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

const SmartFinanceManagerApp = () => {
  const [transactions, setTransactions] = useState([]);
  const [aiInsights, setAiInsights] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [addTransactionOpen, setAddTransactionOpen] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date(),
  });
  const [budgets, setBudgets] = useState([]);
  const [financialGoals, setFinancialGoals] = useState([]);
  const [fraudAlerts, setFraudAlerts] = useState([]);

  // AI-powered financial analysis
  const analyzeFinances = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/smart-finance/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactions,
          budgets,
          goals: financialGoals,
          userProfile: getUserProfile(),
        }),
      });
      const analysis = await response.json();
      setAiInsights(analysis.insights);
      setAiSuggestions(analysis.suggestions);
    } catch (error) {
      console.error('Financial analysis failed:', error);
    }
    setIsAnalyzing(false);
  };

  // Predictive financial planning
  const generateFinancialPredictions = async () => {
    try {
      const response = await fetch('/api/smart-finance/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactions,
          patterns: analyzeSpendingPatterns(),
          goals: financialGoals,
        }),
      });
      const predictions = await response.json();
      setAiSuggestions(predictions.suggestions);
    } catch (error) {
      console.error('Financial predictions failed:', error);
    }
  };

  // Smart expense categorization
  const categorizeExpenses = async () => {
    try {
      const response = await fetch('/api/smart-finance/categorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions }),
      });
      const categorization = await response.json();
      setTransactions(categorization.categorizedTransactions);
    } catch (error) {
      console.error('Expense categorization failed:', error);
    }
  };

  // Fraud detection
  const detectFraud = async () => {
    try {
      const response = await fetch('/api/smart-finance/fraud-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactions,
          userPatterns: getUserPatterns(),
          riskFactors: getRiskFactors(),
        }),
      });
      const fraud = await response.json();
      setFraudAlerts(fraud.alerts);
    } catch (error) {
      console.error('Fraud detection failed:', error);
    }
  };

  // Investment recommendations
  const generateInvestmentRecommendations = async () => {
    try {
      const response = await fetch(
        '/api/smart-finance/investment-recommendations',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            financialGoals,
            riskTolerance: getRiskTolerance(),
            availableFunds: getAvailableFunds(),
          }),
        }
      );
      const recommendations = await response.json();
      setAiSuggestions(recommendations);
    } catch (error) {
      console.error('Investment recommendations failed:', error);
    }
  };

  const getUserProfile = () => ({
    age: 30,
    income: 75000,
    expenses: 45000,
    savings: 30000,
    riskTolerance: 'moderate',
    financialGoals: ['retirement', 'house', 'emergency'],
  });

  const analyzeSpendingPatterns = () => ({
    monthlyAverage: 3750,
    topCategories: ['food', 'transportation', 'entertainment'],
    seasonalTrends: ['higher_in_winter', 'lower_in_summer'],
    paymentMethods: ['credit_card', 'debit_card', 'cash'],
  });

  const getUserPatterns = () => ({
    typicalAmounts: [25, 50, 100, 200],
    frequentMerchants: ['grocery_store', 'gas_station', 'restaurant'],
    spendingTimes: ['morning', 'evening'],
    locations: ['local', 'online'],
  });

  const getRiskFactors = () => ({
    unusualAmounts: true,
    foreignTransactions: false,
    lateNightPurchases: false,
    rapidSuccession: false,
  });

  const getRiskTolerance = () => ({
    level: 'moderate',
    investmentExperience: 'intermediate',
    timeHorizon: 'long_term',
    lossCapacity: 'medium',
  });

  const getAvailableFunds = () => ({
    emergency: 10000,
    investment: 5000,
    savings: 15000,
    checking: 2000,
  });

  const handleAddTransaction = async () => {
    const transactionWithAI = {
      ...newTransaction,
      id: Date.now(),
      aiCategorized: true,
      fraudRisk: calculateFraudRisk(newTransaction),
      budgetImpact: calculateBudgetImpact(newTransaction),
      recommendations: generateTransactionRecommendations(newTransaction),
    };

    setTransactions([...transactions, transactionWithAI]);
    setAddTransactionOpen(false);
    setNewTransaction({
      type: 'expense',
      amount: '',
      category: '',
      description: '',
      date: new Date(),
    });

    // Trigger AI analysis after adding transaction
    setTimeout(() => analyzeFinances(), 1000);
  };

  const calculateFraudRisk = transaction => {
    let risk = 0;

    // Check for unusual amounts
    const amount = parseFloat(transaction.amount);
    if (amount > 1000) risk += 2;
    if (amount > 5000) risk += 3;

    // Check for unusual times (simplified)
    const hour = new Date().getHours();
    if (hour < 6 || hour > 22) risk += 1;

    // Check for foreign transactions (simplified)
    if (transaction.description.toLowerCase().includes('foreign')) risk += 2;

    return risk >= 3 ? 'high' : risk >= 1 ? 'medium' : 'low';
  };

  const calculateBudgetImpact = transaction => {
    const amount = parseFloat(transaction.amount);
    const category = transaction.category;

    // Find relevant budget
    const budget = budgets.find(b => b.category === category);
    if (!budget) return 'no_budget';

    const spent = transactions
      .filter(t => t.category === category && t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const remaining = budget.limit - spent - amount;

    if (remaining < 0) return 'over_budget';
    if (remaining < budget.limit * 0.1) return 'near_limit';
    return 'within_budget';
  };

  const generateTransactionRecommendations = transaction => {
    const recommendations = [];

    if (transaction.type === 'expense') {
      const amount = parseFloat(transaction.amount);
      if (amount > 500) {
        recommendations.push('Consider if this expense is necessary');
      }
      if (transaction.category === 'entertainment' && amount > 200) {
        recommendations.push('Look for entertainment alternatives');
      }
    }

    return recommendations;
  };

  const applyAISuggestion = suggestion => {
    switch (suggestion.type) {
      case 'budget_adjustment':
        setBudgets(
          budgets.map(budget =>
            budget.id === suggestion.budgetId
              ? { ...budget, limit: suggestion.newLimit }
              : budget
          )
        );
        break;
      case 'investment_recommendation':
        // Add investment to goals
        const newGoal = {
          id: Date.now(),
          type: 'investment',
          description: suggestion.investment,
          target: suggestion.target,
          timeline: suggestion.timeline,
        };
        setFinancialGoals([...financialGoals, newGoal]);
        break;
      case 'expense_reduction':
        // Suggest expense reduction strategies
        console.log('Expense reduction suggestion:', suggestion);
        break;
    }

    setAiSuggestions(aiSuggestions.filter(s => s.id !== suggestion.id));
  };

  const getTransactionIcon = type => {
    switch (type) {
      case 'income':
        return <TrendingUp />;
      case 'expense':
        return <Receipt />;
      case 'transfer':
        return <AccountBalance />;
      case 'investment':
        return <Savings />;
      default:
        return <CreditCard />;
    }
  };

  const getTransactionColor = type => {
    switch (type) {
      case 'income':
        return 'success';
      case 'expense':
        return 'error';
      case 'transfer':
        return 'info';
      case 'investment':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getFraudRiskColor = risk => {
    switch (risk) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  useEffect(() => {
    // Load initial data and run AI analysis
    analyzeFinances();
    generateFinancialPredictions();
    detectFraud();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <AccountBalance sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
        <Box>
          <Typography variant='h4' component='h1'>
            Smart Finance Manager
          </Typography>
          <Typography variant='subtitle1' color='text.secondary'>
            AI-Powered Financial Analysis & Predictions
          </Typography>
        </Box>
      </Box>

      {/* AI Financial Insights */}
      {aiInsights && (
        <Alert severity='info' sx={{ mb: 3 }}>
          <Typography variant='h6'>AI Financial Insights</Typography>
          <Typography>{aiInsights.summary}</Typography>
          <Typography variant='body2' sx={{ mt: 1 }}>
            Net Worth: ${aiInsights.netWorth} | Monthly Savings: $
            {aiInsights.monthlySavings} | Financial Health:{' '}
            {aiInsights.healthScore}% | Recommendations:{' '}
            {aiInsights.recommendations}
          </Typography>
        </Alert>
      )}

      {/* Fraud Alerts */}
      {fraudAlerts.length > 0 && (
        <Alert severity='error' sx={{ mb: 3 }}>
          <Typography variant='h6'>Fraud Detection Alerts</Typography>
          {fraudAlerts.map((alert, index) => (
            <Typography key={index} variant='body2'>
              • {alert.message}
            </Typography>
          ))}
        </Alert>
      )}

      {/* Finance Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={(e, newValue) => setCurrentTab(newValue)}
        >
          <Tab icon={<Receipt />} label='Transactions' />
          <Tab icon={<Analytics />} label='Analytics' />
          <Tab icon={<Savings />} label='Goals' />
          <Tab icon={<SmartToy />} label='AI Insights' />
        </Tabs>
      </Card>

      <Grid container spacing={3}>
        {/* Transactions */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant='h6'>Financial Transactions</Typography>
                <Box>
                  <Button
                    variant='outlined'
                    startIcon={<SmartToy />}
                    onClick={analyzeFinances}
                    disabled={isAnalyzing}
                    sx={{ mr: 1 }}
                  >
                    AI Analyze
                  </Button>
                  <Button
                    variant='outlined'
                    startIcon={<TrendingUp />}
                    onClick={generateFinancialPredictions}
                  >
                    Predictions
                  </Button>
                  <Button
                    variant='outlined'
                    onClick={detectFraud}
                    sx={{ ml: 1 }}
                  >
                    Detect Fraud
                  </Button>
                </Box>
              </Box>

              {isAnalyzing && <LinearProgress sx={{ mb: 2 }} />}

              <List>
                {transactions.map(transaction => (
                  <ListItem
                    key={transaction.id}
                    sx={{
                      border: '1px solid #e0e0e0',
                      mb: 1,
                      borderRadius: 1,
                    }}
                  >
                    <ListItemIcon>
                      {getTransactionIcon(transaction.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Typography variant='h6'>
                            ${transaction.amount}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip
                              label={transaction.type}
                              color={getTransactionColor(transaction.type)}
                              size='small'
                            />
                            {transaction.fraudRisk && (
                              <Chip
                                label={`Risk: ${transaction.fraudRisk}`}
                                color={getFraudRiskColor(transaction.fraudRisk)}
                                size='small'
                                variant='outlined'
                              />
                            )}
                            {transaction.budgetImpact && (
                              <Chip
                                label={transaction.budgetImpact}
                                color={
                                  transaction.budgetImpact === 'over_budget'
                                    ? 'error'
                                    : 'success'
                                }
                                size='small'
                              />
                            )}
                            {transaction.aiCategorized && (
                              <Chip label='AI' size='small' color='secondary' />
                            )}
                          </Box>
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant='body2' color='text.secondary'>
                            {transaction.description} • {transaction.category}
                          </Typography>
                          <Typography variant='body2' color='text.secondary'>
                            {transaction.date?.toLocaleDateString()}
                          </Typography>
                          {transaction.recommendations &&
                            transaction.recommendations.length > 0 && (
                              <Box sx={{ mt: 1 }}>
                                {transaction.recommendations.map(
                                  (rec, index) => (
                                    <Chip
                                      key={index}
                                      label={rec}
                                      size='small'
                                      color='primary'
                                      sx={{ mr: 1 }}
                                    />
                                  )
                                )}
                              </Box>
                            )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Suggestions Panel */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant='h6' sx={{ mb: 2 }}>
                AI Financial Suggestions
              </Typography>

              {aiSuggestions.map(suggestion => (
                <Paper
                  key={suggestion.id}
                  sx={{
                    p: 2,
                    mb: 2,
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                  }}
                >
                  <Typography variant='subtitle2' sx={{ mb: 1 }}>
                    {suggestion.type}
                  </Typography>
                  <Typography variant='body2' sx={{ mb: 2 }}>
                    {suggestion.description}
                  </Typography>
                  <Button
                    size='small'
                    variant='contained'
                    onClick={() => applyAISuggestion(suggestion)}
                    sx={{ bgcolor: 'white', color: 'primary.main' }}
                  >
                    Apply
                  </Button>
                </Paper>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Floating Action Button */}
      <Fab
        color='primary'
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setAddTransactionOpen(true)}
      >
        <Add />
      </Fab>

      {/* Add Transaction Dialog */}
      <Dialog
        open={addTransactionOpen}
        onClose={() => setAddTransactionOpen(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>Add Financial Transaction</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label='Transaction Type'
            value={newTransaction.type}
            onChange={e =>
              setNewTransaction({ ...newTransaction, type: e.target.value })
            }
            SelectProps={{ native: true }}
            sx={{ mb: 2, mt: 1 }}
          >
            <option value='income'>Income</option>
            <option value='expense'>Expense</option>
            <option value='transfer'>Transfer</option>
            <option value='investment'>Investment</option>
          </TextField>
          <TextField
            fullWidth
            label='Amount'
            type='number'
            value={newTransaction.amount}
            onChange={e =>
              setNewTransaction({ ...newTransaction, amount: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label='Category'
            value={newTransaction.category}
            onChange={e =>
              setNewTransaction({ ...newTransaction, category: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label='Description'
            multiline
            rows={3}
            value={newTransaction.description}
            onChange={e =>
              setNewTransaction({
                ...newTransaction,
                description: e.target.value,
              })
            }
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddTransactionOpen(false)}>Cancel</Button>
          <Button onClick={handleAddTransaction} variant='contained'>
            Add Transaction
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SmartFinanceManagerApp;
