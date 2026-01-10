// ===========================================
// TimeBudget - Backend Entry Point
// ===========================================

import express from 'express';
import cors from 'cors';
import { config, validateConfig } from './infrastructure/config/index.js';
import { errorHandler } from './presentation/middlewares/error-handler.middleware.js';
import routes from './presentation/routes/index.js';
import { CategoryRepository } from './infrastructure/database/repositories/category.repository.js';
import prisma from './infrastructure/database/prisma/client.js';

// Validar configuración
validateConfig();

const app = express();

// Middlewares
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', routes);

// Error handler (debe ir al final)
app.use(errorHandler);

// Iniciar servidor
const startServer = async () => {
  try {
    // Seed categorías por defecto
    const categoryRepository = new CategoryRepository(prisma);
    await categoryRepository.seedDefaults();
    console.log('✓ Categorías inicializadas');

    app.listen(config.server.port, () => {
      console.log(`
╔═══════════════════════════════════════════╗
║           TimeBudget API Server           ║
╠═══════════════════════════════════════════╣
║  Puerto: ${config.server.port.toString().padEnd(31)} ║
║  Entorno: ${config.server.nodeEnv.padEnd(30)} ║
║  URL: http://localhost:${config.server.port.toString().padEnd(18)} ║
╚═══════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
