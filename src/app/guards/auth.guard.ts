import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> | boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }

    // Token doğrulama yap
    return this.authService.validateToken().pipe(
      map((isValid: boolean) => {
        if (isValid) {
          return true;
        } else {
          // Token geçersizse login sayfasına yönlendir
          this.router.navigate(['/login']);
          return false;
        }
      }),
      catchError(() => {
        // Hata durumunda login sayfasına yönlendir
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
