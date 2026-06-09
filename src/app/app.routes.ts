import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './features/auth/auth-layout/auth-layout.component';
import { DashboardLayoutComponent } from './features/dashboard/dashboard-layout/dashboard-layout.component';
import { DashboardOverviewComponent } from './features/dashboard/dashboard-overview/dashboard-overview.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: DashboardOverviewComponent }
    ]
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    children: [
      { path: '', component: DashboardOverviewComponent }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];