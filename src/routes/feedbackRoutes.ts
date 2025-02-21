import { Router } from 'express';
import { feedbackRateLimiter } from '../config/ratelimiter';
import { upload } from '../config/multer';
import FeedbackController from '../controllers/FeedbackController';
import validarFeedback from '../middleware/validadores/validarFeedback';

const router = Router();

// Criar feedback
router.post( '/feedback',
  feedbackRateLimiter,
  upload.array('anexos', 10),
  validarFeedback,
  FeedbackController.createFeedback
);

// Atualizar feedback
router.patch('/feedback/:id', FeedbackController.updateFeedback);

// Buscar feedbacks paginados
router.get('/feedbacks', FeedbackController.getFeedbacks);

// Buscar feedback por id
router.get('/feedback/:id', FeedbackController.getFeedbackById);

// Baixar arquivo
router.get('/feedback/:id/arquivo', FeedbackController.downloadFile);

// Health check
router.get('/health', FeedbackController.healthCheck);


export default router;
