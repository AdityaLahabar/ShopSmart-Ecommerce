import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '../../../../core/models/product.model';
import { ProductService } from '../../../../core/services/product.service';

interface DialogData {
  product: Product | null;
}

@Component({
  selector: 'app-prduct-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule
  ],
  templateUrl: './prduct-form-dialog.component.html',
  styleUrl: './prduct-form-dialog.component.css'
})
export class ProductFormDialogComponent implements OnInit {
  productForm!: FormGroup;
  isEditMode = false;
  categories: string[] = [];
  
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  
  constructor(
    public dialogRef: MatDialogRef<ProductFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
  
  ngOnInit(): void {
    this.categories = this.productService.getCategories();
    this.isEditMode = !!this.data.product;
    
    this.initForm();
  }
  
  initForm(): void {
    this.productForm = this.fb.group({
      id: [this.data.product?.id],
      name: [this.data.product?.name || '', Validators.required],
      description: [this.data.product?.description || '', Validators.required],
      price: [this.data.product?.price || '', [Validators.required, Validators.min(0.01)]],
      category: [this.data.product?.category || '', Validators.required],
      newCategory: [''],
      imageUrl: [this.data.product?.imageUrl || '', [Validators.required, Validators.pattern('https?://.+')]],
      inStock: [this.data.product?.inStock !== undefined ? this.data.product.inStock : true]
    });
    
    // Add validator for newCategory when category is 'other'
    this.productForm.get('category')?.valueChanges.subscribe(value => {
      const newCategoryControl = this.productForm.get('newCategory');
      if (value === 'other') {
        newCategoryControl?.setValidators(Validators.required);
      } else {
        newCategoryControl?.clearValidators();
      }
      newCategoryControl?.updateValueAndValidity();
    });
  }
  
  onSubmit(): void {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      
      // If 'other' category is selected, use the newCategory value
      if (formValue.category === 'other' && formValue.newCategory) {
        formValue.category = formValue.newCategory;
      }
      
      // Remove the newCategory field from the result
      delete formValue.newCategory;
      
      this.dialogRef.close(formValue);
    }
  }
}