import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/auth/auth.service';
import { ProductService } from '../../../core/services/product.service';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  private productService = inject(ProductService);
  private orderService = inject(OrderService);
  
  totalProducts = 0;
  totalOrders = 0;
  totalCategories = 0;
  
  constructor() {
    this.totalProducts = this.productService.getAll().length;
    this.totalOrders = this.orderService.getAllOrders().length;
    this.totalCategories = this.productService.getCategories().length;
  }
}
