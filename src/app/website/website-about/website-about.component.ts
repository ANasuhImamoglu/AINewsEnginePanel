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
      name: 'Ahmet Nasuh İmamoğlu',
      position: 'Kurucu & Geliştirici',
      image: 'assets/team/team1.jpg',
      bio: 'AI ve haber teknolojileri alanında uzman, projenin kurucusu.',
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
    { value: '50,000+', label: 'Aktif Kullanıcı' },
    { value: '25+', label: 'Haber Kategorisi' },
    { value: '99.9%', label: 'Uptime' }
  ];
}
