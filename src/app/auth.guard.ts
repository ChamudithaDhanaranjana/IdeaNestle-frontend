import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {

      const requiredRoles = route.data.roles as string[];
      console.log('Required roles:', requiredRoles);
      const userId = +this.authService.getUserId();
      console.log('User ID:', userId);
      this.authService.getUserRolesById(userId).subscribe((userRoles) => {
        console.log('User roles:', userRoles);

        if (requiredRoles.includes('ROLE_ADMIN')) {
          if (userRoles.includes('ROLE_ADMIN')) {
            console.log('User has ROLE_ADMIN role. Access granted.');
            return true; 
          } else {
            console.log('User does not have ROLE_ADMIN role. Access denied.');
            this.router.navigate(['/access-denied']);
            return false;
          }
        } else if (requiredRoles.includes('ROLE_USER')) {
          if (userRoles.includes('ROLE_USER')) {
            const permittedRoutes = ['', 'post/:id', 'signup', 'login', 'profile', 'create', 'create/:id', 'contribution/:id'];
            
            if (permittedRoutes.includes(route.routeConfig?.path || '')) {
              console.log('User has ROLE_USER role and is accessing a permitted route. Access granted.');
              return true;
            }
          }
        }

        console.log('Access denied.');
        this.router.navigate(['/access-denied']);
        return false;
      });
    } else {
      console.log('User is not authenticated.');

      if (state.url === '/login' || state.url === '/signup') {
        console.log('Access granted for login and signup pages.');
        return true;
      } else {
        console.log('Redirecting to login page.');
        this.router.navigate(['/login']);
        return false;
      }
    }
  }
}
