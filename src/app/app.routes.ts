import { Routes } from '@angular/router';
import { NewsGridComponent } from './news-grid/news-grid.component';
import { MostReadClickedComponent } from './most-read-clicked/most-read-clicked.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'news', component: NewsGridComponent, canActivate: [AuthGuard] },
  { path: 'most-read-clicked', component: MostReadClickedComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' }
];