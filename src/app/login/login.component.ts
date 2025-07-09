import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MaterialModule } from '../material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MaterialModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  hidePassword: boolean = true;
  isLoading: boolean = false;
  backendStatus: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Zaten giriş yapmışsa ana sayfaya yönlendir
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/news']);
    }
  }

  ngOnInit(): void {
    // Backend bağlantısını kontrol et
    this.checkBackendConnection();
  }

  checkBackendConnection(): void {
    // Backend bağlantısını test et
    this.authService.testConnection().subscribe({
      next: (isConnected) => {
        if (isConnected) {
          this.backendStatus = 'Backend API bağlantısı başarılı!';
        } else {
          this.backendStatus = 'Backend API\'ye bağlanılamıyor. Sunucu çalışmıyor olabilir.';
        }
        console.log('Backend connection test result:', isConnected);
      },
      error: (error) => {
        this.backendStatus = 'Backend bağlantı testi başarısız.';
        console.error('Backend connection test error:', error);
      }
    });
  }

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Kullanıcı adı ve şifre gereklidir.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.username, this.password).subscribe({
      next: (success) => {
        this.isLoading = false;
        if (success) {
          this.router.navigate(['/news']);
        } else {
          this.errorMessage = 'Geçersiz kullanıcı adı veya şifre.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login error:', error);
        
        // Backend hatası durumunda kullanıcı dostu mesaj
        if (error.status === 0) {
          this.errorMessage = 'Sunucuya bağlanılamıyor. İnternet bağlantınızı kontrol edin.';
        } else if (error.status === 401) {
          this.errorMessage = 'Geçersiz kullanıcı adı veya şifre.';
        } else if (error.status === 403) {
          this.errorMessage = 'Hesabınız devre dışı bırakılmış. Yönetici ile iletişime geçin.';
        } else if (error.status >= 500) {
          this.errorMessage = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
        } else {
          this.errorMessage = 'Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.';
        }
      }
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
