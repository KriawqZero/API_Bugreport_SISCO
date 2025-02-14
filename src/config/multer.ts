import multer from 'multer';
import path from 'path';
import { Request } from 'express';

const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    const uploadsDir = path.join(__dirname, '../../uploads', new Date().toISOString().split('T')[0]);
    require('fs').mkdirSync(uploadsDir, { recursive: true });
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|txt/;
  const extValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeValid = allowedTypes.test(file.mimetype);

  extValid && mimeValid ? cb(null, true) : cb(new Error('Tipo de arquivo não permitido'));
};

export const upload = multer({
  storage,
  limits: { files: 10, fileSize: 5 * 1024 * 1024 },
  fileFilter
});
