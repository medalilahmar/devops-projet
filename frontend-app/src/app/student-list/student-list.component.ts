import { Component, OnInit, OnDestroy } from '@angular/core';
import { StudentService } from '../core/services/student.service';
import { Student } from '../core/entities/student.model';
import { MatDialog } from '@angular/material/dialog';
import { StudentFormComponent } from '../student-form/student-form.component';
import { Subject, takeUntil, finalize } from 'rxjs'; // Ajout de 'finalize'
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit, OnDestroy {
  students: Student[] = [];
  // Colonnes utilisées par la mat-table, avec un ordre lisible
  displayedColumns: string[] = ['idStudent', 'firstName', 'lastName', 'email', 'actions']; 
  loading = true;
  deletingId: number | null = null; // Nouvelle variable pour indiquer la suppression en cours
  private destroy$ = new Subject<void>();

  constructor(
    private studentService: StudentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadStudents(): void {
    this.loading = true; // S'assurer que le spinner est montré lors du rechargement
    this.studentService.students$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (students: Student[]) => {
          this.students = students;
          this.loading = false;
        },
        error: (err) => { // Utilisez 'err' pour une meilleure gestion des erreurs
          console.error('Error loading students', err);
          this.loading = false;
          this.snackBar.open('❌ Échec du chargement des étudiants. Veuillez réessayer.', 'Fermer', { duration: 5000 });
        }
      });
  }

  openStudentForm(student?: Student): void {
    const dialogRef = this.dialog.open(StudentFormComponent, {
      width: '600px', // Plus de largeur pour le formulaire
      disableClose: true, // Empêche la fermeture par clic en dehors
      data: student || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Au lieu de simplement rafraîchir, vous pourriez ajouter/mettre à jour l'étudiant 
        // directement dans le tableau pour une mise à jour instantanée sans rechargement complet, 
        // mais pour l'instant, gardons le refresh simple et efficace.
        this.studentService.refresh();
      }
    });
  }

  deleteStudent(id: number): void {
    // Utilisez MatDialog pour une meilleure confirmation que le 'window.confirm'
    // Pour cet exemple, je garde 'confirm' pour la simplicité, mais un composant de confirmation
    // serait la solution WOW.
    if (confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ? Cette action est irréversible.')) {
      this.deletingId = id; // Début de la suppression: active le spinner sur la ligne
      
      this.studentService.deleteStudent(id)
        .pipe(
          takeUntil(this.destroy$),
          // 'finalize' est crucial pour désactiver le spinner, qu'il y ait succès ou échec
          finalize(() => this.deletingId = null) 
        )
        .subscribe({
          next: () => {
            this.snackBar.open('✅ Étudiant supprimé avec succès!', 'Fermer', { duration: 3000 });
            this.studentService.refresh(); // Rafraîchir la liste
          },
          error: (err) => {
            console.error('Error deleting student', err);
            this.snackBar.open('❌ Échec de la suppression de l\'étudiant.', 'Fermer', { duration: 5000 });
          }
        });
    }
  }
}