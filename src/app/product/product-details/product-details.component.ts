import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Article } from '../../models/article.model';
import { ArticleService } from 'src/services/article.service';
import { CartService } from 'src/services/cart.service';
@Component({
  selector: 'll-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  article: Article | null = null;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private cartService: CartService // inject it
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadArticle(+id);
    }
  }

  loadArticle(id: number): void {
    this.articleService.getArticleById(id).subscribe({
      next: (article) => {
        this.article = article;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading article:', error);
        this.loading = false;
      }
    });
  }
  addToCart(): void {
    if (this.article) {
      this.cartService.addToCart(this.article);
      console.log('Product added to cart:', this.article);
      // Optionally show a success message
    }
  }
}