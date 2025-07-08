import { Routes } from '@angular/router';
import { NewsGridComponent } from './news-grid/news-grid.component';

export const routes: Routes = [
  { path: '', redirectTo: '/news', pathMatch: 'full' },
  { path: 'news', component: NewsGridComponent },
  { path: '**', redirectTo: '/news' }
];
