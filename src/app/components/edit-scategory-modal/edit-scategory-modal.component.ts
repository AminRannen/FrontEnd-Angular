import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategorieService } from 'src/services/categorie.service';

@Component({
  selector: 'app-edit-scategory-modal',
  templateUrl: './edit-scategory-modal.component.html',
  styleUrls: ['./edit-scategory-modal.component.scss']
})
export class EditScategoryModalComponent implements OnInit {
  scategoryForm: FormGroup;
  isEditMode: boolean;
  categories: any[] = [];
  
  constructor(
    private fb: FormBuilder,
    private categorieService: CategorieService,
    public dialogRef: MatDialogRef<EditScategoryModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = !!data?.id;
    
    this.scategoryForm = this.fb.group({
      nomscategorie: [data?.nomscategorie || '', [Validators.required]],
      imagescategorie: [data?.imagescategorie || 'default.jpg'],
      categorieID: [data?.categorieID || null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Load categories for dropdown selection
    this.categorieService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  onSubmit(): void {
    if (this.scategoryForm.valid) {
      const formData = this.scategoryForm.value;
      
      // If editing, include the ID
      if (this.isEditMode) {
        formData.id = this.data.id;
      }
      
      this.dialogRef.close(formData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}