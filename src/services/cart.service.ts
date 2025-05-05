import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Article } from 'src/app/models/article.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'http://localhost:8000/api'; // <-- change selon ton URL backend
  private cartItems: Article[] = [];
  private cartCount = new BehaviorSubject<number>(0);

  cartCount$ = this.cartCount.asObservable();

  constructor(private http: HttpClient) {}

  /** LOCAL CART LOGIC */
  addToCart(article: Article): void {
    const existingItem = this.cartItems.find(item => item.id === article.id);
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1; // Increment quantity
    } else {
      article.quantity = 1;
      this.cartItems.push(article);
    }
    this.cartCount.next(this.cartItems.length);
  }
  

  getItems(): Article[] {
    return this.cartItems;
  }

  clearCart(): void {
    this.cartItems = [];
    this.cartCount.next(0);
  }

  removeItem(index: number): void {
    this.cartItems.splice(index, 1);
    this.cartCount.next(this.cartItems.length);
  }

  /** API CALLS for LigneCommande */

  getAllLigneCommandes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/ligne-commandes`);
  }

  getLigneCommandeById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/ligne-commandes/${id}`);
  }

  createLigneCommande(ligneCommandeData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/ligne-commandes`, ligneCommandeData);
  }
  

  updateLigneCommande(id: number, data: {
    commande_id: number;
    article_id: number;
    quantity: number;
    price: number;
  }): Observable<any> {
    return this.http.put(`${this.baseUrl}/ligne-commandes/${id}`, data);
  }

  deleteLigneCommande(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/ligne-commandes/${id}`);
  }

  /** LigneCommandes by Commande */
  getLignesByCommandeId(commandeId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/commandes/${commandeId}/ligne-commandes`);
  }
}
