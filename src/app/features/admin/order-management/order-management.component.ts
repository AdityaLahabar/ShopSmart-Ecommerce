import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Order } from '../../../core/models/order.model';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatSelectModule,
    MatMenuModule,
    MatSnackBarModule
  ],
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.css'
})
export class OrderManagementComponent implements OnInit {
  orders: Order[] = [];
  
  private orderService = inject(OrderService);
  private snackBar = inject(MatSnackBar);
  
  ngOnInit(): void {
    this.loadOrders();
  }
  
  loadOrders(): void {
    this.orders = this.orderService.getAllOrders();
    // Sort by date, most recent first
    this.orders.sort((a, b) => b.date.getTime() - a.date.getTime());
  }
  
  updateOrderStatus(orderId: number, status: Order['status']): void {
    this.orderService.updateOrderStatus(orderId, status);
    this.loadOrders();
    this.snackBar.open(`Order #${orderId} status updated to ${status}`, 'Close', {
      duration: 3000
    });
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