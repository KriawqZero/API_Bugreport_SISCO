import express from 'express';
import { configureApp } from './config/app';
import feedbackRoutes from './routes/feedbackRoutes';
import { errorHandler } from './middleware/errorHandler';
import path from 'path';

const app = express();

const port = process.env.PORT || 3000;

// Configurações básicas
configureApp(app);

// Rotas
app.use(feedbackRoutes);

// Servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware de erros
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
