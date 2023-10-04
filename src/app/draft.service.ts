import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DraftService {
  

  private backendApiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  draftPost(postData: { title: string; content: string }): Observable<any> {
    const url = `${this.backendApiUrl}/draft`;
    const headers = new HttpHeaders({
      'Authorization': 'Bearer YOUR_AUTH_TOKEN_HERE' 
    });
    return this.http.post(url, postData, { headers });
  }

  getDraftsByUsername(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.backendApiUrl}/drafts/${username}`);
  }

  getDraftById(draftId: number): Observable<any> {
    return this.http.get<any[]>(`${this.backendApiUrl}/draft/${draftId}`);
  }

  updateDraftById(id: string, draftData: any) {
    return this.http.put(`${this.backendApiUrl}/drafts/${id}`, draftData);
  }
  
  deleteDraftById(draftId: string) {
    return this.http.delete(`${this.backendApiUrl}/drafts/${draftId}`);
  }
}
