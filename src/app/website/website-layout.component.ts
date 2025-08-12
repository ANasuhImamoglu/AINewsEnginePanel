
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
  currentYear = new Date().getFullYear();
  mobileMenuOpen = false;

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

  constructor(private router: Router, private authService:AuthService) {}

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

    logout() {
    this.authService.logout();
  }
}