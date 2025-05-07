import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Article } from 'src/app/models/article.model';
import { CartService } from 'src/services/cart.service';
import { CommandeService } from 'src/services/commande.service';
import { ArticleService } from 'src/services/article.service';

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
    private articleService: ArticleService,
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

    const userId = parseInt(sessionStorage.getItem('userId') || '0', 10);
    if (!userId) {
      alert('Utilisateur non connecté.');
      this.router.navigate(['/login']);
      return;
    }

    let validationErrors: string[] = [];
    let itemsChecked = 0;

    // Stock verification before placing the order
    this.cartItems.forEach((item) => {
      this.articleService.getArticleById(item.id).subscribe({
        next: (article) => {
          if (item.quantity > article.qtestock) {
            validationErrors.push(
              `Stock insuffisant pour ${article.designation}. Disponible: ${article.qtestock}, demandé: ${item.quantity}`
            );
          }
          itemsChecked++;

          if (itemsChecked === this.cartItems.length) {
            if (validationErrors.length > 0) {
              alert(validationErrors.join('\n'));
              return;
            }
            this.placeOrder(userId);
          }
        },
        error: (err) => {
          console.error('Error checking stock:', err);
          itemsChecked++;
          if (itemsChecked === this.cartItems.length && validationErrors.length === 0) {
            this.placeOrder(userId);
          }
        }
      });
    });
  }

  placeOrder(userId: number): void {
    const totalCommande = this.getTotal();
    const today = new Date();
    const dateFormatted = today.toISOString().split('T')[0];
  
    const commandeData = {
      user_id: userId,
      total: totalCommande,
      date_commande: dateFormatted,
      status: 'Pending',
    };
  
    this.commandeService.createCommande(commandeData).subscribe({
      next: () => {
        alert('Commande passée avec succès ✅');
        this.cartService.clearCart();
        this.cartItems = [];
      },
      error: (err) => {
        console.error('Error creating order:', err);
        alert('Erreur lors du passage de la commande');
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