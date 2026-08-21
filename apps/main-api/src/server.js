import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import landingPageRoutes from './routes/landingPageRoutes.js';
import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:7100,http://localhost:7101')
  .split(',')
  .map(s => s.trim());
app.use(cors({
  origin: corsOrigins,
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static('public/uploads'));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'Pahar Theke Backend API'
  });
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/landing-page', landingPageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🛍️  Products API: http://localhost:${PORT}/api/products`);
      console.log(`📦 Orders API: http://localhost:${PORT}/api/orders`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;