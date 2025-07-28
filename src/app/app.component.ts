// import { Component, OnInit } from '@angular/core';
// import { RouterOutlet, Router } from '@angular/router';
// import { AuthService } from './services/auth.service';
// import { MaterialModule } from './material.module';
// import { CommonModule } from '@angular/common';


// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [RouterOutlet, MaterialModule, CommonModule],
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })
// export class AppComponent implements OnInit {


  
//   showMostReadNews()
//   {
//     console.log("En çok okunan haberler gösteriliyor");
//   }
//   title = 'AI News Engine Panel';

//   constructor(
//     public authService: AuthService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     // Sayfa yüklendiğinde token doğrulama yap
//     if (this.authService.isLoggedIn()) {
//       this.authService.validateToken().subscribe({
//         next: (isValid) => {
//           if (!isValid) {
//             console.log('Token invalid, redirecting to login');
//             this.router.navigate(['/login']);
//           }
//         },
//         error: () => {
//           console.log('Token validation failed, redirecting to login');
//           this.router.navigate(['/login']);
//         }
//       });
//     }
//   }

//   logout(): void {
//     this.authService.logout().subscribe({
//       next: () => {
//         this.router.navigate(['/login']);
//       },
//       error: (error) => {
//         console.error('Logout error:', error);
//         this.router.navigate(['/login']);
//       }
//     });
//   }

//   get currentUsername(): string {
//     return this.authService.currentUserValue?.username || '';
//   }
// }

// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MaterialModule } from './material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MaterialModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

showHaberler() {
    console.log("Haberler gösteriliyor");
    this.router.navigate(['/news']);
  }
  showMostReadNews() {
    console.log("En çok okunan haberler gösteriliyor");
    // BURAYA BU SATIRI EKLEYİN:
    this.router.navigate(['/mostRead']); 
  }

 showMostClickedNews() {
    console.log("En çok tıklanan haberler gösteriliyor");
    this.router.navigate(['/mostClicked']);
 }

  title = 'AI News Engine Panel';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Sayfa yüklendiğinde token doğrulama yap
    if (this.authService.isLoggedIn()) {
      this.authService.validateToken().subscribe({
        next: (isValid) => {
          if (!isValid) {
            console.log('Token invalid, redirecting to login');
            this.router.navigate(['/login']);
          }
        },
        error: () => {
          console.log('Token validation failed, redirecting to login');
          this.router.navigate(['/login']);
        }
      });
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        this.router.navigate(['/login']);
      }
    });
  }

  get currentUsername(): string {
    return this.authService.currentUserValue?.username || '';
  }
}
