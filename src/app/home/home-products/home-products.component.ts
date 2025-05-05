// home-products.component.ts
import { Component, OnInit } from '@angular/core';
import { ArticleService } from 'src/services/article.service';
import { Article } from 'src/app/models/article.model';

@Component({
  selector: 'll-home-products',
  templateUrl: './home-products.component.html',
  styleUrls: ['./home-products.component.scss']
})
export class HomeProductsComponent implements OnInit {
  articles: Article[] = []; // Rename to match API data

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.articleService.getAllArticles().subscribe({
      next: (data) => {
        this.articles = data; // Assign to `articles`, not `products`
      },
      error: (error) => {
        console.error('Error loading articles:', error);
      }
    });
  }
}