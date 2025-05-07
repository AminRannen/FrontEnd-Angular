import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScategorieService {
  private scategoriesUrl = 'http://localhost:8000/api/scategories';

  constructor(private http: HttpClient) {}

  // ✅ Get all scategories
  getScategories(): Observable<any[]> {
    return this.http.get<any[]>(this.scategoriesUrl);
  }

  // ✅ Get scategorie by ID
  getScategorieById(id: number): Observable<any> {
    return this.http.get<any>(`${this.scategoriesUrl}/${id}`);
  }

  // ✅ Get scategories by category ID
  getScategoriesByCategory(categoryId: number): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/api/scat/${categoryId}`);
  }

  // ✅ Get parent category of a scategorie
  getCategorieByScategorieID(scategorieId: number): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/api/get-categorie/${scategorieId}`);
  }

  // ✅ Create a new scategorie
  createScategorie(scategorie: any): Observable<any> {
    return this.http.post<any>(this.scategoriesUrl, scategorie);
  }

  // ✅ Update an existing scategorie
  updateScategorie(id: number, scategorie: any): Observable<any> {
    return this.http.put<any>(`${this.scategoriesUrl}/${id}`, scategorie);
  }

  // ✅ Delete a scategorie
  deleteScategorie(id: number): Observable<any> {
    return this.http.delete<any>(`${this.scategoriesUrl}/${id}`);
  }
}
