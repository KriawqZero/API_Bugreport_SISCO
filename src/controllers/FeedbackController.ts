import { Request, Response } from 'express';
import FeedbackService from '../services/FeedbackService';
import path from 'path';

class FeedbackController {
  static async createFeedback(req: Request, res: Response) {
    try {
      const { body, files } = req;
      const feedback = await FeedbackService.createFeedback(body, files as Express.Multer.File[]);
      res.status(201).json(feedback);
    } catch (error) {
      res.status(500).json({ error: 'Falha ao processar feedback' });
    }
  }

  // Buscar feedbacks paginados
  static async getFeedbacks(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const orderBy = req.query.orderBy as string;

      const result = await FeedbackService.getFeedbacks(page, limit, orderBy);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar feedbacks' });
    }
  }

  static async getFeedbackById(req: Request, res: Response) {
    try {
      const feedback = await FeedbackService.getFeedbackById(Number(req.params.id));
      if (!feedback) {
        res.status(404).json({ error: 'Feedback não encontrado' });
        return;
      }
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar feedback' });
    }
  }

  // Baixar arquivo
  static async downloadFile(req: Request, res: Response): Promise<void> {
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    try {
      const file = await FeedbackService.getFileById(Number(req.params.id));

      if (!file) {
        res.status(404).json({ error: 'Arquivo não encontrado' });
        return;
      }

      const filePath = path.join(__dirname, '../../', file.url);
      res.sendFile(filePath);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao baixar arquivo' });
    }
  }

  // Health check
  static async healthCheck(req: Request, res: Response) {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  }
}

export default FeedbackController;
