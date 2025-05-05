import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddArticleDialogComponent } from 'src/app/components/add-article-dialog/add-article-dialog.component';
import { EditArticleDialogComponent } from 'src/app/components/edit-article-dialog/edit-article-dialog.component';
import { Article } from 'src/app/models/article.model';
import { ArticleService } from 'src/services/article.service';

@Component({
  selector: 'll-dashboard-saved-item',
  templateUrl: './dashboard-saved-item.component.html',
  styleUrls: ['./dashboard-saved-item.component.scss']
})
export class DashboardSavedItemComponent implements OnInit {
  view = 'list';
  products: Article[] = [];

  constructor(
    private dialog: MatDialog,
    private articleService: ArticleService
  ) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  // Charger les articles depuis le service
  loadArticles(): void {
    this.articleService.getAllArticles().subscribe(
      (articles) => {
        this.products = articles;
      },
      (error) => {
        console.error('Erreur lors du chargement des articles', error);
      }
    );
  }

  // Ajouter un produit (ouvre le dialog)
  addProduct(): void {
    const dialogRef = this.dialog.open(AddArticleDialogComponent, {
      width: '600px', // élargi pour bien afficher les listes
      disableClose: true // optionnel : empêche de fermer sans action
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.products.unshift(result); // insère le nouvel article en haut
      }
    });
  }

  // Modifier un produit (ouvre le dialog avec données préchargées)
  editProduct(product: Article): void {
    const dialogRef = this.dialog.open(EditArticleDialogComponent, {
      width: '600px',
      data: { ...product }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updatedProduct = { ...product, ...result };
        this.articleService.updateArticle(updatedProduct.id, updatedProduct).subscribe(() => {
          this.loadArticles();
        });
      }
    });
  }

  // Supprimer un produit
  deleteProduct(productId: number): void {
    this.articleService.deleteArticle(productId).subscribe(
      () => {
        this.products = this.products.filter(p => p.id !== productId);
        console.log('Produit supprimé avec succès');
      },
      (error) => {
        console.error('Erreur lors de la suppression', error);
      }
    );
  }
}
