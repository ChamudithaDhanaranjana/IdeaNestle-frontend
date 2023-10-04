import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { JwtService } from './jwt.service';
import { User } from './user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  
  
  private apiUrl = 'http://localhost:8080/api/auth';

  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  userRole: any;
  private user: any;
  private currentUser: any; 
  userRoles: string[] = [];
  roles: any;
 

  constructor(private http: HttpClient, private jwtService: JwtService, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    const loginData = { username, password };
    return this.http.post(`${this.apiUrl}/signin`, loginData).pipe(
      tap((response: any) => {
        this.jwtService.saveToken(response.token);
        this.userSubject.next(response.user);
        this.decodeToken(response.token);
        this.currentUser = { username };
        
        
      })
    );
  }

  decodeToken(token: string): void {
    const payload = token.split('.')[1];
    const decodedPayload = window.atob(payload);
    const user = JSON.parse(decodedPayload);
    this.userRoles = user.roles || [];
    console.log('User Roles:', this.roles);
  }

  logout(): void {
    this.jwtService.destroyToken();
    this.setUser(null);
  }

  setUser(user: User): void {
    this.userSubject.next(user);
  }

  getUser(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  getUserRolesById(userId: number): Observable<string[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
  
    return this.http.get<string[]>(`${this.apiUrl}/${userId}/role`, { headers }).pipe(
      tap(roles => {
        console.log('User roles:', roles);
      })
    );
  }
  
  getUserProfile(): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/profile`, { headers });
  }

  private setUserRole(roles: string[]): void {
    this.userRole = roles;
  }

  isAuthenticated(): boolean {
    const token = this.jwtService.getToken();
    return !!token; 
  }

  getUserId(): string {
    return this.user?.id || ''; 
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  getUserCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`, { });
  }

  getActiveUserCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/active-count`);
  }
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }
  registerUser(userFormData: any) {
    return this.http.post(`${this.apiUrl}/signup`, userFormData);
  }
  getCurrentUser(): any {
    return this.currentUser;
  }
  contributorinfo(userId: number) {
    return this.http.get<string[]>(`${this.apiUrl}/${userId}/email-username`);
  }
  updateUserById(userId: number, updatedUser: any): Observable<any> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.put(url, updatedUser).pipe(
    );
  }
  deactivateUser(username: any) {
    this.http.post(`${this.apiUrl}/${username}`, {});
  }
  activateUser(username: string): Observable<any> {
    const url = `${this.apiUrl}/active/user/${username}`;
    return this.http.post(url, {});
  }
  deactivateUsers(username: string): Observable<any> {
    const url = `${this.apiUrl}/delete/user/${username}`;
    return this.http.post(url, {});
  }
}
