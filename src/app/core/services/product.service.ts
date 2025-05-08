import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private STORAGE_KEY = 'products';
  private productsSignal = signal<Product[]>(this.getInitialProducts());
  products = this.productsSignal.asReadonly();
  
  private nextId = this.calculateNextId();

  constructor() {
    // Initialize with sample data if no products exist
    if (this.products().length === 0) {
      this.initSampleProducts();
    }
  }

  getAll(): Product[] {
    return this.products();
  }

  getById(id: number): Product | undefined {
    return this.products().find(p => p.id === id);
  }

  getByCategory(category: string): Product[] {
    return this.products().filter(p => p.category === category);
  }

  getCategories(): string[] {
    return [...new Set(this.products().map(p => p.category))];
  }

  filterProducts(category?: string, minPrice?: number, maxPrice?: number): Product[] {
    return this.products().filter(product => {
      const categoryMatch = !category || product.category === category;
      const minPriceMatch = !minPrice || product.price >= minPrice;
      const maxPriceMatch = !maxPrice || product.price <= maxPrice;
      return categoryMatch && minPriceMatch && maxPriceMatch;
    });
  }

  addProduct(product: Omit<Product, 'id'>): Product {
    const newProduct = { ...product, id: this.nextId++ };
    const updatedProducts = [...this.products(), newProduct];
    this.productsSignal.set(updatedProducts);
    this.saveProducts();
    return newProduct;
  }

  updateProduct(product: Product): void {
    const updatedProducts = this.products().map(p => 
      p.id === product.id ? product : p
    );
    this.productsSignal.set(updatedProducts);
    this.saveProducts();
  }

  deleteProduct(id: number): void {
    const updatedProducts = this.products().filter(p => p.id !== id);
    this.productsSignal.set(updatedProducts);
    this.saveProducts();
  }

  private getInitialProducts(): Product[] {
    const storedProducts = localStorage.getItem(this.STORAGE_KEY);
    return storedProducts ? JSON.parse(storedProducts) : [];
  }

  private saveProducts(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.products()));
  }

  private calculateNextId(): number {
    const products = this.products();
    return products.length > 0 
      ? Math.max(...products.map(p => p.id)) + 1 
      : 1;
  }

  private initSampleProducts(): void {
    const sampleProducts: Product[] = [
      {
        id: 1,
        name: 'Smartphone X',
        description: 'Latest model with advanced features',
        price: 799.99,
        imageUrl: 'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Electronics',
        inStock: true
      },
      {
        id: 2,
        name: 'Wireless Headphones',
        description: 'Premium sound quality with noise cancellation',
        price: 149.99,
        imageUrl: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Electronics',
        inStock: true
      },
      {
        id: 3,
        name: 'Running Shoes',
        description: 'Lightweight and comfortable for long distance running',
        price: 89.99,
        imageUrl: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Clothing',
        inStock: true
      },
      {
        id: 4,
        name: 'Coffee Maker',
        description: 'Programmable coffee maker with built-in grinder',
        price: 129.99,
        imageUrl: 'https://images.pexels.com/photos/362216/pexels-photo-362216.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: 'Home',
        inStock: true
      },
      {
        id: 5,
        name: 'Yoga Mat',
        description: 'Non-slip surface for all types of yoga',
        price: 29.99,
        imageUrl: 'https://images.pexels.com/photos/4498155/pexels-photo-4498155.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Fitness',
        inStock: true
      },
      {
        id: 6,
        name: 'Smart Watch',
        description: 'Track fitness and receive notifications',
        price: 199.99,
        imageUrl: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=600',
        category: 'Electronics',
        inStock: true
      }
    ];
    
    this.productsSignal.set(sampleProducts);
    this.saveProducts();
    this.nextId = 7;
  }
}