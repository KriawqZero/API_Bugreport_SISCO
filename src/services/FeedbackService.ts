import prisma from '../config/database';
import path from 'path';

class FeedbackService {
  static async createFeedback(data: any, files?: Express.Multer.File[]) {
    const attachments = files?.map(file => 
      `/uploads/${path.relative(path.join(__dirname, '../../uploads'), file.path)}`
    ) || [];

    return prisma.feedback.create({
      data: {
        tipo: data.tipo,
        emailUsuario: data.emailUsuario,
        descricao: data.descricao,
        passosReproducao: data.passosReproducao,
        navegador: data.navegador,
        sistemaOperacional: data.sistemaOperacional,
        prioridade: data.tipo === 'bug' ? 'alta' : null,
        anexos: {
          create: attachments.map(url => ({ url }))
        }
      },
      include: { anexos: true }
    });
  }
}

export default FeedbackService;
