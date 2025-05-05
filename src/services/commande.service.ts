import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private apiUrl = 'http://localhost:8000/api'; // Changed to base API URL

  constructor(private http: HttpClient) {}

  getAllCommandes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/commandes`);
  }

  getCommande(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/commandes/${id}`);
  }

  createCommande(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/commandes`, data);
  }

  updateCommande(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/commandes/${id}`, data);
  }

  deleteCommande(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/commandes/${id}`);
  }

  createLigneCommande(ligneCommandeData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/ligne_commandes`, ligneCommandeData);
  }

  getLigneCommandesByCommandeId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/commandes/${id}/ligne_commandes`);
  }
  
  updateOrderStatus(id: number, status: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  
    return this.http.put(
      `${this.apiUrl}/commandes/${id}/status`,
      { status: status.charAt(0).toUpperCase() + status.slice(1) }, // Ensures case sensitivity
      { headers }
    ).pipe(
      catchError(error => {
        console.error('API Error:', error);
        throw error;
      })
    );
  }
  
}