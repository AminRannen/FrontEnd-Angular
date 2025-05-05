import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ArticleService } from 'src/services/article.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-article-dialog',
  templateUrl: './add-article-dialog.component.html',
  styleUrls: ['./add-article-dialog.component.scss']
})
export class AddArticleDialogComponent implements OnInit {
  productForm: FormGroup;
  categories: any[] = [];
  subcategories: any[] = [];
  filteredSubcategories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private http: HttpClient,
    private dialogRef: MatDialogRef<AddArticleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.productForm = this.fb.group({
      designation: ['', Validators.required],
      marque: [''],
      reference: ['', Validators.required],
      prix: ['', Validators.required],
      qtestock: ['', Validators.required],
      imageart: [''],
      categorieID: ['', Validators.required],
      scategorieID: new FormControl({ value: '', disabled: true }, Validators.required)
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadSubcategories();
  }

  loadCategories(): void {
    this.http.get<any[]>('http://localhost:8000/api/categories')
      .subscribe(data => {
        this.categories = data;
      });
  }

  loadSubcategories(): void {
    this.http.get<any[]>('http://localhost:8000/api/scategories')
      .subscribe(data => {
        this.subcategories = data;
      });
  }

  onCategoryChange(categoryId: number): void {
    this.filteredSubcategories = this.subcategories.filter(
      sub => sub.categorieID === categoryId
    );
    // Réactive le champ et réinitialise
    this.productForm.get('scategorieID')?.enable();
    this.productForm.patchValue({ scategorieID: '' });
  }
  submit(): void {
    if (this.productForm.valid) {
      const newArticle = this.productForm.getRawValue();
      console.log('Article à créer :', newArticle); // ⬅️ Inspecte ça dans la console
      this.articleService.createArticle(newArticle).subscribe((createdArticle) => {
        console.log('Article créé retourné :', createdArticle); // est-il vide ?
        this.dialogRef.close(createdArticle);
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
