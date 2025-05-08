import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Order } from '../../../core/models/order.model';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  
  ngOnInit(): void {
    this.loadOrders();
  }
  
  loadOrders(): void {
    if (this.authService.isAdmin()) {
      this.orders = this.orderService.getAllOrders();
    } else {
      this.orders = this.orderService.getUserOrders();
    }
    
    // Sort orders by date (most recent first)
    this.orders.sort((a, b) => b.date.getTime() - a.date.getTime());
  }
  
  getStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    switch (status) {
      case 'pending': return 'warn';
      case 'processing': return 'accent';
      case 'shipped': return 'primary';
      case 'delivered': return 'primary';
      default: return 'primary';
    }
  }
}