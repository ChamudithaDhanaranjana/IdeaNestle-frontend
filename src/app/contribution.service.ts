import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContributionService {
  
  contributionContent: string = '';

  backendApiUrl

  constructor(private http: HttpClient, private authService: AuthService) { 
    this.backendApiUrl = environment.apiUrl+ "/contributions"
  }

  getContributionCountByUserId(userId: string): Observable<number> {
    const url = `${this.backendApiUrl}/user/${userId}/count`;
    return this.http.get<number>(url);
  }
  getApprovedContributionsByPostId(id: any) {
    return this.http.get<any>(`${this.backendApiUrl}/${id}`);
  }
  getContributionsByUserId(userId: any) {
    return this.http.get<any>(`${this.backendApiUrl}/user/${userId}`);
  }
  getContributionById(id: any) {
    return this.http.get<any>(`${this.backendApiUrl}/my/contributions/${id}`);
  }
  deleteContribution(contributionId: string): Observable<any> {
    return this.http.delete(`${this.backendApiUrl}/${contributionId}`);
  }

  approveContribution(contributionId: string): Observable<any> {
    return this.http.post(`${this.backendApiUrl}/approve/${contributionId}`, {});
  }
  
}
