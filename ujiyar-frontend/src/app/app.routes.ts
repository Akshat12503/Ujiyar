import { authGuard } from './core/guards/auth-guard';
import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './features/auth/auth-layout/auth-layout.component';
import { DashboardLayoutComponent } from './features/dashboard/dashboard-layout/dashboard-layout.component';
import { DashboardOverviewComponent } from './features/dashboard/dashboard-overview/dashboard-overview.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { AiCompanionComponent } from './features/ai-support/ai-companion/ai-companion.component';
import { CommunityHubComponent } from './features/community/community-hub/community-hub.component';
import { TherapistFinderComponent } from './features/community/therapist-finder/therapist-finder.component';

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
    canActivate: [authGuard], // <--- The guard is now protecting this entire section
    children: [
      { path: '', component: DashboardOverviewComponent },
      { path: 'ai-companion', component: AiCompanionComponent },
      { path: 'community', component: CommunityHubComponent },
      { path: 'therapist-finder', component: TherapistFinderComponent }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];