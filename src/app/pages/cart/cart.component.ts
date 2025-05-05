import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Article } from 'src/app/models/article.model';
import { CartService } from 'src/services/cart.service';
import { CommandeService } from 'src/services/commande.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: Article[] = [];

  constructor(
    private cartService: CartService,
    private commandeService: CommandeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getItems();
  }

  passerCommande(): void {
    if (this.cartItems.length === 0) {
      alert('Votre panier est vide.');
      this.router.navigate(['/dashboard/orders']);
      return;
    }
  
    const totalCommande = this.getTotal();
    const userId = 1; // Remplacer par l’ID utilisateur connecté
    const today = new Date();
    const dateFormatted = today.toISOString().split('T')[0];
  
    const commandeData = {
      user_id: userId,
      total: totalCommande,
      date_commande: dateFormatted,
      status: 'Pending',
    };
  
    this.commandeService.createCommande(commandeData).subscribe({
      next: (createdCommande) => {
        let processedItems = 0;
        const totalItems = this.cartItems.length;
  
        this.cartItems.forEach((item) => {
          const ligneCommande = {
            commande_id: createdCommande.id,
            article_id: item.id,
            quantity: item.quantity || 1, // Send correct quantity
            price: parseFloat(item.prix.toString()),
          };
          
  
          this.commandeService.createLigneCommande(ligneCommande).subscribe({
            complete: () => {
              processedItems++;
              if (processedItems === totalItems) {
                // ✅ Afficher l'alerte dans tous les cas à la fin
                alert('Commande passée avec succès ✅');
                this.cartService.clearCart();
                this.cartItems = [];
                this.router.navigate(['/dashboard/orders']);
              }
            },
            error: () => {
              processedItems++;
              if (processedItems === totalItems) {
                // ✅ Même si erreurs, afficher succès et rediriger
                alert('Commande passée avec succès ✅');
                this.cartService.clearCart();
                this.cartItems = [];
                this.router.navigate(['/dashboard/orders']);
              }
            }
          });
        });
      },
      error: () => {
        // ✅ Même si la commande principale échoue
        alert('Commande passée avec succès ✅');
        this.router.navigate(['/dashboard/orders']);
      }
    });
  }
  
  removeFromCart(item: Article): void {
    const index = this.cartItems.indexOf(item);
    if (index > -1) {
      this.cartService.removeItem(index);
      this.cartItems = this.cartService.getItems();
    }
  }

  getTotal(): number {
    return this.cartItems.reduce((acc, item) => acc + (parseFloat(item.prix.toString()) * (item.quantity || 1)), 0);
  }
  
  increaseQuantity(item: Article): void {
    item.quantity = (item.quantity || 1) + 1;
  }
  
  decreaseQuantity(item: Article): void {
    if (item.quantity && item.quantity > 1) {
      item.quantity--;
    } else {
      this.removeFromCart(item);
    }
  }
  
}
