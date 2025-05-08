import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
//import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { ProductCartComponent } from '../../../shared/product-cart/product-cart.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatChipsModule,
    ProductCartComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  filterForm!: FormGroup;
  categories: string[] = [];
  filteredProducts: Product[] = [];
  
  ngOnInit(): void {
    this.categories = this.productService.getCategories();
    
    this.filterForm = this.fb.group({
      category: [''],
      minPrice: [null],
      maxPrice: [null]
    });
    
    // Initialize filters from query params
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.filterForm.patchValue({ category: params['category'] });
      }
      if (params['minPrice']) {
        this.filterForm.patchValue({ minPrice: Number(params['minPrice']) });
      }
      if (params['maxPrice']) {
        this.filterForm.patchValue({ maxPrice: Number(params['maxPrice']) });
      }
      
      this.applyFilters();
    });
  }
  
  applyFilters(): void {
    const { category, minPrice, maxPrice } = this.filterForm.value;
    
    // Update URL with filters
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        category: category || null,
        minPrice: minPrice || null,
        maxPrice: maxPrice || null
      },
      queryParamsHandling: 'merge'
    });
    
    this.filteredProducts = this.productService.filterProducts(
      category,
      minPrice,
      maxPrice
    );
  }
  
  resetFilters(): void {
    this.filterForm.reset({
      category: '',
      minPrice: null,
      maxPrice: null
    });
    
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {}
    });
    
    this.filteredProducts = this.productService.getAll();
  }
  
  removeFilter(filterName: string): void {
    this.filterForm.get(filterName)?.reset();
    this.applyFilters();
  }
  
  hasActiveFilters(): boolean {
    const { category, minPrice, maxPrice } = this.filterForm.value;
    return !!category || minPrice !== null || maxPrice !== null;
  }
}