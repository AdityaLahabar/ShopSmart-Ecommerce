import { Injectable, computed, effect, signal } from '@angular/core';
import { Cart, CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private STORAGE_KEY = 'shopping_cart';
  private cartItemsSignal = signal<CartItem[]>(this.getCartFromStorage());
  
  // Computed values based on cart items
  cartItems = this.cartItemsSignal.asReadonly();
  
  totalItems = computed(() => 
    this.cartItems().reduce((total, item) => total + item.quantity, 0)
  );
  
  totalPrice = computed(() => 
    this.cartItems().reduce((total, item) => 
      total + (item.product.price * item.quantity), 0)
  );
  
  cart = computed<Cart>(() => ({
    items: this.cartItems(),
    totalItems: this.totalItems(),
    totalPrice: this.totalPrice()
  }));

  constructor(private authService: AuthService) {
    // Clear cart when user logs out
    effect(() => {
      const user = this.authService.currentUser();
      if (!user) {
        this.clearCart();
      }
    });
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItems();
    const existingItemIndex = currentItems.findIndex(
      item => item.product.id === product.id
    );
    
    if (existingItemIndex !== -1) {
      // Update existing item quantity
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity
      };
      this.cartItemsSignal.set(updatedItems);
    } else {
      // Add new item
      this.cartItemsSignal.set([...currentItems, { product, quantity }]);
    }
    
    this.saveCartToStorage();
  }
  
  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    
    const updatedItems = this.cartItems().map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    );
    
    this.cartItemsSignal.set(updatedItems);
    this.saveCartToStorage();
  }
  
  removeFromCart(productId: number): void {
    const updatedItems = this.cartItems().filter(
      item => item.product.id !== productId
    );
    
    this.cartItemsSignal.set(updatedItems);
    this.saveCartToStorage();
  }
  
  clearCart(): void {
    this.cartItemsSignal.set([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }
  
  private getCartFromStorage(): CartItem[] {
    const cartData = localStorage.getItem(this.STORAGE_KEY);
    return cartData ? JSON.parse(cartData) : [];
  }
  
  private saveCartToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cartItems()));
  }
}
