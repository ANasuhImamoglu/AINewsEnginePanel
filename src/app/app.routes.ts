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
import { WebsiteLayoutComponent } from './website/website-layout.component';
import { HomeComponent } from './website/home/home.component';
import { WebsiteNewsComponent } from './website/website-news/website-news.component';
import { WebsiteAboutComponent } from './website/website-about/website-about.component';
import { NewsDetailComponent } from './website/news-detail/news-detail.component';
import { MostReadNewsComponent } from './most-read-news/most-read-news.component';
import { MostClickedNewsComponent } from './most-clicked-news/most-clicked-news.component';

export const routes: Routes = [
  { path: '', redirectTo: '/website/home', pathMatch: 'full' },
  
  // Public Website Routes
  {
    path: 'website',
    component: WebsiteLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'news', component: WebsiteNewsComponent },
      { path: 'news/:id', component: NewsDetailComponent },
      { path: 'about', component: WebsiteAboutComponent }
    ]
  },
  
  // Admin Panel Routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'news', component: NewsGridComponent, canActivate: [AuthGuard] },
  { path: 'most-read', component: MostReadNewsComponent, canActivate: [AuthGuard] },
  { path: 'most-clicked', component: MostClickedNewsComponent, canActivate: [AuthGuard] },
  { path: 'about-us', component: AboutUsComponent },
  
  { path: '**', redirectTo: '/website/home' }
];