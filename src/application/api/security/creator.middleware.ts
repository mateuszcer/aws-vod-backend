import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class CreatorMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;

    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);

        const roles: string[] = decodedToken.roles;

        if (roles && roles.includes('CREATOR')) {
          next();
        } else {
          res.status(403).json({ message: 'Forbidden' });
        }
      } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
      }
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  }
}
