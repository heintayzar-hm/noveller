import {
    Injectable,
    NestMiddleware,
    BadRequestException,
  } from '@nestjs/common';
  import { Response, NextFunction } from 'express';
  import { validateOrReject } from 'class-validator';
import { LoginDto } from '@server/auth/dto/login.dto';

  @Injectable()
  export class AuthMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
      const body = req.body as any;
      const login = new LoginDto() as any;
      const errors = [] as any;

      Object.keys(body).forEach((key) => {
        login[key] = body[key];
      });

      try {
        await validateOrReject(login);
      } catch (errs) {
        errs.forEach((err : any) =>{
          Object.values(err.constraints).forEach((constraint) =>
            errors.push(constraint),
          );
        });
      }

      if (errors.length) {
        throw new BadRequestException(errors);
      }

      next();
    }
  }
