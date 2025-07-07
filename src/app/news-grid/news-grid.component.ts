// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common'; // CommonModule eklendi
// import { NewsService, Haber } from '../services/news.service';

// @Component({
//   selector: 'app-news-grid',
//   standalone: true,
  
//   imports: [],
//   templateUrl: './news-grid.component.html',
//   styleUrls: ['./news-grid.component.css']
// })
// export class NewsGridComponent implements OnInit {
//   haberler: Haber[] = [];

//   constructor(private newsService: NewsService) { }

//   ngOnInit(): void {
//     this.newsService.getNews().subscribe({
//       next: (data) => {
//         this.haberler = data;
//       },
//       error: (err) => {
//         console.error('Haberler yüklenemedi:', err);
//       }
//     });
//   }
// // }
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common'; // CommonModule eklendi
// import { NewsService, Haber } from '../services/news.service';

// @Component({
//   selector: 'app-news-grid',
//   standalone: true,
//   imports: [CommonModule], // CommonModule eklendi
//   templateUrl: './news-grid.component.html',
//   styleUrls: ['./news-grid.component.css']
// })
// export class NewsGridComponent implements OnInit {
//   haberler: Haber[] = [];

//   constructor(private newsService: NewsService) { }

//   ngOnInit(): void {
//     this.newsService.getNews().subscribe({
//       next: (data) => {
//         this.haberler = data;
//       },
//       error: (err) => {
//         console.error('Haberler yüklenemedi:', err);
//       }
//     });
//   }
// }

// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common'; // CommonModule içe aktarımı
// import { NewsService, Haber } from '../services/news.service';

// @Component({
//   selector: 'app-news-grid',
//   standalone: true,
//   imports: [CommonModule], // CommonModule burada ekli
//   templateUrl: './news-grid.component.html',
//   styleUrls: ['./news-grid.component.css']
// })
// export class NewsGridComponent implements OnInit {
//   haberler: Haber[] = [];

//   constructor(private newsService: NewsService) { }

//   ngOnInit(): void {
//     this.newsService.getNews().subscribe({
//       next: (data) => {
//         this.haberler = data;
//       },
//       error: (err) => {
//         console.error('Haberler yüklenemedi:', err);
//       }
//     });
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NewsService, Haber } from '../services/news.service';

@Component({
  selector: 'app-news-grid',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './news-grid.component.html',
  styleUrls: ['./news-grid.component.css']
})
export class NewsGridComponent implements OnInit {
  haberler: Haber[] = [];

  constructor(private newsService: NewsService) { }

  ngOnInit(): void {
    this.newsService.getNews().subscribe({
      next: (data) => {
        this.haberler = data;
      },
      error: (err) => {
        console.error('Haberler yüklenemedi:', err);
      }
    });
  }
/*
  ahmetButonTest(data: any): void {
    
    console.log(data);
    console.log('Button clicked!');
  }
*/

approveNews(id: number): void {
    this.newsService.approveNews(id).subscribe({
      next: (updatedHaber) => {
        const index = this.haberler.findIndex(h => h.id === id);
        if (index !== -1) {
          this.haberler[index] = updatedHaber;
        }
        console.log(`Haber ${id} onaylandı`);
      },
      error: (err) => {
        console.error('Haber onaylanamadı:', err);
      }
    });
  }


}