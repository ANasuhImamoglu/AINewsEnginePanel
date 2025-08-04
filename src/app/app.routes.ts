import { Routes } from '@angular/router';
import { NewsGridComponent } from './news-grid/news-grid.component';
import { MostReadClickedComponent } from './most-read-clicked/most-read-clicked.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { AboutUsComponent } from './about-us/about-us.component';
import { WebsiteLayoutComponent } from './website/website-layout.component';
import { HomeComponent } from './website/home/home.component';
import { WebsiteNewsComponent } from './website/website-news/website-news.component';
import { WebsiteAboutComponent } from './website/website-about/website-about.component';
import { NewsDetailComponent } from './website/news-detail/news-detail.component';

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
  { path: 'most-read-clicked', component: MostReadClickedComponent, canActivate: [AuthGuard] },
  { path: 'about-us', component: AboutUsComponent },
  
  { path: '**', redirectTo: '/website/home' }
];