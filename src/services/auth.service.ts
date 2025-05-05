// src/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `http://localhost:8000/api`; // Change this based on your API base URL

  constructor(private http: HttpClient) { }

  // Login method
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  // Register method
  register(email: string, name: string, password: string, role: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, name, password, role });
  }
  logout(): void {
    sessionStorage.removeItem('token');
  }
  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}`);
  }
  
}
