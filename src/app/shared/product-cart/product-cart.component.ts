import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Product } from '../../core/models/product.model';
import { AuthService } from '../../core/auth/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-product-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './product-cart.component.html',
  styleUrl: './product-cart.component.css'
})
export class ProductCartComponent {
  @Input() product!: Product;
  
  constructor(
    private cartService: CartService,
    public authService: AuthService,
    private snackBar: MatSnackBar
  ) {}
  
  addToCart(): void {
    this.cartService.addToCart(this.product);
    this.snackBar.open(`${this.product.name} added to cart`, 'Close', {
      duration: 3000
    });
  }
}
