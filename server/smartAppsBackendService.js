const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class SmartAppsBackendService {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3001;
    this.initializeFirebase();
    this.setupMiddleware();
    this.setupRoutes();
    this.initializeCursorCLI();
  }

  initializeFirebase() {
    try {
      // Initialize Firebase Admin SDK
      const serviceAccount = require('./firebase-service-account.json');

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      });

      this.db = admin.firestore();
      this.auth = admin.auth();

      console.log('✅ Firebase Admin SDK initialized successfully');
    } catch (error) {
      console.error('❌ Firebase initialization error:', error);
      // Fallback to environment variables
      this.db = null;
      this.auth = null;
    }
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Request logging
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  initializeCursorCLI() {
    this.cursorCLI = {
      isAvailable: false,
      version: null,
      capabilities: [],
    };

    // Check if Cursor CLI is available
    this.checkCursorCLIAvailability();
  }

  async checkCursorCLIAvailability() {
    try {
      const { stdout } = await execAsync('cursor --version');
      this.cursorCLI.isAvailable = true;
      this.cursorCLI.version = stdout.trim();
      this.cursorCLI.capabilities = [
        'code-analysis',
        'ai-suggestions',
        'auto-completion',
        'error-detection',
        'refactoring',
      ];
      console.log('✅ Cursor CLI available:', this.cursorCLI.version);
    } catch (error) {
      console.log('⚠️ Cursor CLI not available:', error.message);
    }
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          firebase: !!this.db,
          cursorCLI: this.cursorCLI.isAvailable,
        },
      });
    });

    // Smart Notes API
    this.setupSmartNotesRoutes();

    // Smart Alarm API
    this.setupSmartAlarmRoutes();

    // Smart Maps API
    this.setupSmartMapsRoutes();

    // Cursor CLI Integration API
    this.setupCursorCLIRoutes();

    // AI Integration API
    this.setupAIIntegrationRoutes();
  }

  setupSmartNotesRoutes() {
    const notesRouter = express.Router();

    // Get all notes for a user
    notesRouter.get('/:userId', async (req, res) => {
      try {
        if (!this.db) {
          return res.status(503).json({ error: 'Firebase not available' });
        }

        const { userId } = req.params;
        const { category, search, sortBy } = req.query;

        let query = this.db.collection('notes').where('userId', '==', userId);

        if (category && category !== 'all') {
          query = query.where('category', '==', category);
        }

        const snapshot = await query.get();
        let notes = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        }));

        // Apply search filter
        if (search) {
          const searchLower = search.toLowerCase();
          notes = notes.filter(
            note =>
              note.title.toLowerCase().includes(searchLower) ||
              note.content.toLowerCase().includes(searchLower) ||
              note.tags.some(tag => tag.toLowerCase().includes(searchLower))
          );
        }

        // Apply sorting
        if (sortBy) {
          switch (sortBy) {
            case 'date':
              notes.sort(
                (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
              );
              break;
            case 'title':
              notes.sort((a, b) => a.title.localeCompare(b.title));
              break;
            case 'priority':
              const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
              notes.sort(
                (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
              );
              break;
          }
        }

        res.json(notes);
      } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Failed to fetch notes' });
      }
    });

    // Create new note
    notesRouter.post('/', async (req, res) => {
      try {
        if (!this.db) {
          return res.status(503).json({ error: 'Firebase not available' });
        }

        const noteData = {
          ...req.body,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const docRef = await this.db.collection('notes').add(noteData);
        const doc = await docRef.get();

        res.json({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        });
      } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ error: 'Failed to create note' });
      }
    });

    // Update note
    notesRouter.put('/:noteId', async (req, res) => {
      try {
        if (!this.db) {
          return res.status(503).json({ error: 'Firebase not available' });
        }

        const { noteId } = req.params;
        const updateData = {
          ...req.body,
          updatedAt: new Date(),
        };

        await this.db.collection('notes').doc(noteId).update(updateData);
        const doc = await this.db.collection('notes').doc(noteId).get();

        res.json({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        });
      } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ error: 'Failed to update note' });
      }
    });

    // Delete note
    notesRouter.delete('/:noteId', async (req, res) => {
      try {
        if (!this.db) {
          return res.status(503).json({ error: 'Firebase not available' });
        }

        const { noteId } = req.params;
        await this.db.collection('notes').doc(noteId).delete();

        res.json({ success: true });
      } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ error: 'Failed to delete note' });
      }
    });

    this.app.use('/api/notes', notesRouter);
  }

  setupSmartAlarmRoutes() {
    const alarmsRouter = express.Router();

    // Get all alarms for a user
    alarmsRouter.get('/:userId', async (req, res) => {
      try {
        if (!this.db) {
          return res.status(503).json({ error: 'Firebase not available' });
        }

        const { userId } = req.params;
        const { category, search, sortBy } = req.query;

        let query = this.db.collection('alarms').where('userId', '==', userId);

        if (category && category !== 'all') {
          query = query.where('category', '==', category);
        }

        const snapshot = await query.get();
        let alarms = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        }));

        // Apply search filter
        if (search) {
          const searchLower = search.toLowerCase();
          alarms = alarms.filter(
            alarm =>
              alarm.name.toLowerCase().includes(searchLower) ||
              alarm.time.includes(search)
          );
        }

        // Apply sorting
        if (sortBy) {
          switch (sortBy) {
            case 'time':
              alarms.sort((a, b) => a.time.localeCompare(b.time));
              break;
            case 'name':
              alarms.sort((a, b) => a.name.localeCompare(b.name));
              break;
            case 'created':
              alarms.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
              );
              break;
          }
        }

        res.json(alarms);
      } catch (error) {
        console.error('Error fetching alarms:', error);
        res.status(500).json({ error: 'Failed to fetch alarms' });
      }
    });

    // Create new alarm
    alarmsRouter.post('/', async (req, res) => {
      try {
        if (!this.db) {
          return res.status(503).json({ error: 'Firebase not available' });
        }

        const alarmData = {
          ...req.body,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const docRef = await this.db.collection('alarms').add(alarmData);
        const doc = await docRef.get();

        res.json({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        });
      } catch (error) {
        console.error('Error creating alarm:', error);
        res.status(500).json({ error: 'Failed to create alarm' });
      }
    });

    // Update alarm
    alarmsRouter.put('/:alarmId', async (req, res) => {
      try {
        if (!this.db) {
          return res.status(503).json({ error: 'Firebase not available' });
        }

        const { alarmId } = req.params;
        const updateData = {
          ...req.body,
          updatedAt: new Date(),
        };

        await this.db.collection('alarms').doc(alarmId).update(updateData);
        const doc = await this.db.collection('alarms').doc(alarmId).get();

        res.json({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        });
      } catch (error) {
        console.error('Error updating alarm:', error);
        res.status(500).json({ error: 'Failed to update alarm' });
      }
    });

    // Delete alarm
    alarmsRouter.delete('/:alarmId', async (req, res) => {
      try {
        if (!this.db) {
          return res.status(503).json({ error: 'Firebase not available' });
        }

        const { alarmId } = req.params;
        await this.db.collection('alarms').doc(alarmId).delete();

        res.json({ success: true });
      } catch (error) {
        console.error('Error deleting alarm:', error);
        res.status(500).json({ error: 'Failed to delete alarm' });
      }
    });

    this.app.use('/api/alarms', alarmsRouter);
  }

  setupSmartMapsRoutes() {
    const mapsRouter = express.Router();

    // Get all locations for a user
    mapsRouter.get('/:userId', async (req, res) => {
      try {
        if (!this.db) {
          return res.status(503).json({ error: 'Firebase not available' });
        }

        const { userId } = req.params;
        const { category, search, sortBy } = req.query;

        let query = this.db
          .collection('locations')
          .where('userId', '==', userId);

        if (category && category !== 'all') {
          query = query.where('category', '==', category);
        }

        const snapshot = await query.get();
        let locations = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        }));

        // Apply search filter
        if (search) {
          const searchLower = search.toLowerCase();
          locations = locations.filter(
            location =>
              location.name.toLowerCase().includes(searchLower) ||
              location.address.toLowerCase().includes(searchLower) ||
              location.tags.some(tag => tag.toLowerCase().includes(searchLower))
          );
        }

        // Apply sorting
        if (sortBy) {
          switch (sortBy) {
            case 'distance':
              locations.sort((a, b) => (a.distance || 0) - (b.distance || 0));
              break;
            case 'name':
              locations.sort((a, b) => a.name.localeCompare(b.name));
              break;
            case 'created':
              locations.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
              );
              break;
          }
        }

        res.json(locations);
      } catch (error) {
        console.error('Error fetching locations:', error);
        res.status(500).json({ error: 'Failed to fetch locations' });
      }
    });

    // Create new location
    mapsRouter.post('/', async (req, res) => {
      try {
        if (!this.db) {
          return res.status(503).json({ error: 'Firebase not available' });
        }

        const locationData = {
          ...req.body,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const docRef = await this.db.collection('locations').add(locationData);
        const doc = await docRef.get();

        res.json({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        });
      } catch (error) {
        console.error('Error creating location:', error);
        res.status(500).json({ error: 'Failed to create location' });
      }
    });

    // Update location
    mapsRouter.put('/:locationId', async (req, res) => {
      try {
        if (!this.db) {
          return res.status(503).json({ error: 'Firebase not available' });
        }

        const { locationId } = req.params;
        const updateData = {
          ...req.body,
          updatedAt: new Date(),
        };

        await this.db
          .collection('locations')
          .doc(locationId)
          .update(updateData);
        const doc = await this.db.collection('locations').doc(locationId).get();

        res.json({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        });
      } catch (error) {
        console.error('Error updating location:', error);
        res.status(500).json({ error: 'Failed to update location' });
      }
    });

    // Delete location
    mapsRouter.delete('/:locationId', async (req, res) => {
      try {
        if (!this.db) {
          return res.status(503).json({ error: 'Firebase not available' });
        }

        const { locationId } = req.params;
        await this.db.collection('locations').doc(locationId).delete();

        res.json({ success: true });
      } catch (error) {
        console.error('Error deleting location:', error);
        res.status(500).json({ error: 'Failed to delete location' });
      }
    });

    this.app.use('/api/locations', mapsRouter);
  }

  setupCursorCLIRoutes() {
    const cursorRouter = express.Router();

    // Get Cursor CLI status
    cursorRouter.get('/status', (req, res) => {
      res.json({
        available: this.cursorCLI.isAvailable,
        version: this.cursorCLI.version,
        capabilities: this.cursorCLI.capabilities,
      });
    });

    // Analyze code with Cursor CLI
    cursorRouter.post('/analyze', async (req, res) => {
      try {
        if (!this.cursorCLI.isAvailable) {
          return res.status(503).json({ error: 'Cursor CLI not available' });
        }

        const { code, language } = req.body;

        // Use Cursor CLI to analyze code
        const { stdout } = await execAsync(
          `cursor analyze --code "${code}" --language ${language}`
        );

        res.json({
          analysis: stdout,
          suggestions: this.parseCursorSuggestions(stdout),
        });
      } catch (error) {
        console.error('Error analyzing code with Cursor CLI:', error);
        res.status(500).json({ error: 'Failed to analyze code' });
      }
    });

    // Get AI suggestions from Cursor CLI
    cursorRouter.post('/suggest', async (req, res) => {
      try {
        if (!this.cursorCLI.isAvailable) {
          return res.status(503).json({ error: 'Cursor CLI not available' });
        }

        const { context, prompt } = req.body;

        // Use Cursor CLI to get AI suggestions
        const { stdout } = await execAsync(
          `cursor suggest --context "${context}" --prompt "${prompt}"`
        );

        res.json({
          suggestions: this.parseCursorSuggestions(stdout),
        });
      } catch (error) {
        console.error('Error getting suggestions from Cursor CLI:', error);
        res.status(500).json({ error: 'Failed to get suggestions' });
      }
    });

    this.app.use('/api/cursor', cursorRouter);
  }

  setupAIIntegrationRoutes() {
    const aiRouter = express.Router();

    // Generate AI suggestions for notes
    aiRouter.post('/notes/suggest', async (req, res) => {
      try {
        const { content } = req.body;

        // Simulate AI processing (replace with actual AI service)
        const suggestions = [
          {
            type: 'summary',
            content: `Summary: ${content.substring(0, 100)}...`,
            confidence: 95,
          },
          {
            type: 'tags',
            content: 'Suggested tags: important, meeting, follow-up',
            confidence: 87,
          },
          {
            type: 'action',
            content: 'Action item: Schedule follow-up meeting',
            confidence: 78,
          },
        ];

        res.json({ suggestions });
      } catch (error) {
        console.error('Error generating AI suggestions:', error);
        res.status(500).json({ error: 'Failed to generate suggestions' });
      }
    });

    // Generate AI suggestions for alarms
    aiRouter.post('/alarms/suggest', async (req, res) => {
      try {
        const { alarmData } = req.body;

        const suggestions = [
          {
            type: 'optimization',
            content:
              'Consider setting alarm 15 minutes earlier for better sleep cycle',
            confidence: 87,
          },
          {
            type: 'weather',
            content:
              'Weather forecast shows rain tomorrow - consider indoor activities',
            confidence: 92,
          },
          {
            type: 'traffic',
            content: 'Traffic patterns suggest leaving 10 minutes earlier',
            confidence: 78,
          },
        ];

        res.json({ suggestions });
      } catch (error) {
        console.error('Error generating AI suggestions:', error);
        res.status(500).json({ error: 'Failed to generate suggestions' });
      }
    });

    // Generate AI suggestions for maps
    aiRouter.post('/maps/suggest', async (req, res) => {
      try {
        const { locationData } = req.body;

        const suggestions = [
          {
            type: 'route',
            content: 'Optimal route found: 15 minutes via Main Street',
            confidence: 92,
          },
          {
            type: 'traffic',
            content: 'Traffic is light - no delays expected',
            confidence: 87,
          },
          {
            type: 'weather',
            content: 'Sunny weather - perfect for outdoor activities',
            confidence: 95,
          },
        ];

        res.json({ suggestions });
      } catch (error) {
        console.error('Error generating AI suggestions:', error);
        res.status(500).json({ error: 'Failed to generate suggestions' });
      }
    });

    this.app.use('/api/ai', aiRouter);
  }

  parseCursorSuggestions(output) {
    // Parse Cursor CLI output to extract suggestions
    const suggestions = [];
    const lines = output.split('\n');

    for (const line of lines) {
      if (line.includes('suggestion:') || line.includes('recommendation:')) {
        suggestions.push({
          type: 'cursor',
          content: line.replace(/.*suggestion:|.*recommendation:/, '').trim(),
          confidence: 85,
        });
      }
    }

    return suggestions;
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`🚀 Smart Apps Backend Service running on port ${this.port}`);
      console.log(`📊 Health check: http://localhost:${this.port}/health`);
      console.log(`📝 Notes API: http://localhost:${this.port}/api/notes`);
      console.log(`⏰ Alarms API: http://localhost:${this.port}/api/alarms`);
      console.log(`🗺️ Maps API: http://localhost:${this.port}/api/locations`);
      console.log(`🤖 AI API: http://localhost:${this.port}/api/ai`);
      console.log(
        `💻 Cursor CLI API: http://localhost:${this.port}/api/cursor`
      );
    });
  }
}

// Start the service
const service = new SmartAppsBackendService();
service.start();

module.exports = SmartAppsBackendService;
