import { Injectable, signal } from '@angular/core';
import { Order } from '../models/order.model';
import { CartService } from './cart.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private STORAGE_KEY = 'orders';
  private ordersSignal = signal<Order[]>(this.getOrdersFromStorage());
  orders = this.ordersSignal.asReadonly();
  
  private nextOrderId = this.calculateNextOrderId();

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {}

  getAllOrders(): Order[] {
    return this.orders();
  }
  
  getUserOrders(): Order[] {
    const currentUser = this.authService.currentUser();
    if (!currentUser) return [];
    
    return this.orders().filter(order => order.userId === currentUser.id);
  }
  
  getOrderById(id: number): Order | undefined {
    return this.orders().find(order => order.id === id);
  }
  
  createOrder(shippingAddress: Order['shippingAddress']): Order | null {
    const currentUser = this.authService.currentUser();
    if (!currentUser) return null;
    
    const cart = this.cartService.cart();
    if (cart.items.length === 0) return null;
    
    const newOrder: Order = {
      id: this.nextOrderId++,
      userId: currentUser.id,
      items: [...cart.items],
      total: cart.totalPrice,
      date: new Date(),
      status: 'pending',
      shippingAddress
    };
    
    const updatedOrders = [...this.orders(), newOrder];
    this.ordersSignal.set(updatedOrders);
    this.saveOrdersToStorage();
    
    // Clear cart after successful order
    this.cartService.clearCart();
    
    return newOrder;
  }
  
  updateOrderStatus(orderId: number, status: Order['status']): void {
    const updatedOrders = this.orders().map(order =>
      order.id === orderId ? { ...order, status } : order
    );
    
    this.ordersSignal.set(updatedOrders);
    this.saveOrdersToStorage();
  }
  
  private getOrdersFromStorage(): Order[] {
    const ordersData = localStorage.getItem(this.STORAGE_KEY);
    if (!ordersData) return [];
    
    // Parse and ensure date objects are restored correctly
    const orders = JSON.parse(ordersData);
    return orders.map((order: any) => ({
      ...order,
      date: new Date(order.date)
    }));
  }
  
  private saveOrdersToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.orders()));
  }
  
  private calculateNextOrderId(): number {
    const orders = this.orders();
    return orders.length > 0 
      ? Math.max(...orders.map(o => o.id)) + 1 
      : 1;
  }
}