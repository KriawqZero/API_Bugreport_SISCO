import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export default [
  (req: Request, res: Response, proximo: NextFunction) => {
    // Sanitização de XSS
    console.log(req.body);
    const sanitizar = (valor: any) => {
      if (typeof valor === 'string') {
        return valor.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      }
      return valor;
    };

    if (req.body) {
      Object.keys(req.body).forEach(chave => {
        req.body[chave] = sanitizar(req.body[chave]);
      });
    }
    
    proximo();
  },
  
  ...['tipo', 'emailUsuario', 'descricao'].map(campo => 
    (req: Request, res: Response, proximo: NextFunction) => {
      if (!req.body[campo]) {
        return res.status(400).json({ erro: `${campo} é obrigatório` });
      }
      proximo();
    }
  ),

  (req: Request, res: Response, proximo: NextFunction) => {
    const erros = validationResult(req);
    if (!erros.isEmpty() || (req.files as Express.Multer.File[]).length > 10) {
      return res.status(400).json({ erros: erros.array() });
    }
    proximo();
  },
];
