import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-website-about',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './website-about.component.html',
  styleUrls: ['./website-about.component.css']
})
export class WebsiteAboutComponent {
  teamMembers = [
    {
      name: 'İsmail Emirhan Yazıcı',
      position: 'Frontend Geliştirici',
      image: 'assets/team/team1.jpg',
      bio: 'Angular ve modern web teknolojileri konusunda uzman.',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      }
    },
   {
      name: 'Eren Özgül',
      position: 'Backend Geliştirici',
      image: 'assets/team/team2.jpg',
      bio: '.NET Core ve veritabanı yönetimi alanında deneyimli.',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      }
    },
    {
      name: 'Ahmet Nasuh İmamoğlu',
      position: 'Kurucu & Proje Yöneticisi',
      image: 'assets/team/team3.jpg',
      bio: 'Backend API geliştirme ve AI teknolojileri alanında deneyimli, projenin kurucusu.',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      }
    },
    {
      name: 'Taha Yiğit Göksu',
      position: 'UI/UX Tasarımcı',
      image: 'assets/team/team4.jpg',
      bio: 'Kullanıcı deneyimi ve arayüz tasarımı konusunda yaratıcı çözümler sunar. Çapraz platform mobil uygulamalar geliştirerek modern ve kullanıcı dostu arayüzler tasarlar.',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      }
    }
  ];

  features = [
    {
      icon: 'speed',
      title: 'Hızlı Haber Erişimi',
      description: 'En güncel haberlere anında ulaşın'
    },
    {
      icon: 'smart_toy',
      title: 'AI Destekli Analiz',
      description: 'Yapay zeka ile haber analizi ve önerileri'
    },
    {
      icon: 'trending_up',
      title: 'Trend Takibi',
      description: 'En çok okunan ve trend olan haberleri keşfedin'
    },
    {
      icon: 'filter_list',
      title: 'Gelişmiş Filtreleme',
      description: 'Kategori ve anahtar kelime ile haber filtreleme'
    }
  ];

  stats = [
    { value: '10,000+', label: 'Günlük Haber' },
    { value: '70,000+', label: 'Aktif Kullanıcı' },
    { value: '25+', label: 'Haber Kategorisi' },
    { value: '99.9%', label: 'Uptime' }
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    
  }
}
