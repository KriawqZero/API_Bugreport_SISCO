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

  // Atualizar feedback
  static async updateFeedback(feedbackId: number, data: any) {
    const feedback = await prisma.feedback.findUnique({
      where: { id: feedbackId }
    });

    if (!feedback) {
      return null;
    }

    return prisma.feedback.update({
      where: { id: feedbackId },
      data
    });
  }

  // Buscar feedbacks paginados
  static async getFeedbacks(page: number = 1, limit: number = 10, orderByProp: any = 'desc') {
    const skip = (page - 1) * limit;

    const [feedbacks, total] = await Promise.all([
      prisma.feedback.findMany({
        skip,
        take: limit,
        include: { anexos: true },
        orderBy: { dataCriacao: orderByProp }
      }),
      prisma.feedback.count()
    ]);

    return {
      data: feedbacks,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        limit
      }
    };
  }

  // Buscar feedback por ID
  static async getFeedbackById(feedbackId: number) {
    const feedback = await prisma.feedback.findUnique({
      where: { id: feedbackId },
      include: { anexos: true }
    });

    return feedback;
  }

  // Buscar arquivo por ID
  static async getFileById(fileId: number) {
    return prisma.anexo.findUnique({
      where: { id: fileId }
    });
  }
}

export default FeedbackService;
