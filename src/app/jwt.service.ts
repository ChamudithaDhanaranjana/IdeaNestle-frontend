import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  saveToken(token: string): void {
    localStorage.setItem('jwtToken', token);
  }

  destroyToken(): void {
    localStorage.removeItem('jwtToken');
  }
}
