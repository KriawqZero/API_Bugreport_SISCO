import { Request, Response } from 'express';
import FeedbackService from '../services/FeedbackService';

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
}

export default FeedbackController;
