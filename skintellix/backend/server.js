require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Security & Middleware ──────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(compression());
app.use(morgan('combined'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ────────────────────────────────────────────────────────
const authRoutes         = require('./routes/auth');
const skinAnalysisRoutes = require('./routes/skinAnalysis');
const productsRoutes     = require('./routes/products');
const compareRoutes      = require('./routes/compare');
const makeupRoutes       = require('./routes/makeup');
const userRoutes         = require('./routes/user');
const reviewRoutes       = require('./routes/reviews');
const ingredientsRoutes  = require('./routes/ingredients');
const blogRoutes         = require('./routes/blog');

app.use('/api/auth',        authRoutes);
app.use('/api/skin',        skinAnalysisRoutes);
app.use('/api/products',    productsRoutes);
app.use('/api/compare',     compareRoutes);
app.use('/api/makeup',      makeupRoutes);
app.use('/api/users',       userRoutes);
app.use('/api/reviews',     reviewRoutes);
app.use('/api/ingredients', ingredientsRoutes);
app.use('/api/blog',        blogRoutes);

// ── Health Check ──────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    app: 'Skintellix API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ── 404 & Error Handler ───────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skintellix';

// Connect to MongoDB asynchronously; server starts regardless
mongoose.connect(MONGODB_URI).then(() => {
  console.log('✓ Connected to MongoDB');
}).catch(err => {
  console.warn('⚠ MongoDB connection failed. Server starting without DB. Details:', err.message);
});

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════╗
  ║       SKINTELLIX API SERVER          ║
  ║  Running on http://localhost:${PORT}   ║
  ║  Environment: ${process.env.NODE_ENV || 'development'}          ║
  ╚══════════════════════════════════════╝
  `);
});

module.exports = app;
