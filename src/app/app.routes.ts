// import { Routes } from '@angular/router';
// import { NewsGridComponent } from './news-grid/news-grid.component';
// import { LoginComponent } from './login/login.component';
// import { RegisterComponent } from './register/register.component';
// import { AuthGuard } from './guards/auth.guard';

// export const routes: Routes = [
//   { path: '', redirectTo: '/login', pathMatch: 'full' },
//   { path: 'login', component: LoginComponent },
//   { path: 'register', component: RegisterComponent },
//   { path: 'news', component: NewsGridComponent, canActivate: [AuthGuard] },
//   { path: '**', redirectTo: '/login' }
// ];

// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { NewsGridComponent } from './news-grid/news-grid.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { AboutUsComponent } from './about-us/about-us.component';
import { MostReadNewsComponent } from './most-read-news/most-read-news.component'; // <-- Bu satırı ekleyin
import { MostClickedNewsComponent } from './most-clicked-news/most-clicked-news.component'; // <-- En çok tıklanan haberler için bileşeni ekleyin

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'news', component: NewsGridComponent, canActivate: [AuthGuard] },
  { path: 'mostRead', component: MostReadNewsComponent, canActivate: [AuthGuard] }, // <-- Bu satırı ekleyin
  { path: 'mostClicked', component: MostClickedNewsComponent, canActivate: [AuthGuard] }, // <-- En çok tıklanan haberler için rota ekleyin
  { path: 'about-us', component: AboutUsComponent },
  { path: '**', redirectTo: '/login' }
];