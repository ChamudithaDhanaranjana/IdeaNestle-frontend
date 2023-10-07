import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  private userName: string = '';
  private userEmail: string = '';

  setUserInfo(name: string, email: string) {
    this.userName = name;
    this.userEmail = email;
  }

  getUserName(): string {
    return this.userName;
  }

  getUserEmail(): string {
    return this.userEmail;
  }

  private baseUrl = '/api/usershttp://localhost:8080/api/auth/'; // Replace with your actual backend API URL

  constructor(private http: HttpClient) {}

  // User login
  login(username: string, password: string): Observable<any> {
    const credentials = {
      username: username,
      password: password
    };
    return this.http.post(`${this.baseUrl}/signin`, credentials);
  }

  // User registration
  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, user);
  }
}
