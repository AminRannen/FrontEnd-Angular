import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'll-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  // Déclare un tableau pour simuler le panier
  cartItems: any[] = [
    {
      name: 'Produit 1',
      price: 25.99,
      image: 'https://via.placeholder.com/150'
    },
    {
      name: 'Produit 2',
      price: 15.50,
      image: 'https://via.placeholder.com/150'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  // Méthode pour supprimer un item du panier
  removeFromCart(item: any) {
    this.cartItems = this.cartItems.filter(i => i !== item);
  }

  // Méthode pour calculer le total
  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price, 0);
  }
}
