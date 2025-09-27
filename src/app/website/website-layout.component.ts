
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MaterialModule } from '../material.module';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-website-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './website-layout.component.html',
  styleUrls: ['./website-layout.component.css']
})
export class WebsiteLayoutComponent {
  // Döviz, altın, borsa property'leri
  exchangeRates = {
    USD: '42.10',
    EUR: '47.50',
    Gold: '4250 TL',
    BIST: '10.200'
  };
  currentYear = new Date().getFullYear();
  mobileMenuOpen = false;

  // Güncel saat için property
  currentTime: string = '';
    currentDate: string = '';

  navigationItems = [
    { path: '/website/home', label: 'Ana Sayfa', icon: 'home' },
    { path: '/website/news', label: 'Haberler', icon: 'article' },
    { path: '/website/about', label: 'Hakkımızda', icon: 'info' }
  ];

  socialLinks = [
    { url: '#', icon: 'facebook', label: 'Facebook' },
    { url: '#', icon: 'twitter', label: 'Twitter' },
    { url: '#', icon: 'instagram', label: 'Instagram' },
    { url: '#', icon: 'linkedin', label: 'LinkedIn' }
  ];

  constructor(private router: Router, private authService:AuthService) {
    this.updateCurrentTime();
    setInterval(() => this.updateCurrentTime(), 1000);
      this.updateCurrentDate();
      setInterval(() => this.updateCurrentDate(), 60000);
  this.updateExchangeRates();
  setInterval(() => this.updateExchangeRates(), 60000);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  logout() {
    this.authService.logout();
  }

  // Saat bilgisini güncelleyen fonksiyon
  updateCurrentTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  // Döviz, altın, borsa verilerini güncelleyen fonksiyon (dummy)
  updateExchangeRates(): void {
    // Gerçek API ile entegre edilebilir. Şimdilik dummy random değişim.
    this.exchangeRates.USD = (42 + Math.random()).toFixed(2);
    this.exchangeRates.EUR = (47 + Math.random()).toFixed(2);
    this.exchangeRates.Gold = (4250 + Math.floor(Math.random() * 10)) + ' TL';
    this.exchangeRates.BIST = (10200 + Math.floor(Math.random() * 50)).toString();
  }
  
    // Tarih bilgisini güncelleyen fonksiyon
    updateCurrentDate(): void {
      const now = new Date();
      this.currentDate = now.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
    }
} 