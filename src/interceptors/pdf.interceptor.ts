import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { multerOptions } from '../config/multer.config';

@Injectable()
export class PdfInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const file = req.file;

   /*  const multer = require('multer');
    const upload = multer(multerOptions).single('pdf');
    const request = context.switchToHttp().getRequest();
    return new Observable((observer) => {
      upload(request, undefined, (err) => {
        if (err) {
          observer.error(err);
        } else {
          observer.next(request);
          observer.complete();
        }
      });
    }); */
    return next.handle();
  }
}