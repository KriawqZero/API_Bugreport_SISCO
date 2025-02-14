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

export default router;
