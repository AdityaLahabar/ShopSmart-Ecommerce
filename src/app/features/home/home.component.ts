import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { ProductCartComponent } from '../../shared/product-cart/product-cart.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    ProductCartComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private productService = inject(ProductService);
  featuredProducts: Product[] = [];
  categories: string[] = [];

  constructor() {
    // Get a subset of products for the featured section
    this.featuredProducts = this.productService.getAll().slice(0, 3);
    this.categories = this.productService.getCategories();
  }
}
