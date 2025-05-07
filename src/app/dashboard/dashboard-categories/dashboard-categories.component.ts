import { Component, OnInit } from '@angular/core';
import { CategorieService } from 'src/services/categorie.service';
import { ScategorieService } from 'src/services/scategorie.service';
import { MatDialog } from '@angular/material/dialog';
import { EditScategoryModalComponent } from 'src/app/components/edit-scategory-modal/edit-scategory-modal.component';

@Component({
  selector: 'app-dashboard-categories',
  templateUrl: './dashboard-categories.component.html',
  styleUrls: ['./dashboard-categories.component.scss']
})
export class DashboardCategoriesComponent implements OnInit {
  categories: any[] = [];
  scategories: any[] = [];
  selectedCategoryId: number | null = null;
  
  constructor(
    private categorieService: CategorieService,
    private scategorieService: ScategorieService,
    private dialog: MatDialog
  ) {}
  
  ngOnInit(): void {
    this.fetchCategories();
    this.loadScategories();
  }
  
  fetchCategories(): void {
    this.categorieService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }
  
  loadScategories(): void {
    this.scategorieService.getScategories().subscribe((data) => {
      this.scategories = data;
    });
  }
  
  getFilteredScategories(): any[] {
    if (!this.selectedCategoryId) return [];
    return this.scategories.filter(scat => scat.categorieID === this.selectedCategoryId);
  }
  
  getCategoryName(id: number): string {
    const cat = this.categories.find(c => c.id === id);
    return cat ? cat.nomcategorie : 'Unknown';
  }
  
  selectCategory(id: number): void {
    this.selectedCategoryId = id;
  }
  
  openAddSubcategoryModal(): void {
    if (!this.selectedCategoryId) {
      alert('Please select a category first');
      return;
    }
    
    const dialogRef = this.dialog.open(EditScategoryModalComponent, {
      width: '400px',
      data: {
        categorieID: this.selectedCategoryId,
        imagescategorie: 'default.jpg'
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.scategorieService.createScategorie(result).subscribe(() => {
          this.loadScategories();
        });
      }
    });
  }
  
  openEditSubcategoryModal(scat: any): void {
    const dialogRef = this.dialog.open(EditScategoryModalComponent, {
      width: '400px',
      data: { ...scat }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.scategorieService.updateScategorie(scat.id, result).subscribe(() => {
          this.loadScategories();
        });
      }
    });
  }
  
  deleteSubcategory(id: number): void {
    if (confirm('Are you sure you want to delete this subcategory?')) {
      this.scategorieService.deleteScategorie(id).subscribe(() => {
        this.scategories = this.scategories.filter(s => s.id !== id);
      });
    }
  }
  
  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categorieService.deleteCategory(id).subscribe(() => {
        this.categories = this.categories.filter(cat => cat.id !== id);
        // If the deleted category was selected, reset selection
        if (this.selectedCategoryId === id) {
          this.selectedCategoryId = null;
        }
      });
    }
  }
}