import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  return from(inject(AuthService).getAuthToken()).pipe(
    switchMap((token) => {
      const newReq = req.clone({
        headers: req.headers.append('Authorization', 'Bearer ' + token),
      });
      return next(newReq);
    })
  );
}
