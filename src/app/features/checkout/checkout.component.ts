import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  shippingForm: FormGroup;
  paymentForm: FormGroup;
  isProcessing = false;
  orderNumber = '';
  
  private fb = inject(FormBuilder);
  cartService = inject(CartService);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  
  constructor() {
    // Initialize shipping form
    this.shippingForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required]
    });
    
    // Initialize payment form
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/[0-9]{2}$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]]
    });
    
    // If cart is empty, redirect to products
    if (this.cartService.totalItems() === 0) {
      this.router.navigate(['/products']);
    }
  }
  
  placeOrder(): void {
    if (this.shippingForm.invalid || this.paymentForm.invalid) {
      return;
    }
    
    this.isProcessing = true;
    
    // Create order with shipping address from form
    const order = this.orderService.createOrder({
      name: this.shippingForm.get('name')?.value,
      address: this.shippingForm.get('address')?.value,
      city: this.shippingForm.get('city')?.value,
      postalCode: this.shippingForm.get('postalCode')?.value
    });
    
    if (order) {
      this.orderNumber = order.id.toString();
      // Move to confirmation step
      setTimeout(() => {
        this.isProcessing = false;
        // Angular Material stepper is 0-indexed
        const stepperElement = document.querySelector('mat-horizontal-stepper, mat-vertical-stepper');
        if (stepperElement) {
          (stepperElement as any).selectedIndex = 3; // Move to confirmation step
        }
      }, 1500);
    } else {
      this.isProcessing = false;
      this.snackBar.open('Error creating order', 'Close', {
        duration: 3000
      });
    }
  }
  
  maskCardNumber(cardNumber: string): string {
    if (!cardNumber) return '';
    return cardNumber.slice(-4);
  }
}
