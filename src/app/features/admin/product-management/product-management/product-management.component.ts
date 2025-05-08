import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Product } from '../../../../core/models/product.model';
import { ProductFormDialogComponent } from '../prduct-form-dialog/prduct-form-dialog.component';
import { ProductService } from '../../../../core/services/product.service';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatSnackBarModule,
    ProductFormDialogComponent
  ],
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.css'
})
export class ProductManagementComponent implements OnInit {
  products: Product[] = [];
  
  private productService = inject(ProductService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  
  ngOnInit(): void {
    this.loadProducts();
  }
  
  loadProducts(): void {
    this.products = this.productService.getAll();
  }
  
  openProductDialog(product?: Product): void {
    const dialogRef = this.dialog.open(ProductFormDialogComponent, {
      width: '500px',
      data: { product: product ? { ...product } : null }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          // Update existing product
          this.productService.updateProduct(result);
          this.snackBar.open('Product updated successfully', 'Close', { duration: 3000 });
        } else {
          // Add new product
          this.productService.addProduct(result);
          this.snackBar.open('Product added successfully', 'Close', { duration: 3000 });
        }
        this.loadProducts();
      }
    });
  }
  
  confirmDelete(product: Product): void {
    if (confirm(`Are you sure you want to delete ${product.name}?`)) {
      this.productService.deleteProduct(product.id);
      this.loadProducts();
      this.snackBar.open('Product deleted successfully', 'Close', { duration: 3000 });
    }
  }
}
