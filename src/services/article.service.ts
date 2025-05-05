import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from 'src/app/models/article.model';
// Optionnel : tu peux créer une interface pour Article


@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private baseUrl = 'http://localhost:8000/api/articles'; // adapte l'URL selon ton backend

  constructor(private http: HttpClient) { }

  // Get all articles
  getAllArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.baseUrl);
  }

  // Get one article by ID
  getArticleById(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.baseUrl}/${id}`);
  }

  // Create new article
  createArticle(article: Article): Observable<Article> {
    return this.http.post<Article>(this.baseUrl, article);
  }

  // Update article
  updateArticle(id: number, article: Article): Observable<Article> {
    return this.http.put<Article>(`${this.baseUrl}/${id}`, article);
  }

  // Delete article
  deleteArticle(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // Get articles by sub-category ID
  getArticlesBySubCategory(idscat: number): Observable<Article[]> {
    return this.http.get<Article[]>(`http://localhost:8000/api/listarticles/${idscat}`);
  }

  // Get articles with pagination
  getArticlesPaginate(pageSize: number = 10, page: number = 1): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/api/articles/art/articlespaginate?page=${page}&pageSize=${pageSize}`);
  }
  getArticlesWithCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/articleswithcat`);
  }
  getArticleCountsByCategory(): Observable<{[key: string]: number}> {
    return this.http.get<{[key: string]: number}>(
      `${this.baseUrl}/article-counts-by-category`
    );
  }
}
