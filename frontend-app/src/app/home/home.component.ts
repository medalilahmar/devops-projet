import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DepartmentService } from '../core/services/department.service';
import { StudentService } from '../core/services/student.service';
import { Department } from '../core/entities/department.model';

interface Stats {
  totalDepartments: number;
  totalStudents: number;
  recentActivity: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  stats: Stats = {
    totalDepartments: 0,
    totalStudents: 0,
    recentActivity: 12
  };
  
  loading = true;
  quickActions = [
    {
      icon: 'add_business',
      title: 'Nouveau Département',
      description: 'Ajouter un nouveau département',
      route: '/departments',
      action: 'create',
      color: 'primary'
    },
    {
      icon: 'person_add',
      title: 'Nouvel Étudiant',
      description: 'Inscrire un nouvel étudiant',
      route: '/students',
      action: 'create',
      color: 'accent'
    },
    {
      icon: 'school',
      title: 'Voir Départements',
      description: 'Consulter tous les départements',
      route: '/departments',
      action: 'view',
      color: 'warn'
    },
    {
      icon: 'groups',
      title: 'Liste des Étudiants',
      description: 'Voir tous les étudiants',
      route: '/students',
      action: 'view',
      color: 'primary'
    }
  ];

  recentDepartments: Department[] = [];

  constructor(
    private departmentService: DepartmentService,
    private studentService: StudentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadStats(): void {
    // Pour les départements
    this.departmentService.getAllDepartments()
      .pipe(takeUntil(this.destroy$))
      .subscribe((departments: Department[]) => {
        this.stats.totalDepartments = departments.length;
        this.recentDepartments = departments.slice(-4);
        this.updateLoadingState();
      });

    // Pour les étudiants
    this.studentService.getAllStudents()
      .pipe(takeUntil(this.destroy$))
      .subscribe((students: any[]) => {
        this.stats.totalStudents = students.length;
        this.updateLoadingState();
      });
  }

  private updateLoadingState(): void {
    // On considère que le chargement est terminé quand on a au moins les départements
    if (this.stats.totalDepartments >= 0) {
      this.loading = false;
    }
  }

  // Méthode pour obtenir les statistiques sous forme de tableau
  getStatsArray() {
    return [
      { key: 'departments', value: this.stats.totalDepartments, label: 'Départements' },
      { key: 'students', value: this.stats.totalStudents, label: 'Étudiants' },
      { key: 'activity', value: this.stats.recentActivity, label: 'Activité Récente' }
    ];
  }

  // Méthode pour obtenir l'icône correspondante
  getStatIcon(statKey: string): string {
    const icons: {[key: string]: string} = {
      departments: 'business',
      students: 'groups',
      activity: 'trending_up'
    };
    return icons[statKey] || 'help';
  }

  getCardColor(index: number): string {
    const colors = ['primary', 'accent', 'warn'];
    return colors[index % colors.length];
  }

  navigateTo(route: string, action?: string): void {
    this.router.navigate([route]);
  }
}