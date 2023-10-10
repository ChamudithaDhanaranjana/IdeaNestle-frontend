import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  backendApiUrl

  constructor(private http: HttpClient) {
    this.backendApiUrl = environment.apiUrl+ "/categories"
  }

  getCategoryCounts(): Observable<CategoryCount[]> {
    return this.http.get<CategoryCount[]>(`${this.backendApiUrl}/counts`);
  }
  getCategoryPostCounts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.backendApiUrl}/post-counts`);
  }
}

export interface CategoryCount {
  category: string;
  count: number;
}
