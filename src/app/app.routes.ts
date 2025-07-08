import { Routes } from '@angular/router';
import { NewsGridComponent } from './news-grid/news-grid.component';
import { MostReadClickedComponent } from './most-read-clicked/most-read-clicked.component'; // Yeni componenti import edin

export const routes: Routes = [
  { path: '', redirectTo: '/news', pathMatch: 'full' },
  { path: 'news', component: NewsGridComponent },
  { path: 'most-read-clicked', component: MostReadClickedComponent }, // Yeni rota
  { path: '**', redirectTo: '/news' }
];