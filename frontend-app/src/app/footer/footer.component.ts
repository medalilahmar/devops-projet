import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  
  quickLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/departments', label: 'Départements' },
    { path: '/studentslist', label: 'Étudiants' },
    { path: '/about', label: 'À propos' }
  ];
  
  socialLinks = [
    { icon: 'facebook', url: '#', label: 'Facebook' },
    { icon: 'twitter', url: '#', label: 'Twitter' },
    { icon: 'linkedin', url: '#', label: 'LinkedIn' },
    { icon: 'instagram', url: '#', label: 'Instagram' }
  ];
}