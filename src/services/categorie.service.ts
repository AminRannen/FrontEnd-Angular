import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  constructor(private http: HttpClient) { }
  getCategories(): Observable<any> {
    return this.http.get<any>('http://localhost:8000/api/categories');
  }
  getScategories(): Observable<any> {  // ✅ Added method to fetch scategories
    return this.http.get<any>(`http://localhost:8000/api/scategories`);
  }
  getScategorieById(id: number): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/api/scategories/${id}`);
  }
  
  getSubcategoriesByCategory(categoryId: number): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/api/scat/${categoryId}`);
  }
  getCategorieByScategorieID(idscat: number): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/api/get-categorie/${idscat}`);
  }
  updateCategory(id: number, data: any) {
    return this.http.patch(`http://localhost:8000/categories/${id}`, data);
  }
  
  deleteCategory(id: number) {
    return this.http.delete(`http://localhost:8000/categories/${id}`);
  }
  
}
