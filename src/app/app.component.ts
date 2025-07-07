// import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';

// @Component({
//   selector: 'app-root',
//   imports: [RouterOutlet],
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.css'
// })
// export class AppComponent {
//   title = 'AINewsEngineFrontEnd';
// }

import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NewsGridComponent } from './news-grid/news-grid.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NewsGridComponent, HttpClientModule], // HttpClientModule eklendi
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AINewsEngineFrontEnd';
}
