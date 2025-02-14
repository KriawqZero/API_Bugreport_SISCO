import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import validarFeedback from './validadores/validarFeedback';

const aplicativo = express();
const prisma = new PrismaClient();

// Configuração do rate limiting (12 requisições por minuto)
const limitador = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 5, // Limite de 15 requisições por IP
  message: 'Muitas requisições, tente novamente em alguns instantes',
  headers: true, // Envia cabeçalhos com informações do limite
});

// Configurações de segurança
aplicativo.use(helmet());
aplicativo.use(cors({
  origin: process.env.URL_FRONTEND,
  credentials: true
}));
aplicativo.use(bodyParser.json());
aplicativo.use(bodyParser.urlencoded({ extended: true }));

// Configuração do multer para uploads
const armazenamento = multer.diskStorage({
  destination: (req, file, cb) => {
    const pastaUploads = path.join(__dirname, 'uploads', new Date().toISOString().split('T')[0]);
    require('fs').mkdirSync(pastaUploads, { recursive: true });
    cb(null, pastaUploads);
  },
  filename: (req, file, cb) => {
    const nomeUnico = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, nomeUnico);
  }
});

const upload = multer({
  storage: armazenamento,
  limits: {
    files: 10,
    fileSize: 5 * 1024 * 1024 // 5MB por arquivo
  },
  fileFilter: (req, file, cb) => {
    const tiposPermitidos = /jpeg|jpg|png|gif|webp|pdf|txt/;
    const extensaoValida = tiposPermitidos.test(path.extname(file.originalname).toLowerCase());
    const mimeValido = tiposPermitidos.test(file.mimetype);
    
    if (extensaoValida && mimeValido) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido'));
    }
  }
});

// Restante das configurações...

aplicativo.post('/feedback', 
  limitador,
  upload.array('anexos', 10),
  validarFeedback,
  async (req: Request, res: Response) => {
    try {
      const { body, files } = req;
      const caminhosAnexos = (files as Express.Multer.File[])?.map(file => 
        `/uploads/${path.relative(path.join(__dirname, 'uploads'), file.path)}`
      ) || [];

      const novoFeedback = await prisma.feedback.create({
        data: {
          tipo: body.tipo,
          emailUsuario: body.emailUsuario,
          descricao: body.descricao,
          passosReproducao: body.passosReproducao,
          navegador: body.navegador,
          sistemaOperacional: body.sistemaOperacional,
          prioridade: body.tipo === 'bug' ? 'alta' : null,
          anexos: {
            create: caminhosAnexos.map(url => ({ url }))
          }
        },
        include: { anexos: true }
      });

      res.status(201).json(novoFeedback);
    } catch (erro) {
      console.error('Erro ao criar feedback:', erro);
      res.status(500).json({ erro: 'Falha ao processar feedback' });
    }
  }
);

// Servir arquivos estáticos
aplicativo.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Middleware de erros
aplicativo.use((erro: any, req: Request, res: Response) => {
  console.error(erro.stack);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

const porta = process.env.PORTA || 3000;
aplicativo.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`);
});

