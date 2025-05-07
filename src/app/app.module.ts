import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CartComponent } from './pages/cart/cart.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { EditArticleDialogComponent } from './components/edit-article-dialog/edit-article-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AddArticleDialogComponent } from 'src/app/components/add-article-dialog/add-article-dialog.component';
import { NgChartsModule } from 'ng2-charts';
import { OrderEditModalComponent } from './components/order-edit-modal/order-edit-modal.component';
import { EditCategoryModalComponent } from './components/edit-category-modal/edit-category-modal.component';
import { EditScategoryModalComponent } from './components/edit-scategory-modal/edit-scategory-modal.component';
@NgModule({
  declarations: [AppComponent, CartComponent, EditArticleDialogComponent,AddArticleDialogComponent, OrderEditModalComponent, EditCategoryModalComponent, EditScategoryModalComponent],
  imports: [BrowserModule, 
    AppRoutingModule, 
    
    BrowserAnimationsModule,
     SharedModule, 
     NgxSkeletonLoaderModule,
     FormsModule,
     ReactiveFormsModule, MatSelectModule,
     MatInputModule,
     MatButtonModule,
     MatCardModule,
     MatOptionModule,
     MatDialogModule,
     MatFormFieldModule,
    NgChartsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
