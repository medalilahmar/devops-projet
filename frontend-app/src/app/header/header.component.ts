import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  title = 'Student Management';
  mobileMenuOpen = false; // ← AJOUTÉ
  
  navItems = [
    { path: '/', icon: 'home', label: 'Accueil' },
    { path: '/departments', icon: 'business', label: 'Départements' },
    { path: '/studentslist', icon: 'groups', label: 'Étudiants' },
    { path: '/about', icon: 'info', label: 'À propos' }
  ];

  constructor(private router: Router) {}

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }

  // ← AJOUTÉ: Méthode pour toggle le menu mobile
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.mobileMenuOpen = false; // Ferme le menu après navigation
  }
}