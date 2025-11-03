import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  features = [
    {
      icon: 'dashboard',
      title: 'Tableau de Bord Complet',
      description: 'Visualisez toutes vos données importantes en un seul endroit avec des graphiques et statistiques.'
    },
    {
      icon: 'groups',
      title: 'Gestion des Étudiants',
      description: 'Gérez les inscriptions, les profils et les informations des étudiants efficacement.'
    },
    {
      icon: 'business',
      title: 'Administration des Départements',
      description: 'Organisez et administrez vos départements académiques avec facilité.'
    },
    {
      icon: 'security',
      title: 'Sécurité des Données',
      description: 'Vos données sont sécurisées et protégées avec les dernières technologies.'
    }
  ];

  team = [
    {
      name: 'John Doe',
      role: 'Développeur Full-Stack',
      avatar: 'JD',
      description: 'Spécialiste Angular et Spring Boot avec 5 ans d\'expérience.'
    },
    {
      name: 'Jane Smith',
      role: 'Designer UI/UX',
      avatar: 'JS',
      description: 'Créatrice d\'interfaces utilisateur intuitives et modernes.'
    },
    {
      name: 'Mike Johnson',
      role: 'Architecte Logiciel',
      avatar: 'MJ',
      description: 'Expert en architecture des systèmes et bonnes pratiques.'
    }
  ];
}