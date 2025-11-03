import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Student, StudentForm } from '../entities/student.model';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly API_URL = `${environment.apiUrl}/students`;
  
  private studentsSubject = new BehaviorSubject<Student[]>([]);
  public students$ = this.studentsSubject.asObservable();
  
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStudents();
  }

  private loadStudents(): void {
    this.loadingSubject.next(true);
    this.http.get<Student[]>(`${this.API_URL}/getAllStudents`)
      .pipe(catchError(this.handleError))
      .subscribe({
        next: (students: Student[]) => {
          this.studentsSubject.next(students);
          this.loadingSubject.next(false);
        },
        error: (error) => {
          this.loadingSubject.next(false);
          this.handleError(error);
        }
      });
  }

  // Méthode pour obtenir tous les étudiants (Observable)
  getAllStudents(): Observable<Student[]> {
    return this.students$;
  }

  // Méthode pour obtenir tous les étudiants (Promise - alternative)
  getStudents(): Promise<Student[]> {
    return this.http.get<Student[]>(`${this.API_URL}/getAllStudents`)
      .pipe(catchError(this.handleError))
      .toPromise()
      .then(students => students || []);
  }

  getStudent(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.API_URL}/getStudent/${id}`)
      .pipe(catchError(this.handleError));
  }

  createStudent(student: StudentForm): Observable<Student> {
    this.loadingSubject.next(true);
    return this.http.post<Student>(`${this.API_URL}/createStudent`, student)
      .pipe(
        tap((newStudent: Student) => {
          const current = this.studentsSubject.value;
          this.studentsSubject.next([...current, newStudent]);
          this.loadingSubject.next(false);
        }),
        catchError(this.handleError)
      );
  }

  updateStudent(student: Student): Observable<Student> {
    this.loadingSubject.next(true);
    return this.http.put<Student>(`${this.API_URL}/updateStudent`, student)
      .pipe(
        tap((updatedStudent: Student) => {
          const current = this.studentsSubject.value;
          const updated = current.map(std => 
            std.idStudent === updatedStudent.idStudent ? updatedStudent : std
          );
          this.studentsSubject.next(updated);
          this.loadingSubject.next(false);
        }),
        catchError(this.handleError)
      );
  }

  deleteStudent(id: number): Observable<void> {
    this.loadingSubject.next(true);
    return this.http.delete<void>(`${this.API_URL}/deleteStudent/${id}`)
      .pipe(
        tap(() => {
          const current = this.studentsSubject.value;
          const updated = current.filter(std => std.idStudent !== id);
          this.studentsSubject.next(updated);
          this.loadingSubject.next(false);
        }),
        catchError(this.handleError)
      );
  }

  refresh(): void {
    this.loadStudents();
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      errorMessage = `Erreur ${error.status}: ${error.message}`;
    }
    
    console.error('StudentService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

export { Student };
