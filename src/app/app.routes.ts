import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './features/auth/auth-layout/auth-layout.component';
import { DashboardLayoutComponent } from './features/dashboard/dashboard-layout/dashboard-layout.component';
import { DashboardOverviewComponent } from './features/dashboard/dashboard-overview/dashboard-overview.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { AiCompanionComponent } from './features/ai-support/ai-companion/ai-companion.component'; // Added import

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent }
    ]
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    children: [
      { path: '', component: DashboardOverviewComponent },
      { path: 'ai-companion', component: AiCompanionComponent } // Registered AI navigation endpoint layout node
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];