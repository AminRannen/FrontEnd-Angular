import { Component } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  cartItems = [
    { name: 'Produit 1', price: 49.99, image: 'assets/images/starter-01.png' },
    { name: 'Produit 2', price: 29.99, image: 'assets/images/starter-02.png' },
  ];
  passerCommande() {
    if (this.cartItems.length === 0) {
      alert('Votre panier est vide.');
      return;
    }
  
    const commande = {
      items: this.cartItems,
      total: this.getTotal(),
      date: new Date()
    };
  
    console.log('Commande passée :', commande);
    alert('Commande passée avec succès ✅');
  
    // Vide le panier après commande
    this.cartItems = [];
  }
  removeFromCart(item: any) {
    this.cartItems = this.cartItems.filter(i => i !== item);
  }

  getTotal() {
    return this.cartItems.reduce((acc, item) => acc + item.price, 0).toFixed(2);
  }
}
