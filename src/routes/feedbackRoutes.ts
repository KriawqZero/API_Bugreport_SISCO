import { Router } from 'express';
import { feedbackRateLimiter } from '../config/ratelimiter';
import { upload } from '../config/multer';
import FeedbackController from '../controllers/FeedbackController';
import validarFeedback from '../middleware/validadores/validarFeedback';

const router = Router();

router.post(
  '/feedback',
  feedbackRateLimiter,
  upload.array('anexos', 10),
  validarFeedback,
  FeedbackController.createFeedback
);


// Buscar feedbacks paginados
router.get('/feedbacks', FeedbackController.getFeedbacks);

// Buscar feedback por id
router.get('/feedback/:id', FeedbackController.getFeedbackById);

// Baixar arquivo
router.get('/feedback/:id/arquivo', FeedbackController.downloadFile);

// Health check
router.get('/health', FeedbackController.healthCheck);


export default router;
