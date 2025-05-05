import { Component, OnInit } from '@angular/core';
import { Article } from '../../models/article.model';
import { ArticleService } from 'src/services/article.service';
import { CategorieService } from 'src/services/categorie.service';
@Component({
  selector: 'll-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  isLoaded: boolean = false;
  advanceSearchExpanded: boolean = false;

  articles: Article[] = [];
  filteredArticles: Article[] = [];

  categories: any[] = [];
  subcategories: any[] = [];

  selectedCategory: number | null = null;
  selectedSubcategory: number | null = null;

  maxPrice: number = 1000;
  minPrice: number = 0;
  stockAvailability: string = 'all'; // 'all', 'inStock', 'outOfStock'

  searchQuery: string = '';

  constructor(
    private articleService: ArticleService,
    private categoryService: CategorieService
  ) {}

  ngOnInit(): void {
    this.loadArticles();
    this.getCategories();
  }

  getCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories:', error);
      }
    });
  }

  onCategoryChange(categoryId: number): void {
    this.selectedCategory = categoryId;
    this.selectedSubcategory = null;

    if (categoryId) {
      this.categoryService.getSubcategoriesByCategory(categoryId).subscribe({
        next: (data) => {
          this.subcategories = data;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des sous-catégories:', error);
        }
      });
    } else {
      this.subcategories = [];
    }
  }

  applyFilters(): void {
    this.filteredArticles = this.articles.filter(article => {
      const matchesPrice =
        Number(article.prix) >= Number(this.minPrice) &&
        Number(article.prix) <= Number(this.maxPrice);

      const matchesSubcategory = this.selectedSubcategory
        ? article.scategorieID === this.selectedSubcategory // Vérification de l'id de la sous-catégorie
        : true;

      const matchesCategory = this.selectedCategory
        ? this.subcategories.some(subcategory => subcategory.id === article.scategorieID && subcategory.categorieID === this.selectedCategory)
        : true;

      const matchesStock =
        this.stockAvailability === 'all' ||
        (this.stockAvailability === 'inStock' && article.qtestock > 0) ||
        (this.stockAvailability === 'outOfStock' && article.qtestock === 0);

      const matchesSearch =
        this.searchQuery === '' ||
        article.designation.toLowerCase().includes(this.searchQuery.toLowerCase());

      return matchesPrice && matchesCategory && matchesSubcategory && matchesStock && matchesSearch;
    });
  }

  search(): void {
    this.applyFilters();
  }

  loadArticles(): void {
    this.articleService.getAllArticles().subscribe({
      next: (data) => {
        this.articles = data;
        this.filteredArticles = [...this.articles];
        this.isLoaded = true;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des articles:', error);
        this.isLoaded = true;
      }
    });
  }

  loadSubcategories(): void {
    if (this.selectedCategory) {
      this.categoryService.getSubcategoriesByCategory(this.selectedCategory).subscribe({
        next: (data) => {
          this.subcategories = data;
        },
        error: (err) => console.error('Erreur chargement sous-catégories :', err)
      });
    } else {
      this.subcategories = [];
    }
  }
}
