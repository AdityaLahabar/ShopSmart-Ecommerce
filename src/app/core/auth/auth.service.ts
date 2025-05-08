import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'auth_user';
  private readonly HARDCODED_USERS: User[] = [
    { id: 1, email: 'admin@test.com', name: 'Admin User', role: 'admin' },
    { id: 2, email: 'customer@test.com', name: 'Customer User', role: 'customer' }
  ];

  private currentUserSignal = signal<User | null>(this.getUserFromStorage());
  currentUser = this.currentUserSignal.asReadonly();

  constructor(private router: Router) {}

  login(email: string, password: string): boolean {
    // In a real app, we would validate against a backend
    // For demo purposes, password is hardcoded as 'password'
    if (password !== 'password') return false;
    
    const user = this.HARDCODED_USERS.find(u => u.email === email);
    if (user) {
      this.saveUserToStorage(user);
      this.currentUserSignal.set(user);
      this.router.navigate([user.role === 'admin' ? '/admin' : '/']);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSignal();
  }

  isAdmin(): boolean {
    return this.currentUserSignal()?.role === 'admin';
  }

  private saveUserToStorage(user: User): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

  private getUserFromStorage(): User | null {
    const userData = localStorage.getItem(this.STORAGE_KEY);
    return userData ? JSON.parse(userData) : null;
  }
}
