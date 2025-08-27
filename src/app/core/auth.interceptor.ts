import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const sid = auth.sid;
  if (sid) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${sid}` } });
  }
  return next(req);
};
