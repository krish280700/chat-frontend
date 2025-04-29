// src/app/core/guards/auth.guard.ts
import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from "./services/auth.service"

@Injectable({
  providedIn: 'root',
})

export class AuthGuard implements CanActivate {
  private router = inject(Router);
  private authService = inject(AuthService);

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/login']); // Redirect if not logged in
      return false;
    }
  }
}
