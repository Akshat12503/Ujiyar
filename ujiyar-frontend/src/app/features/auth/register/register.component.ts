import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Create your safe space
        </h2>
        <p class="mt-2 text-center text-sm text-slate-600">
          Already have an account?
          <a routerLink="/auth/login" class="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
            Sign in instead
          </a>
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-100">
          <form class="space-y-6" (ngSubmit)="onSubmit()">
            
            <div>
              <label class="block text-sm font-medium text-slate-700">Display Name</label>
              <div class="mt-1">
                <input type="text" [(ngModel)]="formData.displayName" name="displayName" required 
                  class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700">Email address</label>
              <div class="mt-1">
                <input type="email" [(ngModel)]="formData.email" name="email" required 
                  class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700">Password</label>
              <div class="mt-1">
                <input type="password" [(ngModel)]="formData.password" name="password" required 
                  class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
            </div>

            <div *ngIf="errorMessage" class="text-red-500 text-sm mt-2">
              {{ errorMessage }}
            </div>

            <div>
              <button type="submit" [disabled]="isLoading" 
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                <span *ngIf="isLoading">Creating...</span>
                <span *ngIf="!isLoading">Create account</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  isLoading = false;
  errorMessage = '';

  formData = {
    displayName: '',
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.formData).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to create account. Email might be in use.';
      }
    });
  }
}